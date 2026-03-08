import { useEffect, useRef, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import EditorToolbar from "./EditorToolbar";

interface EditorProps {
  content: string;
  onUpdate: (content: string) => void;
  editorRef?: React.MutableRefObject<ReturnType<typeof useEditor> | null>;
}

export default function Editor({ content, onUpdate, editorRef }: EditorProps) {
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

  return (
    <div>
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
