import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AIChatPanel from "./AIChatPanel";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
  useAction: vi.fn(),
}));

import { useQuery, useMutation, useAction } from "convex/react";

describe("AIChatPanel", () => {
  const mockSendMessage = vi.fn();
  const mockGenerateAI = vi.fn();
  const mockOnInsertText = vi.fn();
  const mockOnRemoveContext = vi.fn();
  const mockOnClearContext = vi.fn();

  const defaultProps = {
    documentId: "doc1" as any,
    documentContent: "Document content",
    knowledgeEntries: [],
    onInsertText: mockOnInsertText,
    contextSnippets: [],
    onRemoveContext: mockOnRemoveContext,
    onClearContext: mockOnClearContext,
  };

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue([]);
    vi.mocked(useMutation).mockReturnValue(mockSendMessage);
    vi.mocked(useAction).mockReturnValue(mockGenerateAI);
    mockSendMessage.mockResolvedValue(undefined);
    mockGenerateAI.mockResolvedValue(undefined);
    mockOnInsertText.mockClear();
    mockOnRemoveContext.mockClear();
    mockOnClearContext.mockClear();
  });

  it("renders AI Assistant header and empty state", () => {
    render(<AIChatPanel {...defaultProps} />);
    expect(screen.getByText("AI Assistant")).toBeInTheDocument();
    expect(screen.getByText("Ask AI to help you write")).toBeInTheDocument();
  });

  it("renders input and submit button", () => {
    render(<AIChatPanel {...defaultProps} />);
    expect(screen.getByPlaceholderText("Ask AI to write or edit...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "" })).toBeInTheDocument();
  });

  it("disables submit when input is empty", () => {
    render(<AIChatPanel {...defaultProps} />);
    const submitBtn = screen.getByRole("button", { name: "" });
    expect(submitBtn).toBeDisabled();
  });

  it("enables submit when input has content", async () => {
    const user = userEvent.setup();
    render(<AIChatPanel {...defaultProps} />);
    await user.type(screen.getByPlaceholderText("Ask AI to write or edit..."), "Hello");
    const submitBtn = screen.getByRole("button", { name: "" });
    expect(submitBtn).not.toBeDisabled();
  });

  it("shows context snippets when provided", () => {
    render(
      <AIChatPanel
        {...defaultProps}
        contextSnippets={[
          { id: "1", text: "First context snippet" },
          { id: "2", text: "Second context snippet" },
        ]}
      />
    );
    expect(screen.getByText("First context...")).toBeInTheDocument();
    expect(screen.getByText("Second context...")).toBeInTheDocument();
  });

  it("calls onRemoveContext when remove button is clicked", async () => {
    const user = userEvent.setup();
    render(
      <AIChatPanel
        {...defaultProps}
        contextSnippets={[{ id: "1", text: "Context to remove" }]}
      />
    );
    const snippetDiv = screen.getByTitle("Context to remove");
    const removeBtn = snippetDiv.querySelector("button");
    if (removeBtn) await user.click(removeBtn);
    expect(mockOnRemoveContext).toHaveBeenCalledWith("1");
  });

  it("calls onInsertText when Insert into document is clicked", async () => {
    const user = userEvent.setup();
    vi.mocked(useQuery).mockReturnValue([
      { _id: "m1" as any, role: "assistant", content: "Generated text" },
    ] as any);
    render(<AIChatPanel {...defaultProps} />);
    await user.click(screen.getByText("Insert into document"));
    expect(mockOnInsertText).toHaveBeenCalledWith("Generated text");
  });
});
