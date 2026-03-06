import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getOrderById } from "@/lib/actions/orders";
import { formatPrice } from "@/lib/utils";
import { CheckCircle } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Order } from "@/types";

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Your order has been placed successfully.",
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

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderConfirmationPage({
  params,
}: OrderConfirmationPageProps) {
  const { id } = await params;
  const orderId = Number(id);

  if (Number.isNaN(orderId)) notFound();

  const order = await getOrderById(orderId);
  if (!order) notFound();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Success Header */}
        <div className="mb-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">
            Order Placed!
          </h1>
          <p className="mt-2 text-neutral-500">
            Thank you, {order.customerName}! Your order has been received.
          </p>
          <p className="mt-1 text-sm text-neutral-400">
            A confirmation will be sent to{" "}
            <span className="font-medium text-neutral-600">
              {order.customerEmail}
            </span>
          </p>
        </div>

        {/* Order Summary */}
        <div className="rounded-xl border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-200 p-6">
            <div>
              <p className="text-sm text-neutral-500">Order number</p>
              <p className="text-lg font-bold text-neutral-900">#{order.id}</p>
            </div>
            <Badge variant={statusVariant[order.status]}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>

          {/* Items */}
          <div className="p-6 space-y-4">
            <h2 className="font-semibold text-neutral-900">Items Ordered</h2>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-neutral-600">
                    {item.product?.name ?? "Unknown Product"}{" "}
                    <span className="text-neutral-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium text-neutral-900">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span>{formatPrice(order.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
            </div>

            <Separator />

            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(order.totalAmount)}</span>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-neutral-200 p-6">
            <h2 className="mb-2 font-semibold text-neutral-900">
              Shipping To
            </h2>
            <p className="text-sm text-neutral-600">{order.shippingAddress}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/orders"
            className="flex-1 rounded-md border border-neutral-200 bg-white px-4 py-3 text-center text-sm font-medium text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 rounded-md bg-neutral-900 px-4 py-3 text-center text-sm font-medium text-white hover:bg-neutral-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
