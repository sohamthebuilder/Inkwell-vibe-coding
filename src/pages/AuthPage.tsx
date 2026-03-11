import { useState, type FormEvent } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useConvexAuth } from "convex/react";
import { Navigate, Link } from "react-router-dom";

export default function AuthPage() {
  const { isAuthenticated } = useConvexAuth();
  const { signIn } = useAuthActions();
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const params: Record<string, string> = { email, password, flow: mode };
      if (mode === "signUp") params.name = name;
      await signIn("password", params);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputStyles: React.CSSProperties = {
    background: "var(--white)",
    border: "1px solid var(--greytransparent-300)",
    color: "var(--display-onlight-primary)",
    borderRadius: "var(--border-radius-base)",
  };

  const inputFocusClass =
    "w-full px-4 py-3 text-sm transition-all outline-none focus:ring-2 focus:ring-[rgba(228,66,50,0.15)] focus:border-[#e44232]";

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--neutral)" }}>
      {/* Nav */}
      <nav className="px-6 py-5">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-td-primary)" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <span
            className="font-serif text-xl font-bold"
            style={{ color: "var(--display-onlight-primary)" }}
          >
            Inkwell
          </span>
        </Link>
      </nav>

      {/* Auth Card */}
      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-[420px]">
          <div
            className="rounded-2xl p-8"
            style={{
              background: "var(--white)",
              boxShadow: "var(--shadow-elevated)",
              border: "1px solid var(--greytransparent-150)",
            }}
          >
            <h2
              className="font-serif text-2xl font-semibold text-center mb-2"
              style={{ color: "var(--display-onlight-primary)", letterSpacing: "-0.01em" }}
            >
              {mode === "signIn" ? "Welcome back" : "Create your account"}
            </h2>
            <p
              className="text-sm text-center mb-8"
              style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
            >
              {mode === "signIn"
                ? "Sign in to continue writing"
                : "Start writing with AI-powered context"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signUp" && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold mb-1.5"
                    style={{ color: "var(--display-onlight-secondary)", letterSpacing: "0.01em" }}
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputFocusClass}
                    style={inputStyles}
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--display-onlight-secondary)", letterSpacing: "0.01em" }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputFocusClass}
                  style={inputStyles}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold mb-1.5"
                  style={{ color: "var(--display-onlight-secondary)", letterSpacing: "0.01em" }}
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputFocusClass}
                  style={inputStyles}
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <div
                  className="text-sm px-4 py-3 rounded-lg"
                  style={{
                    background: "var(--color-td-secondary-light)",
                    color: "var(--color-td-primary)",
                    border: "1px solid rgba(228, 66, 50, 0.15)",
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  background: "var(--color-td-primary)",
                  borderRadius: "var(--border-radius-base)",
                  boxShadow: "0 1px 3px rgba(228, 66, 50, 0.3)",
                }}
                onMouseEnter={(e) => {
                  if (!loading) e.currentTarget.style.background = "#ee5244";
                }}
                onMouseLeave={(e) => {
                  if (!loading) e.currentTarget.style.background = "var(--color-td-primary)";
                }}
              >
                {loading
                  ? "Please wait..."
                  : mode === "signIn"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div
              className="mt-6 pt-6 text-center"
              style={{ borderTop: "1px solid var(--greytransparent-150)" }}
            >
              <button
                onClick={() => {
                  setMode(mode === "signIn" ? "signUp" : "signIn");
                  setError("");
                }}
                className="text-sm transition-colors"
                style={{ color: "var(--display-onlight-tertiary)" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "var(--color-td-primary)")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "var(--display-onlight-tertiary)")}
              >
                {mode === "signIn"
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
