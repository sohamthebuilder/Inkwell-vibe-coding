import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
}));

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

import { useQuery } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

describe("Header", () => {
  const mockSignOut = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      name: "John Doe",
      email: "john@example.com",
    });
    vi.mocked(useAuthActions).mockReturnValue({
      signOut: mockSignOut,
    } as ReturnType<typeof useAuthActions>);
  });

  it("renders Inkwell logo and user initials", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByText("Inkwell")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("shows Profile and Sign out when dropdown is opened", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const dropdownBtn = screen.getByText("JD").closest("button");
    if (dropdownBtn) await user.click(dropdownBtn);
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByText("Sign out")).toBeInTheDocument();
  });

  it("displays user name and email in dropdown", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    const dropdownBtn = screen.getByText("JD").closest("button");
    if (dropdownBtn) await user.click(dropdownBtn);
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
  });
});
