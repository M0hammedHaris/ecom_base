"use server";

import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import type { ActionResult, Category, NewCategory } from "@/types";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1).max(255),
  slug: z.string().min(1).max(255).regex(/^[a-z0-9-]+$/),
  description: z.string().default(""),
});

export async function getCategories(): Promise<Category[]> {
  return db.select().from(categories);
}

export async function createCategory(
  data: NewCategory,
): Promise<ActionResult<Category>> {
  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  const existing = await db.query.categories.findFirst({
    where: eq(categories.slug, parsed.data.slug),
  });
  if (existing) {
    return { success: false, error: "A category with this slug already exists" };
  }

  const [category] = await db
    .insert(categories)
    .values(parsed.data)
    .returning();

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true, data: category };
}

export async function updateCategory(
  id: number,
  data: Partial<NewCategory>,
): Promise<ActionResult<Category>> {
  const parsed = categorySchema.partial().safeParse(data);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues.map((i) => i.message).join(", "),
    };
  }

  // Check for slug conflicts (excluding the current category)
  if (parsed.data.slug) {
    const conflict = await db.query.categories.findFirst({
      where: eq(categories.slug, parsed.data.slug),
    });
    if (conflict && conflict.id !== id) {
      return { success: false, error: "A category with this slug already exists" };
    }
  }

  const [category] = await db
    .update(categories)
    .set(parsed.data)
    .where(eq(categories.id, id))
    .returning();

  if (!category) {
    return { success: false, error: "Category not found" };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true, data: category };
}

export async function deleteCategory(id: number): Promise<ActionResult> {
  const [deleted] = await db
    .delete(categories)
    .where(eq(categories.id, id))
    .returning();

  if (!deleted) {
    return { success: false, error: "Category not found" };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true, data: undefined };
}
