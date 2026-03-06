import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { formatPrice } from "@/lib/utils";
import type { Product } from "@/types";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AddToCartButton } from "../cart/add-to-cart-button";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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

  return (
    <Card className="group overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-neutral-100">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-neutral-300" />
            </div>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 left-2" variant="destructive">
              -{discountPercent}%
            </Badge>
          )}
          {product.featured && (
            <Badge className="absolute top-2 right-2">Featured</Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {product.category && (
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-400">
            {product.category}
          </p>
        )}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-neutral-900 hover:text-neutral-600 line-clamp-2 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2">
          <span className="font-bold text-neutral-900">
            {formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-neutral-400 line-through">
              {formatPrice(product.compareAtPrice as number)}
            </span>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <AddToCartButton
          productId={product.id}
          disabled={isOutOfStock}
          className="w-full"
        />
      </CardFooter>
    </Card>
  );
}
