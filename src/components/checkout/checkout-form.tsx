"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createOrder } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { CartSummary } from "@/types";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface CheckoutFormProps {
  cart: CartSummary;
}

export function CheckoutForm({ cart }: CheckoutFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const address = [
      formData.get("address") as string,
      formData.get("city") as string,
      formData.get("state") as string,
      formData.get("zip") as string,
      formData.get("country") as string,
    ]
      .filter(Boolean)
      .join(", ");

    startTransition(async () => {
      const result = await createOrder({
        customerName: formData.get("name") as string,
        customerEmail: formData.get("email") as string,
        shippingAddress: address,
      });

      if (result.success) {
        router.push(`/order-confirmation/${result.data.id}`);
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Contact Information */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  placeholder="Jane Smith"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="jane@example.com"
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address *</Label>
                <Input
                  id="address"
                  name="address"
                  required
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    required
                    placeholder="New York"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State / Province *</Label>
                  <Input
                    id="state"
                    name="state"
                    required
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="zip">ZIP / Postal Code *</Label>
                  <Input
                    id="zip"
                    name="zip"
                    required
                    placeholder="10001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    required
                    defaultValue="United States"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Payment Placeholder */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4">
            <h2 className="text-lg font-semibold text-neutral-900">
              Payment
            </h2>
            <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-center">
              <p className="text-sm font-medium text-neutral-600">
                Payment Gateway Integration
              </p>
              <p className="mt-1 text-xs text-neutral-400">
                Integrate Stripe, PayPal, or your preferred payment provider
                here. This is a placeholder for a boilerplate setup.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {error}
            </p>
          )}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isPending || cart.items.length === 0}
          >
            {isPending ? "Placing Order..." : "Place Order"}
          </Button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-4 sticky top-24">
          <h2 className="text-lg font-semibold text-neutral-900">
            Order Summary
          </h2>
          <Separator />
          <div className="space-y-3">
            {cart.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-neutral-600">
                  {item.product.name}{" "}
                  <span className="text-neutral-400">× {item.quantity}</span>
                </span>
                <span className="font-medium text-neutral-900">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Subtotal</span>
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
        </div>
      </div>
    </div>
  );
}
