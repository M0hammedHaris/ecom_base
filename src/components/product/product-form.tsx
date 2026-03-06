"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createProduct, updateProduct } from "@/lib/actions/products";
import { slugify } from "@/lib/utils";
import type { Product } from "@/types";
import { useState, useTransition } from "react";

interface ProductFormProps {
  product?: Product;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
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
      price: Math.round(
        Number.parseFloat(formData.get("price") as string) * 100,
      ),
      compareAtPrice: formData.get("compareAtPrice")
        ? Math.round(
            Number.parseFloat(formData.get("compareAtPrice") as string) * 100,
          )
        : undefined,
      inventory: Number.parseInt(formData.get("inventory") as string, 10),
      category: formData.get("category") as string,
      imageUrl: formData.get("imageUrl") as string,
      featured: formData.get("featured") === "on",
    };

    startTransition(async () => {
      const result = product
        ? await updateProduct(product.id, data)
        : await createProduct(data);

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
          <Label htmlFor="name">Product Name *</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={product?.name}
            placeholder="e.g., Classic White T-Shirt"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={product?.slug}
            placeholder="auto-generated from name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Price (USD) *</Label>
          <Input
            id="price"
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product ? (product.price / 100).toFixed(2) : ""}
            placeholder="29.99"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="compareAtPrice">Compare At Price (USD)</Label>
          <Input
            id="compareAtPrice"
            name="compareAtPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={
              product?.compareAtPrice
                ? (product.compareAtPrice / 100).toFixed(2)
                : ""
            }
            placeholder="39.99"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inventory">Inventory *</Label>
          <Input
            id="inventory"
            name="inventory"
            type="number"
            min="0"
            required
            defaultValue={product?.inventory ?? 0}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            name="category"
            defaultValue={product?.category}
            placeholder="clothing, electronics..."
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            type="url"
            defaultValue={product?.imageUrl}
            placeholder="https://example.com/image.jpg"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            rows={4}
            defaultValue={product?.description}
            placeholder="Product description..."
            className="flex w-full rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={product?.featured}
            className="h-4 w-4 rounded border-neutral-300"
          />
          <Label htmlFor="featured">Featured product</Label>
        </div>
      </div>

      <div className="flex justify-end gap-3">
        {error && (
          <p className="flex-1 text-sm text-red-600 self-center">{error}</p>
        )}
        {success && (
          <p className="flex-1 text-sm text-green-600 self-center">
            {product ? "Product updated!" : "Product created!"}
          </p>
        )}
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
