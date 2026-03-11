import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import DocumentCard from "./DocumentCard";

vi.mock("convex/react", () => ({
  useMutation: vi.fn(),
}));

import { useMutation } from "convex/react";

describe("DocumentCard", () => {
  const mockRemoveDoc = vi.fn();

  beforeEach(() => {
    vi.mocked(useMutation).mockReturnValue(mockRemoveDoc);
    mockRemoveDoc.mockResolvedValue(undefined);
  });

  it("renders title, preview, and formatted date", () => {
    const content = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "This is the document content for preview." }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <DocumentCard
          id={"doc123" as any}
          title="My Document"
          content={content}
          updatedAt={Date.now() - 1000}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("My Document")).toBeInTheDocument();
    expect(screen.getByText(/This is the document content/)).toBeInTheDocument();
    expect(screen.getByText("Just now")).toBeInTheDocument();
  });

  it("shows 'Untitled' when title is empty", () => {
    render(
      <MemoryRouter>
        <DocumentCard
          id={"doc123" as any}
          title=""
          content="{}"
          updatedAt={Date.now()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Untitled")).toBeInTheDocument();
  });

  it("shows 'Empty document' when content has no text", () => {
    render(
      <MemoryRouter>
        <DocumentCard
          id={"doc123" as any}
          title="Empty"
          content='{"type":"doc","content":[]}'
          updatedAt={Date.now()}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Empty document")).toBeInTheDocument();
  });

  it("renders delete button and shows delete dialog on click", async () => {
    const user = userEvent.setup();
    const content = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Content" }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <DocumentCard
          id={"doc123" as any}
          title="To Delete"
          content={content}
          updatedAt={Date.now()}
        />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTitle("Delete document");
    await user.click(deleteBtn);

    expect(screen.getByText("Delete document")).toBeInTheDocument();
    expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
  });

  it("calls removeDoc when confirming delete", async () => {
    const user = userEvent.setup();
    const content = JSON.stringify({
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Content" }],
        },
      ],
    });

    render(
      <MemoryRouter>
        <DocumentCard
          id={"doc123" as any}
          title="To Delete"
          content={content}
          updatedAt={Date.now()}
        />
      </MemoryRouter>
    );

    const deleteBtn = screen.getByTitle("Delete document");
    await user.click(deleteBtn);

    const confirmBtn = screen.getByRole("button", { name: /^Delete$/ });
    await user.click(confirmBtn);

    expect(mockRemoveDoc).toHaveBeenCalledWith({ id: "doc123" });
  });
});
