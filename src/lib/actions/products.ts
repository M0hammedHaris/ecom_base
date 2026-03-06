"use server";

import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import type { ActionResult, NewProduct, Product } from "@/types";
import { SQL, and, desc, eq, or, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().default(""),
  price: z.number().int().positive(),
  compareAtPrice: z.number().int().positive().optional(),
  inventory: z.number().int().min(0).default(0),
  category: z.string().default(""),
  imageUrl: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
});

export async function getProducts(options?: {
  category?: string;
  featured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<Product[]> {
  const conditions: SQL[] = [];

  if (options?.category) {
    conditions.push(eq(products.category, options.category));
  }

  if (options?.featured !== undefined) {
    conditions.push(eq(products.featured, options.featured));
  }

  if (options?.search) {
    const searchLower = `%${options.search.toLowerCase()}%`;
    conditions.push(
      or(
        sql`lower(${products.name}) like ${searchLower}`,
        sql`lower(${products.description}) like ${searchLower}`,
      ) as SQL,
    );
  }

  const rows = await db
    .select()
    .from(products)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(products.createdAt))
    .limit(options?.limit ?? 100)
    .offset(options?.offset ?? 0);

  return rows;
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  return db.query.products.findFirst({
    where: eq(products.slug, slug),
  });
}

export async function createProduct(
  data: NewProduct,
): Promise<ActionResult<Product>> {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [product] = await db
    .insert(products)
    .values(parsed.data)
    .returning();

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, data: product };
}

export async function updateProduct(
  id: number,
  data: Partial<NewProduct>,
): Promise<ActionResult<Product>> {
  const parsed = productSchema.partial().safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const [product] = await db
    .update(products)
    .set({ ...parsed.data, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!product) {
    return { success: false, error: "Product not found" };
  }

  revalidatePath("/products");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath("/admin/products");
  return { success: true, data: product };
}

export async function deleteProduct(id: number): Promise<ActionResult> {
  const [deleted] = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  if (!deleted) {
    return { success: false, error: "Product not found" };
  }

  revalidatePath("/products");
  revalidatePath("/admin/products");
  return { success: true, data: undefined };
}
