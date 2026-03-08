import { useState, useRef, useEffect, FormEvent } from "react";
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

  const handleSubmit = async (e: FormEvent) => {
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
      <div className="px-4 py-3 border-b border-cream-200">
        <h2 className="font-serif text-sm font-semibold text-ink-700">
          AI Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {messages === undefined ? (
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-cream-100 rounded-xl w-4/5" />
            <div className="h-16 bg-cream-100 rounded-xl w-4/5 ml-auto" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="inline-block p-3 bg-cream-100 rounded-xl mb-3">
              <svg className="w-6 h-6 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
            </div>
            <p className="text-ink-400 text-sm mb-1">Ask AI to help you write</p>
            <p className="text-ink-300 text-xs px-4">
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
                className={`max-w-[90%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-accent-500 text-white rounded-br-md"
                    : "bg-cream-100 text-ink-700 rounded-bl-md"
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.content}</div>
                {msg.role === "assistant" && (
                  <button
                    onClick={() => onInsertText(msg.content)}
                    className="mt-2 flex items-center gap-1 text-xs text-accent-500 hover:text-accent-600
                               font-medium transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
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
            <div className="bg-cream-100 rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-ink-300 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-cream-200"
      >
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to write or edit..."
            disabled={isGenerating}
            className="flex-1 px-3 py-2.5 text-sm rounded-xl border border-cream-300 bg-cream-50
                       text-ink-800 placeholder:text-ink-300
                       focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                       transition-colors disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="p-2.5 bg-accent-500 text-white rounded-xl
                       hover:bg-accent-600 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
