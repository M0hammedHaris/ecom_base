import { AccountForm } from "@/components/auth/account-form";
import { OrderList } from "@/components/order/order-list";
import { getCurrentUser } from "@/lib/actions/auth";
import { getOrders } from "@/lib/actions/orders";
import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account settings and view your orders.",
};

export default async function AccountPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  const orders = await getOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">My Account</h1>
        <p className="mt-1 text-neutral-500">Welcome back, {user.name}!</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="rounded-xl border border-neutral-200 bg-white p-6 space-y-2">
            <div className="pb-4 border-b border-neutral-100">
              <p className="font-semibold text-neutral-900">{user.name}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
            </div>
            <nav className="space-y-1 pt-2">
              <Link
                href="/account"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Account Settings
              </Link>
              <Link
                href="/orders"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                My Orders
              </Link>
              <Link
                href="/products"
                className="block rounded-lg px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
              >
                Browse Products
              </Link>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <AccountForm user={user} />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-neutral-900">
                Recent Orders
              </h2>
              {orders.length > 3 && (
                <Link
                  href="/orders"
                  className="text-sm text-neutral-500 hover:text-neutral-900"
                >
                  View all →
                </Link>
              )}
            </div>
            <OrderList orders={orders.slice(0, 3)} />
          </div>
        </div>
      </div>
    </div>
  );
}
