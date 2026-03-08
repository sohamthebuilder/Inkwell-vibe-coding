import { useState, FormEvent } from "react";
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
      await signIn("password", {
        email,
        password,
        name: mode === "signUp" ? name : undefined,
        flow: mode,
      });
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

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col">
      <nav className="px-8 py-6">
        <Link to="/" className="font-serif text-2xl font-bold text-ink-800">
          Inkwell
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-cream-200 p-8">
            <h2 className="font-serif text-3xl font-bold text-ink-900 text-center mb-2">
              {mode === "signIn" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-ink-400 text-center mb-8">
              {mode === "signIn"
                ? "Sign in to continue writing"
                : "Start writing with AI-powered context"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signUp" && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-ink-600 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50
                               text-ink-800 placeholder:text-ink-300
                               focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                               transition-colors"
                    placeholder="Your name"
                    required
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-ink-600 mb-1.5"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50
                             text-ink-800 placeholder:text-ink-300
                             focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                             transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-ink-600 mb-1.5"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg border border-cream-300 bg-cream-50
                             text-ink-800 placeholder:text-ink-300
                             focus:outline-none focus:ring-2 focus:ring-accent-500/20 focus:border-accent-500
                             transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              {error && (
                <p className="text-red-600 text-sm bg-red-50 rounded-lg px-4 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-accent-500 text-white rounded-lg font-semibold
                           hover:bg-accent-600 transition-colors shadow-sm
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Please wait..."
                  : mode === "signIn"
                    ? "Sign In"
                    : "Create Account"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => {
                  setMode(mode === "signIn" ? "signUp" : "signIn");
                  setError("");
                }}
                className="text-sm text-ink-400 hover:text-accent-500 transition-colors"
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
