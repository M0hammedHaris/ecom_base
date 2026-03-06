import { getProducts } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingCart, TrendingUp } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "EcomBase admin dashboard.",
};

export default async function AdminDashboard() {
  const products = await getProducts();
  const outOfStock = products.filter((p) => p.inventory === 0).length;
  const featured = products.filter((p) => p.featured).length;
  const totalInventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.inventory,
    0,
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
        <p className="mt-1 text-neutral-500">
          Overview of your store performance.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            label: "Total Products",
            value: products.length,
            icon: Package,
            href: "/admin/products",
          },
          {
            label: "Featured Products",
            value: featured,
            icon: TrendingUp,
            href: "/admin/products",
          },
          {
            label: "Out of Stock",
            value: outOfStock,
            icon: ShoppingCart,
            href: "/admin/products",
          },
          {
            label: "Inventory Value",
            value: formatPrice(totalInventoryValue),
            icon: TrendingUp,
            href: "/admin/products",
          },
        ].map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="flex flex-col rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-neutral-500">
                {stat.label}
              </span>
              <stat.icon className="h-5 w-5 text-neutral-400" />
            </div>
            <p className="mt-3 text-2xl font-bold text-neutral-900">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      {/* Recent Products */}
      <div className="rounded-xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b border-neutral-200 p-6">
          <h2 className="text-lg font-semibold text-neutral-900">
            Recent Products
          </h2>
          <Link
            href="/admin/products"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            View all →
          </Link>
        </div>
        <div className="divide-y divide-neutral-200">
          {products.slice(0, 5).map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between p-4"
            >
              <div>
                <p className="font-medium text-neutral-900">{product.name}</p>
                <p className="text-sm text-neutral-500">{product.category}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-neutral-900">
                  {formatPrice(product.price)}
                </p>
                <p className="text-sm text-neutral-500">
                  {product.inventory} in stock
                </p>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="p-8 text-center text-neutral-500">
              No products yet.{" "}
              <Link
                href="/admin/products"
                className="font-medium text-neutral-900 hover:underline"
              >
                Add your first product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
