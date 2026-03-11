import { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  content: string;
  onUpdate: (content: string) => void;
  editorRef?: React.MutableRefObject<ReturnType<typeof useEditor> | null>;
  onAddToContext?: (text: string) => void;
}

export default function Editor({ content, onUpdate, editorRef, onAddToContext }: EditorProps) {
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isExternalUpdate = useRef(false);

  const handleUpdate = useCallback(
    (jsonContent: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        onUpdate(jsonContent);
      }, 1000);
    },
    [onUpdate]
  );

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: content ? JSON.parse(content) : undefined,
    onUpdate: ({ editor: ed }) => {
      if (!isExternalUpdate.current) {
        handleUpdate(JSON.stringify(ed.getJSON()));
      }
    },
    editorProps: {
      attributes: {
        class: "tiptap prose-lg focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (editorRef) {
      editorRef.current = editor;
    }
  }, [editor, editorRef]);

  useEffect(() => {
    if (editor && content) {
      const currentContent = JSON.stringify(editor.getJSON());
      if (currentContent !== content) {
        isExternalUpdate.current = true;
        try {
          editor.commands.setContent(JSON.parse(content));
        } catch {
          // ignore parse errors for external content
        }
        isExternalUpdate.current = false;
      }
    }
  }, [editor, content]);

  const handleAddSelection = useCallback(() => {
    if (!editor || !onAddToContext) return;
    const { from, to } = editor.state.selection;
    if (from === to) return;
    const text = editor.state.doc.textBetween(from, to, " ");
    if (text.trim()) {
      onAddToContext(text.trim());
    }
  }, [editor, onAddToContext]);

  return (
    <div>
      <EditorToolbar editor={editor} />
      {editor && onAddToContext && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ placement: "top-end", duration: 150 }}
          shouldShow={({ editor: ed }) => {
            const { from, to } = ed.state.selection;
            return from !== to;
          }}
        >
          <button
            onClick={handleAddSelection}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium transition-all hover:brightness-95 active:scale-95"
            style={{
              background: "var(--color-td-primary)",
              color: "var(--white)",
              borderRadius: "var(--border-radius-sm)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
            title="Add to AI context"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add to AI
          </button>
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
