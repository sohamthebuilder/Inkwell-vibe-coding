import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import ProfilePage from "./ProfilePage";

vi.mock("convex/react", () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}));

vi.mock("../components/Header", () => ({
  default: () => <header data-testid="header">Header</header>,
}));

import { useQuery, useMutation } from "convex/react";

describe("ProfilePage", () => {
  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.mocked(useQuery).mockReturnValue({
      name: "John Doe",
      email: "john@example.com",
    });
    vi.mocked(useMutation).mockReturnValue(mockUpdateProfile);
    mockUpdateProfile.mockResolvedValue(undefined);
  });

  it("renders profile form with user data", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    expect(screen.getByText("Profile")).toBeInTheDocument();
    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("john@example.com")).toBeInTheDocument();
  });

  it("disables save when name is unchanged", () => {
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    const saveBtn = screen.getByRole("button", { name: "Save Changes" });
    expect(saveBtn).toBeDisabled();
  });

  it("enables save when name is changed and calls updateProfile", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    const nameInput = screen.getByDisplayValue("John Doe");
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");

    const saveBtn = screen.getByRole("button", { name: "Save Changes" });
    expect(saveBtn).not.toBeDisabled();
    await user.click(saveBtn);

    expect(mockUpdateProfile).toHaveBeenCalledWith({ name: "Jane Doe" });
  });

  it("shows Saved feedback after successful save", async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <ProfilePage />
      </MemoryRouter>
    );
    const nameInput = screen.getByDisplayValue("John Doe");
    await user.clear(nameInput);
    await user.type(nameInput, "Jane Doe");
    await user.click(screen.getByRole("button", { name: "Save Changes" }));

    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });
});
