"use server";

import { db } from "@/lib/db";
import { cartItems, products } from "@/lib/db/schema";
import type { ActionResult, CartItemWithProduct, CartSummary } from "@/types";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session")?.value;
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    cookieStore.set("cart_session", sessionId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }
  return sessionId;
}

async function readSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get("cart_session")?.value ?? null;
}

const addToCartSchema = z.object({
  productId: z.number().int().positive(),
  quantity: z.number().int().positive().max(99),
});

export async function addToCart(
  productId: number,
  quantity: number = 1,
): Promise<ActionResult> {
  const parsed = addToCartSchema.safeParse({ productId, quantity });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const sessionId = await getOrCreateSessionId();

  const product = await db.query.products.findFirst({
    where: eq(products.id, productId),
  });

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  if (product.inventory < quantity) {
    return { success: false, error: "Insufficient inventory" };
  }

  const existing = await db.query.cartItems.findFirst({
    where: and(
      eq(cartItems.sessionId, sessionId),
      eq(cartItems.productId, productId),
    ),
  });

  if (existing) {
    const newQuantity = existing.quantity + quantity;
    if (product.inventory < newQuantity) {
      return { success: false, error: "Insufficient inventory" };
    }
    await db
      .update(cartItems)
      .set({ quantity: newQuantity })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({ sessionId, productId, quantity });
  }

  revalidatePath("/cart");
  return { success: true, data: undefined };
}

const updateCartSchema = z.object({
  cartItemId: z.number().int().positive(),
  quantity: z.number().int().min(0).max(99),
});

export async function updateCartItem(
  cartItemId: number,
  quantity: number,
): Promise<ActionResult> {
  const parsed = updateCartSchema.safeParse({ cartItemId, quantity });
  if (!parsed.success) {
    return { success: false, error: "Invalid input" };
  }

  const sessionId = await getOrCreateSessionId();

  if (quantity === 0) {
    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.sessionId, sessionId),
        ),
      );
  } else {
    await db
      .update(cartItems)
      .set({ quantity })
      .where(
        and(
          eq(cartItems.id, cartItemId),
          eq(cartItems.sessionId, sessionId),
        ),
      );
  }

  revalidatePath("/cart");
  return { success: true, data: undefined };
}

export async function removeFromCart(
  cartItemId: number,
): Promise<ActionResult> {
  const sessionId = await getOrCreateSessionId();

  await db
    .delete(cartItems)
    .where(
      and(eq(cartItems.id, cartItemId), eq(cartItems.sessionId, sessionId)),
    );

  revalidatePath("/cart");
  return { success: true, data: undefined };
}

export async function getCart(): Promise<CartSummary> {
  const sessionId = await readSessionId();

  if (!sessionId) {
    return { items: [], subtotal: 0, itemCount: 0 };
  }

  const items = await db
    .select({
      id: cartItems.id,
      sessionId: cartItems.sessionId,
      quantity: cartItems.quantity,
      product: {
        id: products.id,
        name: products.name,
        slug: products.slug,
        price: products.price,
        imageUrl: products.imageUrl,
        inventory: products.inventory,
      },
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.sessionId, sessionId));

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return { items: items as CartItemWithProduct[], subtotal, itemCount };
}
