"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";
import { useCancelOrder } from "@/hooks/useCancelOrder";

export default function OrderCard({ order }) {
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  return (
    <div className="border rounded-lg p-4 bg-white flex items-center justify-between">
      <div>
        <p className="font-medium">Order #{order._id.slice(-6)}</p>
        <p className="text-sm text-slate-500">
          {order.items.length} item(s) · ₹{order.total_amount.toFixed(2)}
        </p>
        <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-3">
        <StatusBadge status={order.status} />
        <Link href={`/orders/${order._id}/status`} className="text-sm text-blue-600 hover:underline">
          Update
        </Link>
        {order.status === "PLACED" && (
          <button
            onClick={() => {
              if (confirm("cancel this order?")) cancelOrder(order._id);
            }}
            disabled={isPending}
            className="text-sm text-red-500 hover:underline disabled:opacity-40"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
