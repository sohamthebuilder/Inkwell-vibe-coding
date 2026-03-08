import { Link } from "react-router-dom";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import { formatDate, truncateText, extractPlainText } from "../lib/utils";

interface DocumentCardProps {
  id: Id<"documents">;
  title: string;
  content: string;
  updatedAt: number;
}

export default function DocumentCard({
  id,
  title,
  content,
  updatedAt,
}: DocumentCardProps) {
  const removeDoc = useMutation(api.documents.remove);
  const preview = truncateText(extractPlainText(content), 120);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Delete this document? This cannot be undone.")) {
      await removeDoc({ id });
    }
  };

  return (
    <Link
      to={`/document/${id}`}
      className="group block bg-white rounded-2xl border border-cream-200 p-6
                 hover:shadow-md hover:border-cream-300 transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-serif text-lg font-semibold text-ink-800 group-hover:text-accent-600 transition-colors truncate pr-2">
          {title || "Untitled"}
        </h3>
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 text-ink-300 hover:text-red-500
                     transition-all p-1 -m-1 shrink-0"
          title="Delete document"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
          </svg>
        </button>
      </div>
      {preview ? (
        <p className="text-ink-400 text-sm leading-relaxed line-clamp-3">
          {preview}
        </p>
      ) : (
        <p className="text-ink-300 text-sm italic">Empty document</p>
      )}
      <p className="mt-4 text-xs text-ink-300">{formatDate(updatedAt)}</p>
    </Link>
  );
}
