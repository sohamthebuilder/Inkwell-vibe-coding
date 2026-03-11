import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import EditorPage from "./EditorPage";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("../components/Editor", () => ({
  default: () => <div data-testid="editor">Editor</div>,
}));

vi.mock("../components/KnowledgePanel", () => ({
  default: () => <div data-testid="knowledge-panel">Knowledge</div>,
}));

vi.mock("../components/AIChatPanel", () => ({
  default: () => <div data-testid="ai-chat-panel">AI Chat</div>,
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useParams: vi.fn(() => ({ id: "doc1" })),
    useNavigate: () => mockNavigate,
  };
});

import { useQuery, useMutation } from "convex/react";

describe("EditorPage", () => {
  const mockUpdateDoc = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        _id: "doc1",
        title: "Test Doc",
        content: "{}",
        updatedAt: Date.now(),
      } as any)
      .mockReturnValue([]);
    vi.mocked(useMutation).mockReturnValue(mockUpdateDoc);
    mockUpdateDoc.mockResolvedValue(undefined);
    mockNavigate.mockClear();
  });

  it("shows loading state when document is undefined", () => {
    vi.mocked(useQuery).mockReset();
    vi.mocked(useQuery).mockReturnValue(undefined);
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading document...")).toBeInTheDocument();
  });

  it("redirects to dashboard when document is null", () => {
    vi.mocked(useQuery).mockReset();
    vi.mocked(useQuery).mockReturnValue(null);
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );
    expect(mockNavigate).toHaveBeenCalledWith("/dashboard", { replace: true });
  });

  it("renders editor and panels when document exists", () => {
    vi.mocked(useQuery).mockReset();
    vi.mocked(useQuery)
      .mockReturnValueOnce({
        _id: "doc1",
        title: "Test Doc",
        content: "{}",
        updatedAt: Date.now(),
      } as any)
      .mockReturnValue([]);
    render(
      <MemoryRouter>
        <EditorPage />
      </MemoryRouter>
    );
    expect(screen.getByTestId("editor")).toBeInTheDocument();
    expect(screen.getByTestId("knowledge-panel")).toBeInTheDocument();
    expect(screen.getByTestId("ai-chat-panel")).toBeInTheDocument();
  });
});
