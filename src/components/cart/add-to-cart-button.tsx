"use client";

import { Button } from "@/components/ui/button";
import { addToCart } from "@/lib/actions/cart";
import { cn } from "@/lib/utils";
import { ShoppingCart } from "lucide-react";
import { useTransition } from "react";

interface AddToCartButtonProps {
  productId: number;
  quantity?: number;
  disabled?: boolean;
  className?: string;
}

export function AddToCartButton({
  productId,
  quantity = 1,
  disabled = false,
  className,
}: AddToCartButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      await addToCart(productId, quantity);
    });
  }

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isPending}
      className={cn(className)}
      size="sm"
    >
      <ShoppingCart className="mr-2 h-4 w-4" />
      {isPending ? "Adding..." : disabled ? "Out of Stock" : "Add to Cart"}
    </Button>
  );
}
