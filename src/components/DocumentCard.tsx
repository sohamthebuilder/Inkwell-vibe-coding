import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
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

function ConfirmDeleteDialog({
  title,
  onConfirm,
  onCancel,
}: {
  title: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    },
    [onCancel]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: visible ? "rgba(0,0,0,0.35)" : "rgba(0,0,0,0)",
        backdropFilter: visible ? "blur(4px)" : "blur(0px)",
        transition: "background 200ms ease, backdrop-filter 200ms ease",
      }}
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm mx-4 p-6 rounded-xl"
        style={{
          background: "var(--white)",
          border: "1px solid var(--greytransparent-200)",
          boxShadow: "0 16px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)",
          opacity: visible ? 1 : 0,
          transform: visible ? "scale(1) translateY(0)" : "scale(0.96) translateY(8px)",
          transition: "opacity 200ms ease, transform 200ms ease",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0"
            style={{ background: "rgba(228, 66, 50, 0.1)" }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-td-primary)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </div>
          <h3
            className="font-serif text-lg font-semibold"
            style={{ color: "var(--display-onlight-primary)" }}
          >
            Delete document
          </h3>
        </div>

        <p
          className="text-sm mb-6"
          style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.6 }}
        >
          Are you sure you want to delete{" "}
          <span className="font-semibold" style={{ color: "var(--display-onlight-primary)" }}>
            {title || "Untitled"}
          </span>
          ? This action cannot be undone.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
            style={{
              color: "var(--display-onlight-secondary)",
              background: "var(--greytransparent-100)",
              border: "1px solid var(--greytransparent-200)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--greytransparent-200)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--greytransparent-100)";
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-semibold text-white rounded-lg transition-colors"
            style={{
              background: "var(--color-td-primary)",
              boxShadow: "0 1px 3px rgba(228, 66, 50, 0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ee5244")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--color-td-primary)")
            }
          >
            Delete
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function DocumentCard({
  id,
  title,
  content,
  updatedAt,
}: DocumentCardProps) {
  const removeDoc = useMutation(api.documents.remove);
  const preview = truncateText(extractPlainText(content), 120);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirm(false);
    await removeDoc({ id });
  };

  return (
    <>
      <Link
        to={`/document/${id}`}
        className="group block rounded-xl p-6 transition-all"
        style={{
          background: "var(--white)",
          border: "1px solid var(--greytransparent-200)",
          boxShadow: "var(--shadow-card-idle)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card-hover)";
          e.currentTarget.style.borderColor = "var(--greytransparent-300)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = "var(--shadow-card-idle)";
          e.currentTarget.style.borderColor = "var(--greytransparent-200)";
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <h3
            className="font-serif text-base font-semibold truncate pr-2 transition-colors"
            style={{ color: "var(--display-onlight-primary)" }}
          >
            {title || "Untitled"}
          </h3>
          <button
            onClick={handleDeleteClick}
            className="opacity-0 group-hover:opacity-100 transition-all p-1 -m-1 shrink-0 rounded-md"
            style={{ color: "var(--display-onlight-tertiary)" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-td-primary)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--display-onlight-tertiary)")}
            title="Delete document"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 6h18M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" y1="11" x2="10" y2="17" />
              <line x1="14" y1="11" x2="14" y2="17" />
            </svg>
          </button>
        </div>
        {preview ? (
          <p
            className="text-sm leading-relaxed line-clamp-3"
            style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.6 }}
          >
            {preview}
          </p>
        ) : (
          <p
            className="text-sm italic"
            style={{ color: "var(--display-onlight-tertiary)" }}
          >
            Empty document
          </p>
        )}
        <p
          className="mt-4 text-xs"
          style={{ color: "var(--display-onlight-tertiary)" }}
        >
          {formatDate(updatedAt)}
        </p>
      </Link>

      {showConfirm && (
        <ConfirmDeleteDialog
          title={title}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </>
  );
}
