import { useState, useEffect, type FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import Header from "../components/Header";

export default function ProfilePage() {
  const user = useQuery(api.users.currentUser);
  const updateProfile = useMutation(api.users.updateProfile);

  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user?.name) setName(user.name);
  }, [user?.name]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ name: name.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const isDirty = user?.name !== name;

  const inputStyles: React.CSSProperties = {
    background: "var(--white)",
    border: "1px solid var(--greytransparent-300)",
    color: "var(--display-onlight-primary)",
    borderRadius: "var(--border-radius-base)",
  };

  const inputFocusClass =
    "w-full px-4 py-3 text-sm transition-all outline-none focus:ring-2 focus:ring-[rgba(228,66,50,0.15)] focus:border-[#e44232]";

  return (
    <div className="min-h-screen" style={{ background: "var(--neutral)" }}>
      <Header />

      <main className="max-w-[600px] mx-auto px-6 py-10">
        <div className="mb-8">
          <h1
            className="font-serif text-2xl font-semibold"
            style={{
              color: "var(--display-onlight-primary)",
              letterSpacing: "-0.01em",
            }}
          >
            Profile
          </h1>
          <p
            className="mt-1 text-sm"
            style={{ color: "var(--display-onlight-tertiary)" }}
          >
            Manage your account details
          </p>
        </div>

        {user === undefined ? (
          <div
            className="rounded-2xl p-8 animate-pulse"
            style={{
              background: "var(--white)",
              border: "1px solid var(--greytransparent-150)",
            }}
          >
            <div
              className="h-4 rounded w-1/3 mb-6"
              style={{ background: "var(--greytransparent-150)" }}
            />
            <div
              className="h-10 rounded w-full mb-4"
              style={{ background: "var(--greytransparent-100)" }}
            />
            <div
              className="h-10 rounded w-full"
              style={{ background: "var(--greytransparent-100)" }}
            />
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div
              className="rounded-2xl p-8"
              style={{
                background: "var(--white)",
                boxShadow: "var(--shadow-elevated)",
                border: "1px solid var(--greytransparent-150)",
              }}
            >
              <div className="flex items-center gap-5 mb-8">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold text-white shrink-0"
                  style={{ background: "var(--color-td-primary)" }}
                >
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((w: string) => w[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)
                    : "?"}
                </div>
                <div className="min-w-0">
                  <p
                    className="text-lg font-semibold truncate"
                    style={{ color: "var(--display-onlight-primary)" }}
                  >
                    {user?.name || "User"}
                  </p>
                  <p
                    className="text-sm truncate"
                    style={{ color: "var(--display-onlight-tertiary)" }}
                  >
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="profile-name"
                    className="block text-xs font-semibold mb-1.5"
                    style={{
                      color: "var(--display-onlight-secondary)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Name
                  </label>
                  <input
                    id="profile-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputFocusClass}
                    style={inputStyles}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div>
                  <label
                    className="block text-xs font-semibold mb-1.5"
                    style={{
                      color: "var(--display-onlight-secondary)",
                      letterSpacing: "0.01em",
                    }}
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email ?? ""}
                    disabled
                    className="w-full px-4 py-3 text-sm rounded-lg cursor-not-allowed"
                    style={{
                      background: "var(--greytransparent-100)",
                      border: "1px solid var(--greytransparent-150)",
                      color: "var(--display-onlight-tertiary)",
                      borderRadius: "var(--border-radius-base)",
                    }}
                  />
                  <p
                    className="mt-1.5 text-xs"
                    style={{ color: "var(--display-onlight-tertiary)" }}
                  >
                    Email cannot be changed
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              {saved && (
                <span
                  className="text-sm font-medium flex items-center gap-1.5"
                  style={{ color: "#16a34a" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Saved
                </span>
              )}
              <button
                type="submit"
                disabled={saving || !isDirty || !name.trim()}
                className="px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "var(--color-td-primary)",
                  borderRadius: "var(--border-radius-base)",
                  boxShadow:
                    isDirty && name.trim()
                      ? "0 1px 3px rgba(228, 66, 50, 0.3)"
                      : "none",
                }}
                onMouseEnter={(e) => {
                  if (!saving && isDirty && name.trim())
                    e.currentTarget.style.background = "#ee5244";
                }}
                onMouseLeave={(e) => {
                  if (!saving && isDirty && name.trim())
                    e.currentTarget.style.background = "var(--color-td-primary)";
                }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
