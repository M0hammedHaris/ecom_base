"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { removeFromCart, updateCartItem } from "@/lib/actions/cart";
import { formatPrice } from "@/lib/utils";
import type { CartSummary } from "@/types";
import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTransition } from "react";

interface CartViewProps {
  cart: CartSummary;
}

export function CartView({ cart }: CartViewProps) {
  const [isPending, startTransition] = useTransition();

  if (cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-neutral-700">
          Your cart is empty
        </p>
        <p className="mt-2 text-neutral-500">
          Add some products to get started.
        </p>
        <Button asChild className="mt-6">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <div
            key={item.id}
            className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              {item.product.imageUrl ? (
                <Image
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              ) : (
                <div className="h-full w-full bg-neutral-200" />
              )}
            </div>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <Link
                    href={`/products/${item.product.slug}`}
                    className="font-semibold text-neutral-900 hover:underline"
                  >
                    {item.product.name}
                  </Link>
                  <p className="mt-1 text-sm text-neutral-500">
                    {formatPrice(item.product.price)} each
                  </p>
                </div>
                <p className="font-bold text-neutral-900">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border border-neutral-200">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-r-none"
                    disabled={isPending}
                    onClick={() => {
                      startTransition(async () => {
                        await updateCartItem(item.id, item.quantity - 1);
                      });
                    }}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-l-none"
                    disabled={
                      isPending || item.quantity >= item.product.inventory
                    }
                    onClick={() => {
                      startTransition(async () => {
                        await updateCartItem(item.id, item.quantity + 1);
                      });
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-700"
                  disabled={isPending}
                  onClick={() => {
                    startTransition(async () => {
                      await removeFromCart(item.id);
                    });
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove {item.product.name}</span>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold">Order Summary</h2>
          <Separator />

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">
                Subtotal ({cart.itemCount} items)
              </span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>{formatPrice(cart.subtotal)}</span>
          </div>

          <Button size="lg" className="w-full" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>

          <Button variant="outline" size="lg" className="w-full" asChild>
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
