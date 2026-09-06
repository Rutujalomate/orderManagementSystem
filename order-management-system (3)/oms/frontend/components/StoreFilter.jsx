"use client";

const STORES = [
  { id: "store_1", name: "Store 1 - MG Road" },
  { id: "store_2", name: "Store 2 - Koregaon Park" },
  { id: "store_3", name: "Store 3 - Baner" },
];

export default function StoreFilter({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="border rounded-md px-3 py-2 text-sm bg-white">
      <option value="all">Select a store…</option>
      {STORES.map((s) => (
        <option key={s.id} value={s.id}>{s.name}</option>
      ))}
    </select>
  );
}

export { STORES };
