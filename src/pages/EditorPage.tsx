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
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--neutral)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center animate-pulse"
            style={{ background: "var(--color-td-primary)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--display-onlight-tertiary)" }}
          >
            Loading document...
          </p>
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

  const toggleBtnStyles = (isActive: boolean): React.CSSProperties => ({
    background: isActive ? "rgba(228, 66, 50, 0.08)" : "transparent",
    color: isActive ? "var(--color-td-primary)" : "var(--display-onlight-tertiary)",
    borderRadius: "var(--border-radius-sm)",
  });

  return (
    <div className="h-screen flex flex-col" style={{ background: "var(--neutral)" }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 py-2.5 shrink-0"
        style={{
          background: "var(--white)",
          borderBottom: "1px solid var(--greytransparent-150)",
        }}
      >
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="p-1.5 rounded-md transition-all"
            style={{ color: "var(--display-onlight-tertiary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--greytransparent-150)";
              e.currentTarget.style.color = "var(--display-onlight-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--display-onlight-tertiary)";
            }}
            title="Back to dashboard"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>

          <TitleInput
            value={document.title}
            onChange={handleTitleChange}
          />
        </div>

        <div className="flex items-center gap-3">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--display-onlight-tertiary)" }}
          >
            {saveStatus === "saving"
              ? "Saving..."
              : saveStatus === "saved"
                ? "Saved"
                : `Last saved ${formatDate(document.updatedAt)}`}
          </span>

          <div
            className="w-px h-5"
            style={{ background: "var(--greytransparent-200)" }}
          />

          <button
            onClick={() => setLeftOpen(!leftOpen)}
            className="p-1.5 transition-all"
            style={toggleBtnStyles(leftOpen)}
            onMouseEnter={(e) => {
              if (!leftOpen) e.currentTarget.style.background = "var(--greytransparent-150)";
            }}
            onMouseLeave={(e) => {
              if (!leftOpen) e.currentTarget.style.background = "transparent";
            }}
            title="Toggle knowledge panel"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </button>

          <button
            onClick={() => setRightOpen(!rightOpen)}
            className="p-1.5 transition-all"
            style={toggleBtnStyles(rightOpen)}
            onMouseEnter={(e) => {
              if (!rightOpen) e.currentTarget.style.background = "var(--greytransparent-150)";
            }}
            onMouseLeave={(e) => {
              if (!rightOpen) e.currentTarget.style.background = "transparent";
            }}
            title="Toggle AI assistant"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Knowledge */}
        {leftOpen && (
          <div
            className="w-72 shrink-0 overflow-hidden"
            style={{
              background: "var(--white)",
              borderRight: "1px solid var(--greytransparent-150)",
            }}
          >
            <KnowledgePanel documentId={documentId} />
          </div>
        )}

        {/* Center - Editor */}
        <div className="flex-1 overflow-y-auto" style={{ background: "var(--neutral)" }}>
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
          <div
            className="w-80 shrink-0 overflow-hidden"
            style={{
              background: "var(--white)",
              borderLeft: "1px solid var(--greytransparent-150)",
            }}
          >
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
      className="font-serif text-base font-semibold bg-transparent border-none outline-none w-64 md:w-96"
      style={{
        color: "var(--display-onlight-primary)",
      }}
      placeholder="Untitled"
    />
  );
}
