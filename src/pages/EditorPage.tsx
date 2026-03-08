import { useState, useRef, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import Editor from "../components/Editor";
import KnowledgePanel from "../components/KnowledgePanel";
import AIChatPanel from "../components/AIChatPanel";
import { formatDate, extractPlainText } from "../lib/utils";
import type { useEditor } from "@tiptap/react";

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const documentId = id as Id<"documents">;

  const document = useQuery(api.documents.get, { id: documentId });
  const knowledge = useQuery(api.knowledge.list, { documentId });
  const updateDoc = useMutation(api.documents.update);

  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "idle">("idle");
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const editorRef = useRef<ReturnType<typeof useEditor> | null>(null);

  useEffect(() => {
    if (document === null) {
      navigate("/dashboard", { replace: true });
    }
  }, [document, navigate]);

  const handleContentUpdate = useCallback(
    async (content: string) => {
      setSaveStatus("saving");
      try {
        await updateDoc({ id: documentId, content });
        setSaveStatus("saved");
      } catch {
        setSaveStatus("idle");
      }
    },
    [updateDoc, documentId]
  );

  const handleTitleChange = useCallback(
    async (newTitle: string) => {
      await updateDoc({ id: documentId, title: newTitle });
    },
    [updateDoc, documentId]
  );

  const handleInsertText = useCallback(
    (text: string) => {
      const editor = editorRef.current;
      if (editor) {
        editor.chain().focus().command(({ tr, dispatch }) => {
          if (dispatch) {
            const { to } = tr.selection;
            tr.insertText("\n\n" + text, to);
          }
          return true;
        }).run();
      }
    },
    []
  );

  if (document === undefined) {
    return (
      <div className="min-h-screen bg-cream-50 flex items-center justify-center">
        <div className="text-ink-400 font-serif text-lg animate-pulse">
          Loading document...
        </div>
      </div>
    );
  }

  if (document === null) return null;

  const knowledgeEntries = (knowledge ?? []).map((k) => ({
    title: k.title,
    content: k.content,
  }));

  const plainTextContent = extractPlainText(document.content);

  return (
    <div className="h-screen flex flex-col bg-cream-50">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-cream-200 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 text-ink-400 hover:text-ink-600 hover:bg-cream-100
                       rounded-lg transition-colors"
            title="Back to dashboard"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
          </Link>

          <TitleInput
            value={document.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-ink-300">
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "Saved"
                : `Last saved ${formatDate(document.updatedAt)}`}
          </span>

          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              leftOpen ? "bg-accent-500/10 text-accent-500" : "text-ink-400 hover:text-ink-600 hover:bg-cream-100"
            }`}
            title="Toggle knowledge panel"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
          </button>

          <button
            onClick={() => setRightOpen(!rightOpen)}
            className={`p-1.5 rounded-lg transition-colors ${
              rightOpen ? "bg-accent-500/10 text-accent-500" : "text-ink-400 hover:text-ink-600 hover:bg-cream-100"
            }`}
            title="Toggle AI assistant"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Knowledge */}
        {leftOpen && (
          <div className="w-72 border-r border-cream-200 bg-white shrink-0 overflow-hidden">
            <KnowledgePanel documentId={documentId} />
          </div>
        )}

        {/* Center - Editor */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-8 py-8">
            <Editor
              content={document.content}
              onUpdate={handleContentUpdate}
              editorRef={editorRef}
            />
          </div>
        </div>

        {/* Right Sidebar - AI Chat */}
        {rightOpen && (
          <div className="w-80 border-l border-cream-200 bg-white shrink-0 overflow-hidden">
            <AIChatPanel
              documentId={documentId}
              documentContent={plainTextContent}
              knowledgeEntries={knowledgeEntries}
              onInsertText={handleInsertText}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function TitleInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [localValue, setLocalValue] = useState(value);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = e.target.value;
    setLocalValue(newVal);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(newVal);
    }, 500);
  };

  return (
    <input
      type="text"
      value={localValue}
      onChange={handleChange}
      className="font-serif text-lg font-semibold text-ink-800 bg-transparent
                 border-none outline-none placeholder:text-ink-300
                 w-64 md:w-96"
      placeholder="Untitled"
    />
  );
}
