import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface AIChatPanelProps {
  documentId: Id<"documents">;
  documentContent: string;
  knowledgeEntries: { title: string; content: string }[];
  onInsertText: (text: string) => void;
}

export default function AIChatPanel({
  documentId,
  documentContent,
  knowledgeEntries,
  onInsertText,
}: AIChatPanelProps) {
  const messages = useQuery(api.chat.list, { documentId });
  const sendMessage = useMutation(api.chat.send);
  const generateAI = useAction(api.ai.generate);

  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const prompt = input.trim();
    if (!prompt || isGenerating) return;

    setInput("");
    setIsGenerating(true);

    try {
      await sendMessage({ documentId, role: "user", content: prompt });

      await generateAI({
        documentId,
        prompt,
        documentContent,
        knowledgeEntries,
      });
    } catch (err) {
      console.error("AI generation error:", err);
      await sendMessage({
        documentId,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid var(--greytransparent-150)" }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center"
            style={{ background: "var(--color-td-primary)" }}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
            </svg>
          </div>
          <h2
            className="text-xs font-semibold uppercase tracking-wider"
            style={{ color: "var(--display-onlight-secondary)", letterSpacing: "0.05em" }}
          >
            AI Assistant
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages === undefined ? (
          <div className="space-y-3">
            <div
              className="h-12 rounded-xl w-4/5 animate-pulse"
              style={{ background: "var(--greytransparent-100)" }}
            />
            <div
              className="h-16 rounded-xl w-4/5 ml-auto animate-pulse"
              style={{ background: "var(--greytransparent-100)" }}
            />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3"
              style={{ background: "var(--greytransparent-150)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--display-onlight-tertiary)" }}>
                <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
              </svg>
            </div>
            <p
              className="text-sm font-medium mb-1"
              style={{ color: "var(--display-onlight-secondary)" }}
            >
              Ask AI to help you write
            </p>
            <p
              className="text-xs px-4"
              style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
            >
              It uses your knowledge entries as context
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className="max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={
                  msg.role === "user"
                    ? {
                        background: "var(--color-td-primary)",
                        color: "var(--white)",
                        borderBottomRightRadius: "4px",
                      }
                    : {
                        background: "var(--greytransparent-100)",
                        color: "var(--display-onlight-primary)",
                        borderBottomLeftRadius: "4px",
                      }
                }
              >
                <div className="whitespace-pre-wrap" style={{ lineHeight: 1.5 }}>{msg.content}</div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => onInsertText(msg.content)}
                    className="mt-2 flex items-center gap-1 text-xs font-semibold transition-opacity hover:opacity-70"
                    style={{ color: "var(--color-td-primary)" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    Insert into document
                  </button>
                )}
              </div>
            </div>
          ))
        )}

        {isGenerating && (
          <div className="flex justify-start">
            <div
              className="rounded-2xl px-4 py-3"
              style={{
                background: "var(--greytransparent-100)",
                borderBottomLeftRadius: "4px",
              }}
            >
              <div className="flex items-center gap-1.5">
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "var(--display-onlight-tertiary)", animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "var(--display-onlight-tertiary)", animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 rounded-full animate-bounce"
                  style={{ background: "var(--display-onlight-tertiary)", animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3"
        style={{ borderTop: "1px solid var(--greytransparent-150)" }}
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to write or edit..."
            disabled={isGenerating}
            className="flex-1 px-3 py-2.5 text-sm outline-none transition-all disabled:opacity-40 focus:ring-2 focus:ring-[rgba(228,66,50,0.15)] focus:border-[#e44232]"
            style={{
              background: "var(--white)",
              border: "1px solid var(--greytransparent-300)",
              color: "var(--display-onlight-primary)",
              borderRadius: "var(--border-radius-base)",
            }}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-2.5 text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            style={{
              background: "var(--color-td-primary)",
              borderRadius: "var(--border-radius-base)",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22 11 13 2 9z" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
