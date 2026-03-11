import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import KnowledgePanel from "./KnowledgePanel";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

import { useQuery, useMutation } from "convex/react";

describe("KnowledgePanel", () => {
  const mockAddKnowledge = vi.fn();
  const mockRemoveKnowledge = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue([]);
    let callCount = 0;
    vi.mocked(useMutation).mockImplementation(() => {
      callCount++;
      return callCount % 2 === 1 ? mockAddKnowledge : mockRemoveKnowledge;
    });
    mockAddKnowledge.mockResolvedValue(undefined);
    mockRemoveKnowledge.mockResolvedValue(undefined);
  });

  it("renders Knowledge header and Add button", () => {
    render(<KnowledgePanel documentId={"doc1" as any} />);
    expect(screen.getByText("Knowledge")).toBeInTheDocument();
    expect(screen.getByText("+ Add")).toBeInTheDocument();
  });

  it("shows add form when Add is clicked", async () => {
    const user = userEvent.setup();
    render(<KnowledgePanel documentId={"doc1" as any} />);
    await user.click(screen.getByText("+ Add"));
    expect(screen.getByPlaceholderText("Title")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Paste or type reference content...")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Knowledge" })).toBeInTheDocument();
  });

  it("submits form and calls addKnowledge with trimmed values", async () => {
    const user = userEvent.setup();
    render(<KnowledgePanel documentId={"doc1" as any} />);
    await user.click(screen.getByText("+ Add"));
    await user.type(screen.getByPlaceholderText("Title"), "  My Title  ");
    await user.type(screen.getByPlaceholderText("Paste or type reference content..."), "  Content here  ");
    await user.click(screen.getByRole("button", { name: "Add Knowledge" }));

    expect(mockAddKnowledge).toHaveBeenCalledWith({
      documentId: "doc1",
      title: "My Title",
      content: "Content here",
    });
  });

  it("does not submit when title or content is empty", async () => {
    const user = userEvent.setup();
    render(<KnowledgePanel documentId={"doc1" as any} />);
    await user.click(screen.getByText("+ Add"));
    const submitBtn = screen.getByRole("button", { name: "Add Knowledge" });
    expect(submitBtn).toBeDisabled();
    await user.type(screen.getByPlaceholderText("Title"), "Title only");
    expect(submitBtn).toBeDisabled();
    await user.type(screen.getByPlaceholderText("Paste or type reference content..."), "Content");
    expect(submitBtn).not.toBeDisabled();
  });

  it("displays knowledge entries and calls removeKnowledge on delete", async () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: "k1" as any, title: "Entry 1", content: "Content 1" },
      { _id: "k2" as any, title: "Entry 2", content: "Content 2" },
    ] as any);

    const user = userEvent.setup();
    render(<KnowledgePanel documentId={"doc1" as any} />);
    expect(screen.getByText("Entry 1")).toBeInTheDocument();
    expect(screen.getByText("Entry 2")).toBeInTheDocument();

    const removeButtons = screen.getAllByTitle("Remove");
    await user.click(removeButtons[0]);
    expect(mockRemoveKnowledge).toHaveBeenCalledWith({ id: "k1" });
  });
});
