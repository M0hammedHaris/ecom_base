"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { addToCart } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState, useTransition } from "react";

interface ProductDetailProps {
  product: Product;
}

export function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(1);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const isOutOfStock = product.inventory === 0;
  const hasDiscount =
    product.compareAtPrice !== null &&
    product.compareAtPrice !== undefined &&
    product.compareAtPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        (1 - product.price / (product.compareAtPrice as number)) * 100,
      )
    : 0;

  function handleAddToCart() {
    startTransition(async () => {
      const result = await addToCart(product.id, quantity);
      if (result.success) {
        setMessage("Added to cart!");
        setTimeout(() => setMessage(null), 3000);
      } else {
        setMessage(result.error);
        setTimeout(() => setMessage(null), 3000);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-neutral-100">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ShoppingCart className="h-24 w-24 text-neutral-300" />
          </div>
        )}
        {hasDiscount && (
          <Badge className="absolute top-4 left-4" variant="destructive">
            -{discountPercent}% OFF
          </Badge>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-col space-y-6">
        {product.category && (
          <p className="text-sm font-medium uppercase tracking-wider text-neutral-400">
            {product.category}
          </p>
        )}

        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-neutral-900">{product.name}</h1>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-neutral-900">
              {formatPrice(product.price)}
            </span>
            {hasDiscount && (
              <span className="text-lg text-neutral-400 line-through">
                {formatPrice(product.compareAtPrice as number)}
              </span>
            )}
          </div>
        </div>

        <Separator />

        <div>
          <p className="text-neutral-600 leading-relaxed">{product.description}</p>
        </div>

        <Separator />

        {/* Inventory */}
        <div className="flex items-center gap-2">
          <div
            className={`h-2.5 w-2.5 rounded-full ${
              isOutOfStock
                ? "bg-red-500"
                : product.inventory <= 5
                  ? "bg-yellow-500"
                  : "bg-green-500"
            }`}
          />
          <p className="text-sm text-neutral-600">
            {isOutOfStock
              ? "Out of stock"
              : product.inventory <= 5
                ? `Only ${product.inventory} left in stock`
                : "In stock"}
          </p>
        </div>

        {/* Quantity Selector */}
        {!isOutOfStock && (
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-neutral-700">Quantity</span>
            <div className="flex items-center rounded-md border border-neutral-200">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-r-none"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </Button>
              <span className="w-12 text-center text-sm font-medium">
                {quantity}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-l-none"
                onClick={() =>
                  setQuantity(Math.min(product.inventory, quantity + 1))
                }
                disabled={quantity >= product.inventory}
              >
                <Plus className="h-3 w-3" />
              </Button>
            </div>
          </div>
        )}

        {/* Add to Cart */}
        <div className="space-y-3">
          <Button
            onClick={handleAddToCart}
            disabled={isOutOfStock || isPending}
            size="lg"
            className="w-full"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isPending ? "Adding..." : isOutOfStock ? "Out of Stock" : "Add to Cart"}
          </Button>
          {message && (
            <p
              className={`text-center text-sm ${
                message === "Added to cart!"
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
