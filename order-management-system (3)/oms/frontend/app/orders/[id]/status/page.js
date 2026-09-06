import StatusUpdater from "@/components/StatusUpdater";

export default function UpdateStatusPage({ params }) {
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Update Order Status</h1>
      <StatusUpdater orderId={params.id} />
    </div>
  );
}
