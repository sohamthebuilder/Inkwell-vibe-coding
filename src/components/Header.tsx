import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Header() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // #region agent log
  useEffect(() => {
    if (user !== undefined) {
      fetch('http://127.0.0.1:7886/ingest/d96981d0-0cd0-42b2-981b-3b729d0b7623',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'909718'},body:JSON.stringify({sessionId:'909718',location:'Header.tsx:user',message:'currentUser for display',data:{userName:user?.name,hasName:!!user?.name},hypothesisId:'B',timestamp:Date.now()})}).catch(()=>{});
    }
  }, [user]);
  // #endregion
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur-md"
      style={{
        background: "rgba(254, 253, 252, 0.92)",
        borderBottom: "1px solid var(--greytransparent-150)",
      }}
    >
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" title="Home">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center"
            style={{ background: "var(--color-td-primary)" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <span
            className="font-serif text-lg font-bold"
            style={{ color: "var(--display-onlight-primary)" }}
          >
            Inkwell
          </span>
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/profile"
            className="text-sm font-medium transition-colors"
            style={{ color: "var(--display-onlight-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--display-onlight-primary)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--display-onlight-secondary)";
            }}
          >
            Profile
          </Link>
          <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-all"
            style={{ color: "var(--display-onlight-secondary)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--greytransparent-150)";
            }}
            onMouseLeave={(e) => {
              if (!open) e.currentTarget.style.background = "transparent";
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white shrink-0"
              style={{ background: "var(--color-td-primary)" }}
            >
              {initials}
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>

          {open && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-xl overflow-hidden py-1.5"
              style={{
                background: "var(--white)",
                border: "1px solid var(--greytransparent-150)",
                boxShadow: "var(--shadow-elevated)",
              }}
            >
              {user && (
                <div
                  className="px-4 py-3 mb-1"
                  style={{ borderBottom: "1px solid var(--greytransparent-150)" }}
                >
                  <p
                    className="text-sm font-semibold truncate"
                    style={{ color: "var(--display-onlight-primary)" }}
                  >
                    {user.name || "User"}
                  </p>
                  <p
                    className="text-xs truncate mt-0.5"
                    style={{ color: "var(--display-onlight-tertiary)" }}
                  >
                    {user.email}
                  </p>
                </div>
              )}

              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/profile");
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: "var(--display-onlight-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--greytransparent-100)";
                  e.currentTarget.style.color = "var(--display-onlight-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--display-onlight-secondary)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                Profile
              </button>

              <button
                onClick={() => void signOut()}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors"
                style={{ color: "var(--display-onlight-secondary)" }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--greytransparent-100)";
                  e.currentTarget.style.color = "var(--display-onlight-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "transparent";
                  e.currentTarget.style.color = "var(--display-onlight-secondary)";
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                Sign out
              </button>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
