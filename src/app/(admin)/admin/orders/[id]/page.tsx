import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrderById, updateOrderStatus } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Order Details – Admin",
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

const allStatuses: Order["status"][] = [
  "pending",
  "processing",
  "completed",
  "cancelled",
];

function UpdateStatusForm({
  orderId,
  currentStatus,
}: {
  orderId: number;
  currentStatus: Order["status"];
}) {
  async function handleUpdate(formData: FormData) {
    "use server";
    const status = formData.get("status") as Order["status"];
    await updateOrderStatus(orderId, status);
  }

  return (
    <form action={handleUpdate} className="flex items-center gap-3">
      <select
        name="status"
        defaultValue={currentStatus}
        className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
      >
        {allStatuses.map((s) => (
          <option key={s} value={s}>
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </option>
        ))}
      </select>
      <Button type="submit" size="sm">
        Update Status
      </Button>
    </form>
  );
}

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (Number.isNaN(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/orders"
            className="text-sm text-neutral-500 hover:text-neutral-900"
          >
            ← Back to Orders
          </Link>
          <h1 className="mt-1 text-3xl font-bold text-neutral-900">
            Order #{order.id}
          </h1>
        </div>
        <Badge variant={statusVariant[order.status]} className="text-sm">
          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 p-6">
              <h2 className="font-semibold text-neutral-900">Items</h2>
            </div>
            <div className="divide-y divide-neutral-200">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {item.product?.name ?? "Deleted Product"}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {formatPrice(item.unitPrice)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-neutral-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-200 p-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Update Status */}
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">
              Update Status
            </h2>
            <UpdateStatusForm
              orderId={order.id}
              currentStatus={order.status}
            />
          </div>
        </div>

        {/* Customer & Shipping */}
        <div className="space-y-6">
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">
              Customer Details
            </h2>
            <div className="space-y-2 text-sm">
              <div>
                <p className="text-neutral-500">Name</p>
                <p className="font-medium text-neutral-900">
                  {order.customerName}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">
                  {order.customerEmail}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">
              Shipping Address
            </h2>
            <p className="text-sm text-neutral-600">{order.shippingAddress}</p>
          </div>

          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-4 font-semibold text-neutral-900">
              Order Timeline
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500">Placed</span>
                <span className="text-neutral-900">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Last Updated</span>
                <span className="text-neutral-900">
                  {new Date(order.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
