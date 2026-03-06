"use server";

import { db } from "@/lib/db";
import { cartItems, orderItems, orders, products } from "@/lib/db/schema";
import type { ActionResult, Order, OrderWithItems } from "@/types";
import { and, desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cart_session")?.value ?? null;
}

const createOrderSchema = z.object({
  customerName: z.string().min(1).max(255),
  customerEmail: z.string().email(),
  shippingAddress: z.string().min(1),
});

export async function createOrder(data: {
  customerName: string;
  customerEmail: string;
  shippingAddress: string;
}): Promise<ActionResult<Order>> {
  const parsed = createOrderSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const sessionId = await getSessionId();
  if (!sessionId) {
    return { success: false, error: "No cart session found" };
  }

  // Fetch cart items
  const items = await db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        price: products.price,
        inventory: products.inventory,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.sessionId, sessionId));

  if (items.length === 0) {
    return { success: false, error: "Cart is empty" };
  }

  // Validate inventory
  for (const item of items) {
    if (item.product.inventory < item.quantity) {
      return {
        success: false,
        error: `Insufficient inventory for "${item.product.name}"`,
      };
    }
  }

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );

  // Create order, order items, decrement inventory, and clear cart atomically
  let order: Order;
  try {
    order = await db.transaction(async (tx) => {
      // Re-validate inventory inside the transaction to prevent race conditions
      for (const item of items) {
        const fresh = await tx.query.products.findFirst({
          where: eq(products.id, item.product.id),
        });
        if (!fresh || fresh.inventory < item.quantity) {
          throw new Error(`Insufficient inventory for "${item.product.name}"`);
        }
      }

      const [created] = await tx
        .insert(orders)
        .values({
          sessionId,
          customerName: parsed.data.customerName,
          customerEmail: parsed.data.customerEmail,
          shippingAddress: parsed.data.shippingAddress,
          totalAmount,
          status: "pending",
        })
        .returning();

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: created.id,
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        });

        await tx
          .update(products)
          .set({ inventory: item.product.inventory - item.quantity })
          .where(eq(products.id, item.product.id));
      }

      await tx.delete(cartItems).where(eq(cartItems.sessionId, sessionId));

      return created;
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to place order";
    return { success: false, error: message };
  }

  revalidatePath("/cart");
  revalidatePath("/orders");
  revalidatePath("/admin/orders");
  return { success: true, data: order };
}

export async function getOrders(): Promise<Order[]> {
  const sessionId = await getSessionId();
  if (!sessionId) return [];

  return db
    .select()
    .from(orders)
    .where(eq(orders.sessionId, sessionId))
    .orderBy(desc(orders.createdAt));
}

export async function getOrderById(id: number): Promise<OrderWithItems | null> {
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, id),
  });

  if (!order) return null;

  const items = await db
    .select({
      id: orderItems.id,
      orderId: orderItems.orderId,
      productId: orderItems.productId,
      quantity: orderItems.quantity,
      unitPrice: orderItems.unitPrice,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        imageUrl: products.imageUrl,
      },
    })
    .from(orderItems)
    .leftJoin(products, eq(orderItems.productId, products.id))
    .where(eq(orderItems.orderId, id));

  return { ...order, items };
}

export async function getAllOrders(options?: {
  status?: Order["status"];
  limit?: number;
  offset?: number;
}): Promise<Order[]> {
  const rows = await db
    .select()
    .from(orders)
    .where(options?.status ? eq(orders.status, options.status) : undefined)
    .orderBy(desc(orders.createdAt))
    .limit(options?.limit ?? 100)
    .offset(options?.offset ?? 0);

  return rows;
}

const updateStatusSchema = z.object({
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
});

export async function updateOrderStatus(
  id: number,
  status: Order["status"],
): Promise<ActionResult<Order>> {
  const parsed = updateStatusSchema.safeParse({ status });
  if (!parsed.success) {
    return { success: false, error: "Invalid status" };
  }

  const [updated] = await db
    .update(orders)
    .set({ status: parsed.data.status, updatedAt: new Date() })
    .where(eq(orders.id, id))
    .returning();

  if (!updated) {
    return { success: false, error: "Order not found" };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/orders");
  return { success: true, data: updated };
}
