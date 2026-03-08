import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";

export default function LandingPage() {
  const { isAuthenticated } = useConvexAuth();
  const ctaLink = isAuthenticated ? "/dashboard" : "/auth";

  return (
    <div className="min-h-screen" style={{ background: "var(--neutral)" }}>
      {/* Top Banner */}
      <div
        className="text-center py-2.5 text-sm font-medium"
        style={{
          background: "var(--greytransparent-900)",
          color: "var(--white)",
          letterSpacing: "0.01em",
        }}
      >
        Your ideas deserve better than a blank page.{" "}
        <Link to={ctaLink} className="underline underline-offset-2 hover:opacity-80 transition-opacity">
          Try Inkwell free &rarr;
        </Link>
      </div>

      {/* Navigation */}
      <nav
        className="sticky top-0 z-50 backdrop-blur-md"
        style={{
          background: "rgba(254, 253, 252, 0.92)",
          borderBottom: "1px solid var(--greytransparent-150)",
        }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "var(--color-td-primary)" }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              </div>
              <span className="font-serif text-xl font-bold" style={{ color: "var(--greytransparent-900)" }}>
                Inkwell
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {["Features", "For Teams", "Pricing", "Resources"].map((item) => (
                <button
                  key={item}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                  style={{ color: "var(--display-onlight-secondary)" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--greytransparent-150)")
                  }
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to={ctaLink}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              style={{ color: "var(--display-onlight-secondary)" }}
            >
              {isAuthenticated ? "Dashboard" : "Log in"}
            </Link>
            <Link
              to={ctaLink}
              className="px-5 py-2.5 rounded-[10px] text-sm font-semibold text-white transition-all"
              style={{
                background: "var(--color-td-primary)",
                boxShadow: "0 1px 3px rgba(228, 66, 50, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-td-primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-td-primary)")
              }
            >
              Start for free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden" style={{ background: "var(--neutral)" }}>
        <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-0 md:pt-24 md:pb-0">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="max-w-lg">
              <h1
                className="font-serif leading-[1.1] tracking-tight"
                style={{
                  fontSize: "clamp(2.75rem, 5vw, 5.375rem)",
                  fontWeight: 600,
                  color: "var(--display-onlight-primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                Clarity,
                <br />
                finally.
              </h1>
              <p
                className="mt-6 leading-relaxed"
                style={{
                  fontSize: "clamp(1.0625rem, 1.5vw, 1.125rem)",
                  color: "var(--display-onlight-secondary)",
                  lineHeight: 1.75,
                  letterSpacing: "0.005em",
                  fontWeight: 475,
                }}
              >
                Inkwell is the document editor for people who want to think clearly.
                Add your knowledge, let AI understand your context, and write with confidence.
              </p>
              <div className="mt-8 flex items-center gap-4">
                <Link
                  to={ctaLink}
                  className="inline-flex items-center px-7 py-3.5 rounded-[10px] text-base font-semibold text-white transition-all"
                  style={{
                    background: "var(--color-td-primary)",
                    boxShadow: "0 2px 8px rgba(228, 66, 50, 0.25)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--color-td-primary-hover)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--color-td-primary)")
                  }
                >
                  Start for free
                </Link>
              </div>
              <p
                className="mt-4 text-xs"
                style={{ color: "var(--display-onlight-tertiary)", letterSpacing: "0.01em" }}
              >
                Free forever. No credit card required.
              </p>
            </div>

            {/* Hero Illustration - App Preview Cards */}
            <div className="relative hidden md:block">
              <div className="relative w-full h-[420px]">
                {/* Main editor card */}
                <div
                  className="absolute top-4 right-0 w-[320px] rounded-2xl p-5 rotate-1"
                  style={{
                    background: "var(--white)",
                    boxShadow: "var(--shadow-elevated)",
                    border: "1px solid var(--greytransparent-150)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
                    <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
                  </div>
                  <div className="space-y-3">
                    <div className="h-5 rounded" style={{ background: "var(--greytransparent-150)", width: "70%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "100%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "90%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "75%" }} />
                    <div className="h-8" />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "85%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "60%" }} />
                  </div>
                </div>

                {/* Knowledge panel floating card */}
                <div
                  className="absolute top-24 left-0 w-[240px] rounded-xl p-4 -rotate-2"
                  style={{
                    background: "var(--color-td-secondary-light)",
                    boxShadow: "var(--shadow-elevated)",
                    border: "1px solid rgba(250, 232, 214, 0.5)",
                  }}
                >
                  <div
                    className="text-xs font-semibold mb-3"
                    style={{ color: "var(--color-td-primary)", letterSpacing: "0.05em", textTransform: "uppercase" }}
                  >
                    Knowledge
                  </div>
                  <div className="space-y-2">
                    {["Research notes", "Project brief", "Style guide"].map((item) => (
                      <div
                        key={item}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium"
                        style={{ background: "var(--white)", color: "var(--display-onlight-primary)" }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                          <path d="M14 2v6h6" />
                        </svg>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI chat bubble */}
                <div
                  className="absolute bottom-8 right-12 w-[260px] rounded-xl p-4 rotate-1"
                  style={{
                    background: "var(--white)",
                    boxShadow: "var(--shadow-lg)",
                    border: "1px solid var(--greytransparent-150)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center"
                      style={{ background: "var(--color-td-primary)" }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3v18M3 12h18" />
                      </svg>
                    </div>
                    <span className="text-xs font-semibold" style={{ color: "var(--display-onlight-primary)" }}>
                      AI Assistant
                    </span>
                  </div>
                  <p
                    className="text-xs leading-relaxed font-handwritten"
                    style={{ color: "var(--display-onlight-secondary)" }}
                  >
                    Based on your research notes, here's a refined opening paragraph...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wavy divider */}
        <div className="relative h-20 mt-8 md:mt-4">
          <svg
            viewBox="0 0 1440 80"
            fill="none"
            className="absolute bottom-0 w-full"
            preserveAspectRatio="none"
          >
            <path
              d="M0 40C240 10 480 70 720 40C960 10 1200 70 1440 40V80H0V40Z"
              fill="#ebf5f0"
            />
          </svg>
        </div>
      </section>

      {/* Feature 1: Capture thoughts */}
      <section style={{ background: "#ebf5f0" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="max-w-md">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-td-primary)" }}
              >
                Capture &amp; Create
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                  fontWeight: 600,
                  color: "var(--display-onlight-primary)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.28,
                }}
              >
                Write at the speed
                <br />
                of thought
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{
                  color: "var(--display-onlight-secondary)",
                  fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                  lineHeight: 1.75,
                  letterSpacing: "0.005em",
                  fontWeight: 475,
                }}
              >
                A beautiful, distraction-free editor that adapts to your flow. Rich formatting,
                elegant serif typography, and auto-save so you never lose a word.
              </p>
            </div>
            <div className="flex justify-center">
              <div
                className="w-full max-w-[440px] rounded-2xl p-6"
                style={{
                  background: "var(--white)",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--greytransparent-150)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-5">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
                </div>
                <div className="space-y-4">
                  <div
                    className="font-serif text-lg font-semibold"
                    style={{ color: "var(--display-onlight-primary)" }}
                  >
                    The Art of Clear Writing
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "100%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "92%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "78%" }} />
                  </div>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                    style={{
                      background: "var(--color-td-secondary-light)",
                      color: "var(--color-td-primary)",
                      fontWeight: 600,
                    }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                    </svg>
                    Formatting toolbar active
                  </div>
                  <div className="space-y-2.5">
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "88%" }} />
                    <div className="h-3 rounded" style={{ background: "var(--greytransparent-100)", width: "65%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 2: Stay organized */}
      <section style={{ background: "var(--neutral)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center md:order-1">
              <div
                className="w-full max-w-[440px] rounded-2xl p-6"
                style={{
                  background: "var(--white)",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--greytransparent-150)",
                }}
              >
                <div
                  className="text-xs font-semibold uppercase tracking-wider mb-4"
                  style={{ color: "var(--color-td-primary)" }}
                >
                  Knowledge Panel
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Research Notes", color: "#f0f6df", icon: "📄" },
                    { name: "Project Requirements", color: "#fff5db", icon: "📋" },
                    { name: "Brand Guidelines", color: "#ebf5f0", icon: "🎨" },
                    { name: "Meeting Minutes", color: "#f3f0fa", icon: "📝" },
                  ].map((item) => (
                    <div
                      key={item.name}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer"
                      style={{
                        background: item.color,
                        border: "1px solid transparent",
                      }}
                    >
                      <span className="text-base">{item.icon}</span>
                      <div>
                        <div
                          className="text-sm font-semibold"
                          style={{ color: "var(--display-onlight-primary)" }}
                        >
                          {item.name}
                        </div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--display-onlight-tertiary)" }}
                        >
                          3 entries
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-md md:order-0">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-td-primary)" }}
              >
                Knowledge Base
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                  fontWeight: 600,
                  color: "var(--display-onlight-primary)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.28,
                }}
              >
                Stay organized
                <br />
                and focused
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{
                  color: "var(--display-onlight-secondary)",
                  fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                  lineHeight: 1.75,
                  letterSpacing: "0.005em",
                  fontWeight: 475,
                }}
              >
                Add reference materials, research notes, and project briefs.
                Your knowledge panel keeps everything at your fingertips so you
                write with full context.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 3: AI-powered */}
      <section style={{ background: "var(--color-td-secondary-light)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="max-w-md">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-td-primary)" }}
              >
                AI Co-Writer
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                  fontWeight: 600,
                  color: "var(--display-onlight-primary)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.28,
                }}
              >
                Simplify your
                <br />
                writing process
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{
                  color: "var(--display-onlight-secondary)",
                  fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                  lineHeight: 1.75,
                  letterSpacing: "0.005em",
                  fontWeight: 475,
                }}
              >
                Chat with an AI that truly understands your document and references.
                Get help writing, editing, restructuring, and refining &mdash; without
                losing your voice.
              </p>
            </div>
            <div className="flex justify-center">
              <div
                className="w-full max-w-[440px] rounded-2xl overflow-hidden"
                style={{
                  background: "var(--white)",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--greytransparent-150)",
                }}
              >
                <div className="p-6 space-y-4">
                  {/* User message */}
                  <div className="flex justify-end">
                    <div
                      className="px-4 py-3 rounded-2xl rounded-br-sm text-sm max-w-[75%]"
                      style={{
                        background: "var(--greytransparent-150)",
                        color: "var(--display-onlight-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      Can you help me rewrite this intro to be more concise?
                    </div>
                  </div>
                  {/* AI response */}
                  <div className="flex gap-3">
                    <div
                      className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center mt-1"
                      style={{ background: "var(--color-td-primary)" }}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
                      </svg>
                    </div>
                    <div
                      className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm max-w-[85%]"
                      style={{
                        background: "var(--color-td-secondary-light)",
                        color: "var(--display-onlight-primary)",
                        lineHeight: 1.5,
                      }}
                    >
                      Based on your research notes, here&apos;s a tighter version that keeps
                      the key points while cutting the word count by 40%...
                    </div>
                  </div>
                  {/* AI context badge */}
                  <div
                    className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg w-fit"
                    style={{
                      background: "var(--color-td-secondary-mid)",
                      color: "var(--color-td-primary)",
                      fontWeight: 600,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                    Using 3 knowledge sources
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature 4: Team collaboration */}
      <section style={{ background: "var(--neutral)" }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="flex justify-center md:order-1">
              <div
                className="w-full max-w-[440px] rounded-2xl p-6"
                style={{
                  background: "var(--white)",
                  boxShadow: "var(--shadow-elevated)",
                  border: "1px solid var(--greytransparent-150)",
                }}
              >
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { title: "Q1 Report", time: "2 min ago", bg: "#fff6f0" },
                    { title: "Blog Draft", time: "1 hour ago", bg: "#f6faeb" },
                    { title: "Product Brief", time: "Yesterday", bg: "#fff9eb" },
                    { title: "Research", time: "2 days ago", bg: "#f4fbf7" },
                  ].map((doc) => (
                    <div
                      key={doc.title}
                      className="rounded-xl p-4 cursor-pointer transition-all"
                      style={{
                        background: doc.bg,
                        border: "1px solid var(--greytransparent-100)",
                      }}
                    >
                      <div
                        className="text-sm font-semibold mb-1"
                        style={{ color: "var(--display-onlight-primary)" }}
                      >
                        {doc.title}
                      </div>
                      <div className="text-xs" style={{ color: "var(--display-onlight-tertiary)" }}>
                        {doc.time}
                      </div>
                      <div className="mt-3 space-y-1.5">
                        <div className="h-2 rounded" style={{ background: "var(--greytransparent-100)", width: "100%" }} />
                        <div className="h-2 rounded" style={{ background: "var(--greytransparent-100)", width: "70%" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="max-w-md md:order-0">
              <p
                className="text-sm font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-td-primary)" }}
              >
                Your Documents
              </p>
              <h2
                className="font-serif leading-tight"
                style={{
                  fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                  fontWeight: 600,
                  color: "var(--display-onlight-primary)",
                  letterSpacing: "-0.005em",
                  lineHeight: 1.28,
                }}
              >
                A home for your
                <br />
                best work
              </h2>
              <p
                className="mt-5 leading-relaxed"
                style={{
                  color: "var(--display-onlight-secondary)",
                  fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                  lineHeight: 1.75,
                  letterSpacing: "0.005em",
                  fontWeight: 475,
                }}
              >
                All your documents in one place. Instantly access, search, and
                organize your writing. Real-time sync means your work is always
                up to date.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section
        className="py-20 md:py-28"
        style={{ background: "var(--neutral)" }}
      >
        <div className="max-w-[1000px] mx-auto px-6">
          <div
            className="relative rounded-3xl overflow-hidden p-8 md:p-12"
            style={{
              background: "linear-gradient(135deg, var(--color-td-secondary-dark) 0%, var(--color-td-secondary-mid) 50%, #ebf5f0 100%)",
              boxShadow: "var(--shadow-elevated)",
            }}
          >
            <div className="text-center mb-10">
              <h2
                className="font-handwritten text-4xl md:text-5xl font-medium"
                style={{
                  color: "var(--display-onlight-primary)",
                }}
              >
                What&apos;s Inkwell?
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                    </svg>
                  ),
                  title: "Rich Editor",
                  desc: "Beautiful serif typography with powerful formatting tools",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  ),
                  title: "Knowledge Base",
                  desc: "Reference materials always at your fingertips",
                },
                {
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z" />
                    </svg>
                  ),
                  title: "AI Co-Writer",
                  desc: "Context-aware AI that speaks in your voice",
                },
              ].map((card) => (
                <div
                  key={card.title}
                  className="rounded-2xl p-6 text-center transition-all"
                  style={{
                    background: "var(--white)",
                    boxShadow: "var(--shadow-card-idle)",
                    border: "1px solid var(--greytransparent-150)",
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: "var(--color-td-secondary-light)", color: "var(--color-td-primary)" }}
                  >
                    {card.icon}
                  </div>
                  <h3
                    className="font-semibold text-base mb-2"
                    style={{ color: "var(--display-onlight-primary)" }}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "var(--display-onlight-secondary)" }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases / Templates Section */}
      <section
        className="py-20 md:py-28"
        style={{
          background: "var(--neutral)",
          borderTop: "1px solid var(--greytransparent-150)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="text-center mb-12">
            <h2
              className="font-serif"
              style={{
                fontSize: "clamp(1.75rem, 3vw, 2.375rem)",
                fontWeight: 600,
                color: "var(--display-onlight-primary)",
                letterSpacing: "-0.005em",
                lineHeight: 1.28,
              }}
            >
              Start your next project with Inkwell
            </h2>
            <p
              className="mt-4"
              style={{
                color: "var(--display-onlight-secondary)",
                fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
                lineHeight: 1.75,
                fontWeight: 475,
              }}
            >
              Templates and workflows for every kind of writer.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {["All", "Blog Posts", "Reports", "Research", "Creative", "Business", "Academic"].map(
              (tab, i) => (
                <button
                  key={tab}
                  className="px-5 py-2.5 rounded-full text-sm font-medium transition-all"
                  style={{
                    background: i === 0 ? "var(--greytransparent-900)" : "var(--greytransparent-150)",
                    color: i === 0 ? "var(--white)" : "var(--display-onlight-secondary)",
                  }}
                >
                  {tab}
                </button>
              )
            )}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "Blog Post", emoji: "✍️", bg: "#fff6f0" },
              { name: "Research Paper", emoji: "🔬", bg: "#f6faeb" },
              { name: "Business Proposal", emoji: "📊", bg: "#fff9eb" },
              { name: "Meeting Notes", emoji: "📝", bg: "#f4fbf7" },
              { name: "Creative Story", emoji: "📖", bg: "#f9f6fd" },
              { name: "Product Brief", emoji: "🚀", bg: "#fff5f5" },
              { name: "Newsletter", emoji: "📧", bg: "#f1f8f9" },
              { name: "Case Study", emoji: "🔍", bg: "#f2efed" },
            ].map((template) => (
              <div
                key={template.name}
                className="rounded-xl p-5 cursor-pointer transition-all group"
                style={{
                  background: template.bg,
                  border: "1px solid var(--greytransparent-100)",
                }}
              >
                <span className="text-2xl block mb-3">{template.emoji}</span>
                <div
                  className="text-sm font-semibold group-hover:underline"
                  style={{ color: "var(--display-onlight-primary)" }}
                >
                  {template.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Features Cards - Two Column */}
      <section className="py-20 md:py-28" style={{ background: "var(--neutral)" }}>
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* AI Card */}
            <div
              className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #fae8d6, #fff5eb)",
                border: "1px solid rgba(250, 232, 214, 0.6)",
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "var(--color-td-primary)" }}
              >
                Powered by AI
              </div>
              <h3
                className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-4"
                style={{ color: "var(--display-onlight-primary)", letterSpacing: "-0.01em" }}
              >
                AI in
                <br />
                Inkwell
              </h3>
              <p
                className="text-sm leading-relaxed mb-6 max-w-xs"
                style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.6 }}
              >
                Our AI reads your knowledge base, understands your document, and
                helps you write better &mdash; while keeping your unique voice.
              </p>
              <Link
                to={ctaLink}
                className="inline-flex items-center gap-1.5 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: "var(--color-td-primary)" }}
              >
                Learn more
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Smart Features Card */}
            <div
              className="rounded-2xl p-8 md:p-10 relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #ebf5f0, #f4fbf7)",
                border: "1px solid rgba(186, 222, 214, 0.4)",
              }}
            >
              <div
                className="text-xs font-semibold uppercase tracking-wider mb-4"
                style={{ color: "#417171" }}
              >
                Smart Features
              </div>
              <h3
                className="font-serif text-2xl md:text-3xl font-semibold leading-tight mb-4"
                style={{ color: "var(--display-onlight-primary)", letterSpacing: "-0.01em" }}
              >
                Features that
                <br />
                feel magical
              </h3>
              <p
                className="text-sm leading-relaxed max-w-xs"
                style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.6 }}
              >
                Auto-save, real-time sync, knowledge-aware suggestions,
                and a formatting toolbar that stays out of your way.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Auto-save", "Real-time", "Context-aware", "Rich formatting"].map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1.5 rounded-full text-xs font-medium"
                    style={{
                      background: "var(--white)",
                      color: "var(--display-onlight-secondary)",
                      border: "1px solid var(--greytransparent-200)",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section
        className="py-16 md:py-20"
        style={{
          background: "var(--neutral)",
          borderTop: "1px solid var(--greytransparent-150)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-10 items-start">
            <div>
              <h3
                className="font-serif text-xl font-semibold mb-3"
                style={{ color: "var(--display-onlight-primary)", lineHeight: 1.3 }}
              >
                A writing tool you can trust for life
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--display-onlight-secondary)", lineHeight: 1.6 }}
              >
                Built on reliable infrastructure with real-time sync.
                Your documents are always safe and accessible.
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "var(--color-td-secondary-light)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e44232" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--display-onlight-primary)" }}
                >
                  Secure by default
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
                >
                  Your data is encrypted and protected with industry-standard security.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: "#ebf5f0" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#417171" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <path d="M22 4 12 14.01l-3-3" />
                </svg>
              </div>
              <div>
                <div
                  className="text-sm font-semibold mb-1"
                  style={{ color: "var(--display-onlight-primary)" }}
                >
                  Always available
                </div>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
                >
                  99.9% uptime with real-time sync across all your devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section
        className="py-24 md:py-32"
        style={{
          background: "linear-gradient(180deg, var(--neutral) 0%, #fff6f0 100%)",
        }}
      >
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2
            className="font-serif leading-tight"
            style={{
              fontSize: "clamp(2rem, 4vw, 3.4rem)",
              fontWeight: 600,
              color: "var(--display-onlight-primary)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            Gain clarity and confidence with the writer&apos;s favorite editor
          </h2>
          <p
            className="mt-6 mx-auto max-w-lg"
            style={{
              color: "var(--display-onlight-secondary)",
              fontSize: "clamp(1rem, 1.3vw, 1.125rem)",
              lineHeight: 1.75,
              fontWeight: 475,
            }}
          >
            Join thousands of writers who think more clearly with Inkwell.
          </p>
          <div className="mt-10">
            <Link
              to={ctaLink}
              className="inline-flex items-center px-8 py-4 rounded-[12px] text-base font-semibold text-white transition-all"
              style={{
                background: "var(--color-td-primary)",
                boxShadow: "0 4px 16px rgba(228, 66, 50, 0.3)",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-td-primary-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-td-primary)")
              }
            >
              Start for free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="py-12"
        style={{
          background: "var(--greytransparent-900)",
          color: "var(--whitetransparent-300)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center"
                  style={{ background: "var(--color-td-primary)" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  </svg>
                </div>
                <span className="font-serif text-base font-bold text-white">Inkwell</span>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--whitetransparent-200)" }}>
                Write beautifully.
                <br />
                Think clearly.
              </p>
            </div>
            {[
              {
                title: "Product",
                links: ["Features", "Pricing", "Templates", "Integrations"],
              },
              {
                title: "Resources",
                links: ["Blog", "Help Center", "API Docs", "Changelog"],
              },
              {
                title: "Company",
                links: ["About", "Careers", "Press", "Contact"],
              },
              {
                title: "Legal",
                links: ["Privacy", "Terms", "Security", "GDPR"],
              },
            ].map((group) => (
              <div key={group.title}>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
                  {group.title}
                </h4>
                <ul className="space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: "var(--whitetransparent-300)" }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div
            className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
            style={{ borderTop: "1px solid rgba(255, 255, 255, 0.1)" }}
          >
            <p className="text-xs" style={{ color: "var(--whitetransparent-200)" }}>
              &copy; {new Date().getFullYear()} Inkwell. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              {["Twitter", "GitHub", "LinkedIn"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: "var(--whitetransparent-300)" }}
                >
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
