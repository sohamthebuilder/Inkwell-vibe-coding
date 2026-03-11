import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import AuthPage from "./AuthPage";

vi.mock("convex/react", () => ({
  useConvexAuth: vi.fn(),
}));

vi.mock("@convex-dev/auth/react", () => ({
  useAuthActions: vi.fn(),
}));

vi.mock("../components/FreeTrialPopup", () => ({
  default: () => <div data-testid="free-trial-popup">Free Trial</div>,
}));

import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";

describe("AuthPage", () => {
  const mockSignIn = vi.fn();

  beforeEach(() => {
    vi.mocked(useConvexAuth).mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    } as ReturnType<typeof useConvexAuth>);
    vi.mocked(useAuthActions).mockReturnValue({
      signIn: mockSignIn,
    } as ReturnType<typeof useAuthActions>);
  });

  it("renders sign in form by default", () => {
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    expect(screen.getByText("Welcome back")).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue writing")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign In" })).toBeInTheDocument();
  });

  it("switches to sign up mode when toggle is clicked", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    await user.click(screen.getByText("Don't have an account? Sign up"));
    expect(screen.getByText("Create your account")).toBeInTheDocument();
    expect(screen.getByText("Start writing with AI-powered context")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Create Account" })).toBeInTheDocument();
  });

  it("submits form with email and password", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(mockSignIn).toHaveBeenCalledWith("password", {
      email: "test@example.com",
      password: "password123",
      flow: "signIn",
    });
  });

  it("shows error when signIn fails", async () => {
    mockSignIn.mockRejectedValue(new Error("Invalid credentials"));
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );
    await user.type(screen.getByPlaceholderText("you@example.com"), "test@example.com");
    await user.type(screen.getByPlaceholderText("••••••••"), "password123");
    await user.click(screen.getByRole("button", { name: "Sign In" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });

  it("redirects when authenticated", () => {
    vi.mocked(useConvexAuth).mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    } as ReturnType<typeof useConvexAuth>);

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>
    );

    expect(screen.queryByText("Welcome back")).not.toBeInTheDocument();
  });
});
