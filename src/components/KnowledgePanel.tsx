import { useState, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface KnowledgePanelProps {
  documentId: Id<"documents">;
}

export default function KnowledgePanel({ documentId }: KnowledgePanelProps) {
  const knowledge = useQuery(api.knowledge.list, { documentId });
  const addKnowledge = useMutation(api.knowledge.add);
  const removeKnowledge = useMutation(api.knowledge.remove);

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    await addKnowledge({ documentId, title: title.trim(), content: content.trim() });
    setTitle("");
    setContent("");
    setIsAdding(false);
  };

  const handleDelete = async (id: Id<"knowledge">) => {
    await removeKnowledge({ id });
  };

  const inputStyles: React.CSSProperties = {
    background: "var(--white)",
    border: "1px solid var(--greytransparent-300)",
    color: "var(--display-onlight-primary)",
    borderRadius: "var(--border-radius-sm)",
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex items-center justify-between px-4 py-3"
        style={{ borderBottom: "1px solid var(--greytransparent-150)" }}
      >
        <h2
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: "var(--display-onlight-secondary)", letterSpacing: "0.05em" }}
        >
          Knowledge
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs font-semibold transition-colors"
          style={{ color: isAdding ? "var(--display-onlight-tertiary)" : "var(--color-td-primary)" }}
        >
          {isAdding ? "Cancel" : "+ Add"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isAdding && (
          <form
            onSubmit={handleSubmit}
            className="p-4"
            style={{
              borderBottom: "1px solid var(--greytransparent-150)",
              background: "var(--greytransparent-100)",
            }}
          >
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 text-sm mb-2 outline-none transition-all focus:ring-2 focus:ring-[rgba(228,66,50,0.15)] focus:border-[#e44232]"
              style={inputStyles}
              autoFocus
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type reference content..."
              rows={5}
              className="w-full px-3 py-2 text-sm resize-none mb-3 outline-none transition-all focus:ring-2 focus:ring-[rgba(228,66,50,0.15)] focus:border-[#e44232]"
              style={inputStyles}
            />
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="w-full py-2 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "var(--color-td-primary)",
                borderRadius: "var(--border-radius-sm)",
              }}
            >
              Add Knowledge
            </button>
          </form>
        )}

        {knowledge === undefined ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div
                  className="h-4 rounded w-2/3 mb-2"
                  style={{ background: "var(--greytransparent-150)" }}
                />
                <div
                  className="h-3 rounded w-full"
                  style={{ background: "var(--greytransparent-100)" }}
                />
              </div>
            ))}
          </div>
        ) : knowledge.length === 0 && !isAdding ? (
          <div className="p-6 text-center">
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
              style={{ background: "var(--greytransparent-150)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--display-onlight-tertiary)" }}>
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--display-onlight-secondary)" }}
            >
              No knowledge yet
            </p>
            <p
              className="text-xs"
              style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
            >
              Add reference materials for AI context
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-0.5">
            {knowledge?.map((entry) => (
              <div
                key={entry._id}
                className="group p-3 rounded-lg transition-all cursor-default"
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--greytransparent-100)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--display-onlight-primary)" }}
                  >
                    {entry.title}
                  </h4>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-0.5 shrink-0 rounded"
                    style={{ color: "var(--display-onlight-tertiary)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-td-primary)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--display-onlight-tertiary)")}
                    title="Remove"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p
                  className="text-xs mt-1 line-clamp-2 leading-relaxed"
                  style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.5 }}
                >
                  {entry.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
