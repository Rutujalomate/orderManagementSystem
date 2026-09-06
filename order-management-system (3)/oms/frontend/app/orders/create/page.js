import OrderForm from "@/components/OrderForm";

export default function CreateOrderPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Create Order</h1>
      <OrderForm />
    </div>
  );
}
