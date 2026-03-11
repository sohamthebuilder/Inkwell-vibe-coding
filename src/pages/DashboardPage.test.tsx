import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, useNavigate } from "react-router-dom";
import DashboardPage from "./DashboardPage";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("../components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

vi.mock("../components/DocumentCard", () => ({
  default: ({ title }: { title: string }) => <div data-testid="document-card">{title}</div>,
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import { useQuery, useMutation } from "convex/react";

describe("DashboardPage", () => {
  const mockCreateDoc = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue([]);
    vi.mocked(useMutation).mockReturnValue(mockCreateDoc);
    mockCreateDoc.mockResolvedValue("new-doc-id");
    mockNavigate.mockClear();
  });

  it("renders header and New Document button", () => {
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Your Documents")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /New Document/i })).toBeInTheDocument();
  });

  it("shows empty state when no documents", () => {
    vi.mocked(useQuery).mockReturnValue([]);
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("No documents yet")).toBeInTheDocument();
    expect(screen.getByText("Create your first document to start writing with AI assistance.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create Your First Document/i })).toBeInTheDocument();
  });

  it("creates document and navigates on New Document click", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    await user.click(screen.getByRole("button", { name: /New Document/i }));
    expect(mockCreateDoc).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/document/new-doc-id");
  });

  it("displays document count when documents exist", () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: "1" as any, title: "Doc 1", content: "{}", updatedAt: 0 },
      { _id: "2" as any, title: "Doc 2", content: "{}", updatedAt: 0 },
    ] as any);
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("2 documents")).toBeInTheDocument();
  });

  it("renders DocumentCards when documents exist", () => {
    vi.mocked(useQuery).mockReturnValue([
      { _id: "1" as any, title: "Doc 1", content: "{}", updatedAt: 0 },
    ] as any);
    render(
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Doc 1")).toBeInTheDocument();
  });
});
