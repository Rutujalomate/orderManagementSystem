"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/hooks/useCreateOrder";
import { STORES } from "./StoreFilter";

const emptyItem = () => ({ item_id: "", name: "", qty: 1, price: 0 });

export default function OrderForm() {
  const router = useRouter();
  const [storeId, setStoreId] = useState(STORES[0].id);
  const [items, setItems] = useState([emptyItem()]);
  const [formError, setFormError] = useState("");

  const { mutate, isPending } = useCreateOrder();

  function updateItem(index, field, value) {
    setItems((prev) => prev.map((it, i) => (i === index ? { ...it, [field]: value } : it)));
  }

  function addItem() {
    setItems((prev) => [...prev, emptyItem()]);
  }

  function removeItem(index) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  let total = 0;
  items.forEach((it) => {
    total += Number(it.qty || 0) * Number(it.price || 0);
  });

  function handleSubmit(e) {
    e.preventDefault();
    setFormError("");

    const cleaned = items
      .filter((it) => it.item_id && it.name)
      .map((it) => ({ item_id: it.item_id, name: it.name, qty: Number(it.qty), price: Number(it.price) }));

    if (cleaned.length === 0) {
      setFormError("add at least one valid item");
      return;
    }

    mutate(
      { store_id: storeId, items: cleaned },
      {
        onSuccess: () => router.push("/orders"),
        onError: (err) => setFormError(err.message),
      }
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
      <div>
        <label className="block text-sm font-medium mb-1">Store</label>
        <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="w-full border rounded-md px-3 py-2">
          {STORES.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium">Items</label>
        {items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2 items-center">
            <input className="col-span-3 border rounded-md px-2 py-1.5 text-sm" placeholder="Item ID" value={item.item_id} onChange={(e) => updateItem(i, "item_id", e.target.value)} />
            <input className="col-span-4 border rounded-md px-2 py-1.5 text-sm" placeholder="Name" value={item.name} onChange={(e) => updateItem(i, "name", e.target.value)} />
            <input type="number" min="1" className="col-span-2 border rounded-md px-2 py-1.5 text-sm" placeholder="Qty" value={item.qty} onChange={(e) => updateItem(i, "qty", e.target.value)} />
            <input type="number" min="0" step="0.01" className="col-span-2 border rounded-md px-2 py-1.5 text-sm" placeholder="Price" value={item.price} onChange={(e) => updateItem(i, "price", e.target.value)} />
            <button type="button" onClick={() => removeItem(i)} className="col-span-1 text-red-500 text-sm">✕</button>
          </div>
        ))}
        <button type="button" onClick={addItem} className="text-sm text-blue-600 hover:underline">+ Add item</button>
      </div>

      <p className="text-sm text-slate-600">Total: <span className="font-semibold">₹{total.toFixed(2)}</span></p>

      {formError && <p className="text-sm text-red-600">{formError}</p>}

      <button type="submit" disabled={isPending} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">
        {isPending ? "Placing order…" : "Place Order"}
      </button>
    </form>
  );
}
