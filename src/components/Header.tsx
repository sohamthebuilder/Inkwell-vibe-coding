import { Link } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";

export default function Header() {
  const { signOut } = useAuthActions();

  return (
    <header className="border-b border-cream-200 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
        <Link to="/dashboard" className="font-serif text-xl font-bold text-ink-800">
          Inkwell
        </Link>
        <button
          onClick={() => void signOut()}
          className="text-sm text-ink-400 hover:text-ink-600 transition-colors"
        >
          Sign out
        </button>
      </div>
    </header>
  );
}
