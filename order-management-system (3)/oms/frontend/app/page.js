import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Multi-Store Order Management</h1>
      <p className="text-slate-600">manage orders across stores with live status updates</p>
      <div className="flex gap-3">
        <Link href="/orders/create" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Create Order</Link>
        <Link href="/orders" className="px-4 py-2 border rounded-md hover:bg-slate-50">View Orders</Link>
      </div>
    </div>
  );
}
