export default function Pagination({ pagination, onPageChange }) {
  if (!pagination) return null;
  const { page, totalPages, hasNextPage, hasPrevPage } = pagination;

  return (
    <div className="flex items-center justify-between mt-4 text-sm">
      <button disabled={!hasPrevPage} onClick={() => onPageChange(page - 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40">
        Previous
      </button>
      <span className="text-slate-600">Page {page} of {totalPages}</span>
      <button disabled={!hasNextPage} onClick={() => onPageChange(page + 1)} className="px-3 py-1.5 border rounded-md disabled:opacity-40">
        Next
      </button>
    </div>
  );
}
