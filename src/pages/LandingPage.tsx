import { Link } from "react-router-dom";
import { useConvexAuth } from "convex/react";

export default function LandingPage() {
  const { isAuthenticated } = useConvexAuth();

  return (
    <div className="min-h-screen bg-cream-50">
      <nav className="flex items-center justify-between px-8 py-6 max-w-6xl mx-auto">
        <h1 className="font-serif text-2xl font-bold text-ink-800">Inkwell</h1>
        <Link
          to={isAuthenticated ? "/dashboard" : "/auth"}
          className="px-5 py-2.5 bg-ink-800 text-cream-50 rounded-lg font-medium text-sm
                     hover:bg-ink-900 transition-colors shadow-sm"
        >
          {isAuthenticated ? "Dashboard" : "Sign In"}
        </Link>
      </nav>

      <section className="max-w-4xl mx-auto px-8 pt-24 pb-32 text-center">
        <h2 className="font-serif text-5xl md:text-6xl font-bold text-ink-900 leading-tight tracking-tight">
          Write with clarity.
          <br />
          <span className="text-accent-500">Edit with intelligence.</span>
        </h2>
        <p className="mt-6 text-lg text-ink-400 max-w-2xl mx-auto leading-relaxed">
          Inkwell is a document editor that understands your references. Add
          knowledge, and let AI help you write with full context of your
          materials.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            to={isAuthenticated ? "/dashboard" : "/auth"}
            className="px-8 py-3.5 bg-accent-500 text-white rounded-xl font-semibold
                       hover:bg-accent-600 transition-colors shadow-md shadow-accent-500/20
                       text-lg"
          >
            Get Started
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-32">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
            }
            title="Knowledge Context"
            description="Add reference materials, notes, and research. Your AI assistant uses them to write informed, accurate content."
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
              </svg>
            }
            title="AI Co-writer"
            description="Chat with an AI assistant that understands your document and references. Get help writing, editing, and refining."
          />
          <FeatureCard
            icon={
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
              </svg>
            }
            title="Rich Editing"
            description="A beautiful, distraction-free editor with formatting tools. Write in elegant serif typography with auto-save."
          />
        </div>
      </section>

      <footer className="border-t border-cream-300 py-8 text-center">
        <p className="text-ink-300 text-sm font-serif">
          Inkwell &mdash; Write beautifully.
        </p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div
      className="bg-white rounded-2xl p-8 shadow-sm border border-cream-200
                    hover:shadow-md transition-shadow"
    >
      <div className="text-accent-500 mb-4">{icon}</div>
      <h3 className="font-serif text-xl font-semibold text-ink-800 mb-2">
        {title}
      </h3>
      <p className="text-ink-400 leading-relaxed">{description}</p>
    </div>
  );
}
