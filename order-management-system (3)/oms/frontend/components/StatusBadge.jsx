const styles = {
  PLACED: "bg-amber-100 text-amber-800",
  PREPARING: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}
