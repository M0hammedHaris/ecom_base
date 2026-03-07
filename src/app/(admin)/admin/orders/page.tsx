import { Badge } from "@/components/ui/badge";
import { getAllOrders, updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Orders – Admin",
  description: "Manage customer orders.",
};

const statusVariant: Record<
  Order["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  completed: "outline",
  cancelled: "destructive",
};

const nextStatus: Record<Order["status"], Order["status"] | null> = {
  pending: "processing",
  processing: "completed",
  completed: null,
  cancelled: null,
};

function AdvanceStatusButton({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: Order["status"];
}) {
  const next = nextStatus[currentStatus];
  if (!next) return null;

  async function handleAdvance() {
    "use server";
    await updateOrderStatus(orderId, next as Order["status"]);
  }

  return (
    <form action={handleAdvance}>
      <Button type="submit" size="sm" variant="outline">
        Mark as {next.charAt(0).toUpperCase() + next.slice(1)}
      </Button>
    </form>
  );
}

function CancelButton({ orderId }: { orderId: number }) {
  async function handleCancel() {
    "use server";
    await updateOrderStatus(orderId, "cancelled");
  }

  return (
    <form action={handleCancel}>
      <Button type="submit" size="sm" variant="destructive">
        Cancel
      </Button>
    </form>
  );
}

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  const revenue = orders
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pending = orders.filter((o) => o.status === "pending").length;
  const processing = orders.filter((o) => o.status === "processing").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Orders</h1>
        <p className="mt-1 text-neutral-500">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {formatPrice(revenue)}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">{pending}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-6">
          <p className="text-sm text-neutral-500">Processing</p>
          <p className="mt-1 text-2xl font-bold text-neutral-900">
            {processing}
          </p>
        </div>
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">All Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-neutral-900 hover:underline"
                    >
                      #{order.id}
                    </Link>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        {order.customerName}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {order.customerEmail}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant[order.status]}>
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-neutral-500 hover:text-neutral-900 hover:underline"
                      >
                        View
                      </Link>
                      <AdvanceStatusButton
                        orderId={order.id}
                        currentStatus={order.status}
                      />
                      {order.status !== "cancelled" &&
                        order.status !== "completed" && (
                          <CancelButton orderId={order.id} />
                        )}
                    </div>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-neutral-500"
                  >
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
