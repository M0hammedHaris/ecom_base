"use client";

import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import type { Order } from "@/types";
import Link from "next/link";

const statusVariant: Record<
  Order["status"],
  "default" | "secondary" | "destructive" | "outline"
> = {
  pending: "secondary",
  processing: "default",
  completed: "outline",
  cancelled: "destructive",
};

interface OrderListProps {
  orders: Order[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-2xl font-semibold text-neutral-700">No orders yet</p>
        <p className="mt-2 text-neutral-500">
          Your orders will appear here after checkout.
        </p>
        <Link
          href="/products"
          className="mt-6 inline-flex items-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-xl border border-neutral-200 bg-white p-6"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <p className="font-semibold text-neutral-900">
                  Order #{order.id}
                </p>
                <Badge variant={statusVariant[order.status]}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
              </div>
              <p className="mt-1 text-sm text-neutral-500">
                Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <p className="mt-1 text-sm text-neutral-500">
                {order.customerEmail}
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-neutral-900">
                {formatPrice(order.totalAmount)}
              </p>
              <Link
                href={`/order-confirmation/${order.id}`}
                className="mt-2 inline-block text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:underline"
              >
                View Details →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
