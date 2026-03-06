import { CartView } from "@/components/cart/cart-view";
import { getCart } from "@/lib/actions/cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart",
  description: "Review items in your shopping cart.",
};

export default async function CartPage() {
  const cart = await getCart();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-neutral-900">
        Shopping Cart
        {cart.itemCount > 0 && (
          <span className="ml-2 text-lg font-normal text-neutral-500">
            ({cart.itemCount} {cart.itemCount === 1 ? "item" : "items"})
          </span>
        )}
      </h1>
      <CartView cart={cart} />
    </div>
  );
}
