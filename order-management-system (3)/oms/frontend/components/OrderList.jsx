"use client";

import { useState } from "react";
import { useOrders } from "@/hooks/useOrders";
import OrderCard from "./OrderCard";
import Pagination from "./Pagination";
import StoreFilter from "./StoreFilter";

export default function OrderList() {
  const [storeId, setStoreId] = useState("all");
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const limit = 10;

  const { data, isLoading, isError, error } = useOrders({ storeId, page, limit, status });

  const visibleOrders = (data?.data || []).filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o._id.toLowerCase().includes(q) || o.items.some((it) => it.name.toLowerCase().includes(q));
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <StoreFilter
          value={storeId}
          onChange={(v) => {
            setStoreId(v);
            setPage(1);
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="border rounded-md px-3 py-2 text-sm bg-white"
        >
          <option value="">All statuses</option>
          <option value="PLACED">Placed</option>
          <option value="PREPARING">Preparing</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="search by order id or item..."
          className="border rounded-md px-3 py-2 text-sm bg-white flex-1 min-w-[200px]"
        />
      </div>

      {storeId === "all" && <p className="text-slate-500 text-sm">Select a store to view its orders.</p>}
      {isLoading && storeId !== "all" && <p className="text-slate-500">Loading orders…</p>}
      {isError && <p className="text-red-600 text-sm">{error?.message}</p>}
      {data && visibleOrders.length === 0 && <p className="text-slate-500 text-sm">No orders match.</p>}

      <div className="space-y-3">
        {visibleOrders.map((order) => (
          <OrderCard key={order._id} order={order} />
        ))}
      </div>

      {data?.pagination && !search && <Pagination pagination={data.pagination} onPageChange={setPage} />}
    </div>
  );
}
