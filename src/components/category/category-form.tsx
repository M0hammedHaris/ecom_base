"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createCategory, updateCategory } from "@/lib/actions/categories";
import { slugify } from "@/lib/utils";
import type { Category } from "@/types";
import { useState, useTransition } from "react";

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      name: formData.get("name") as string,
      slug:
        (formData.get("slug") as string) ||
        slugify(formData.get("name") as string),
      description: formData.get("description") as string,
    };

    startTransition(async () => {
      const result = category
        ? await updateCategory(category.id, data)
        : await createCategory(data);

      if (result.success) {
        setError(null);
        setSuccess(true);
        onSuccess?.();
      } else {
        setError(result.error);
        setSuccess(false);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Category Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={category?.name}
            placeholder="e.g., Electronics"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={category?.slug}
            placeholder="auto-generated from name"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={3}
            defaultValue={category?.description}
            placeholder="Short description of this category..."
            className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {error && (
          <p className="flex-1 text-sm text-red-600 self-center">{error}</p>
        )}
        {success && (
          <p className="flex-1 text-sm text-green-600 self-center">
            {category ? "Category updated!" : "Category created!"}
          </p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : category
              ? "Update Category"
              : "Create Category"}
        </Button>
      </div>
    </form>
  );
}
