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

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-3 border-b border-cream-200">
        <h2 className="font-serif text-sm font-semibold text-ink-700">
          Knowledge
        </h2>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="text-xs text-accent-500 hover:text-accent-600 font-medium transition-colors"
        >
          {isAdding ? "Cancel" : "+ Add"}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {isAdding && (
          <form onSubmit={handleSubmit} className="p-4 border-b border-cream-200 bg-cream-100/50">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title"
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-300 bg-white
                         text-ink-800 placeholder:text-ink-300
                         focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                         mb-2"
              autoFocus
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Paste or type reference content..."
              rows={5}
              className="w-full px-3 py-2 text-sm rounded-lg border border-cream-300 bg-white
                         text-ink-800 placeholder:text-ink-300
                         focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                         resize-none mb-2"
            />
            <button
              type="submit"
              disabled={!title.trim() || !content.trim()}
              className="w-full py-2 bg-accent-500 text-white text-sm rounded-lg font-medium
                         hover:bg-accent-600 transition-colors
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Knowledge
            </button>
          </form>
        )}

        {knowledge === undefined ? (
          <div className="p-4 space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-cream-200 rounded w-2/3 mb-2" />
                <div className="h-3 bg-cream-100 rounded w-full" />
              </div>
            ))}
          </div>
        ) : knowledge.length === 0 && !isAdding ? (
          <div className="p-6 text-center">
            <p className="text-ink-300 text-sm mb-1">No knowledge added yet</p>
            <p className="text-ink-300 text-xs">
              Add reference materials for AI context
            </p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {knowledge?.map((entry) => (
              <div
                key={entry._id}
                className="group p-3 rounded-xl hover:bg-cream-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-medium text-ink-700 truncate">
                    {entry.title}
                  </h4>
                  <button
                    onClick={() => handleDelete(entry._id)}
                    className="opacity-0 group-hover:opacity-100 text-ink-300 hover:text-red-500
                               transition-all p-0.5 shrink-0"
                    title="Remove"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-ink-400 mt-1 line-clamp-2 leading-relaxed">
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
