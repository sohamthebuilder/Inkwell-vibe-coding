import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LandingPage from "./LandingPage";

vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
}));

import { useConvexAuth } from "convex/react";

describe("LandingPage", () => {
  beforeEach(() => {
    vi.mocked(useConvexAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    } as ReturnType<typeof useConvexAuth>);
  });

  it("renders hero section with headline", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(/Clarity/);
    expect(heading).toHaveTextContent(/finally/);
  });

  it("shows Log in link when not authenticated", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("shows Dashboard link when authenticated", () => {
    vi.mocked(useConvexAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    } as ReturnType<typeof useConvexAuth>);
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders Try Inkwell free CTA", () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );
    expect(screen.getByText(/Try Inkwell free/)).toBeInTheDocument();
  });
});
