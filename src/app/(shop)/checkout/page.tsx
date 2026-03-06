import { CheckoutForm } from "@/components/checkout/checkout-form";
import { getCart } from "@/lib/actions/cart";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order.",
};

export default async function CheckoutPage() {
  const cart = await getCart();

  if (cart.items.length === 0) {
    redirect("/cart");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Checkout</h1>
        <p className="mt-1 text-neutral-500">
          <Link href="/cart" className="hover:underline">
            ← Back to Cart
          </Link>
        </p>
      </div>
      <CheckoutForm cart={cart} />
    </div>
  );
}
