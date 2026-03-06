import { getCart } from "@/lib/actions/cart";
import { ShoppingCart, Store } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export async function Header() {
  const cart = await getCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Store className="h-6 w-6" />
          <span>EcomBase</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/products"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Products
          </Link>
          <Link
            href="/products?category=clothing"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Clothing
          </Link>
          <Link
            href="/products?category=electronics"
            className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Electronics
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingCart className="h-5 w-5" />
              {cart.itemCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {cart.itemCount > 99 ? "99+" : cart.itemCount}
                </span>
              )}
              <span className="sr-only">
                Cart ({cart.itemCount} items)
              </span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
