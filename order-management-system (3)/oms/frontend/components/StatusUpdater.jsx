"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { OrdersAPI } from "@/lib/api";
import { useUpdateOrderStatus } from "@/hooks/useUpdateOrderStatus";
import StatusBadge from "./StatusBadge";

const NEXT_STATUS = { PLACED: "PREPARING", PREPARING: "COMPLETED", COMPLETED: null };

export default function StatusUpdater({ orderId }) {
  const router = useRouter();
  const [error, setError] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => OrdersAPI.getById(orderId),
  });

  const { mutate, isPending } = useUpdateOrderStatus();

  if (isLoading) return <p className="text-slate-500">Loading order…</p>;
  if (!data?.data) return <p className="text-red-600">Order not found.</p>;

  const order = data.data;
  const next = NEXT_STATUS[order.status];

  function handleAdvance() {
    if (!next) return;
    setError("");
    mutate({ id: orderId, status: next }, { onSuccess: () => router.refresh(), onError: (err) => setError(err.message) });
  }

  return (
    <div className="space-y-4 max-w-md">
      <div className="flex items-center gap-3">
        <p className="font-medium">Order #{order._id.slice(-6)}</p>
        <StatusBadge status={order.status} />
      </div>
      <p className="text-sm text-slate-500">Store: {order.store_id}</p>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {next ? (
        <button onClick={handleAdvance} disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
          {isPending ? "Updating…" : `Mark as ${next}`}
        </button>
      ) : (
        <p className="text-green-700 text-sm">This order is already completed.</p>
      )}
    </div>
  );
}
