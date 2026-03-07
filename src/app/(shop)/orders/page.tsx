import { OrderList } from "@/components/order/order-list";
import { getOrders } from "@/lib/actions/orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your order history.",
};

export default async function OrdersPage() {
  const orders = await getOrders();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">My Orders</h1>
        <p className="mt-1 text-neutral-500">
          {orders.length > 0
            ? `${orders.length} order${orders.length !== 1 ? "s" : ""} found`
            : "Track and manage your orders"}
        </p>
      </div>
      <OrderList orders={orders} />
    </div>
  );
}
