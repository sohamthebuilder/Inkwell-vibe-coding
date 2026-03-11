import { useQuery, useMutation } from "convex/react";
import { useNavigate } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import Header from "../components/Header";
import DocumentCard from "../components/DocumentCard";

export default function DashboardPage() {
  const documents = useQuery(api.documents.list);
  const createDoc = useMutation(api.documents.create);
  const navigate = useNavigate();

  const handleCreate = async () => {
    const id = await createDoc();
    navigate(`/document/${id}`);
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--neutral)" }}>
      <Header />

      <main className="max-w-[1200px] mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="font-serif text-2xl font-semibold"
              style={{
                color: "var(--display-onlight-primary)",
                letterSpacing: "-0.01em",
              }}
            >
              Your Documents
            </h1>
            <p
              className="mt-1 text-sm"
              style={{ color: "var(--display-onlight-tertiary)" }}
            >
              {documents !== undefined && documents.length > 0
                ? `${documents.length} document${documents.length !== 1 ? "s" : ""}`
                : ""}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white transition-all"
            style={{
              background: "var(--color-td-primary)",
              borderRadius: "var(--border-radius-base)",
              boxShadow: "0 1px 3px rgba(228, 66, 50, 0.3)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ee5244")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "var(--color-td-primary)")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            New Document
          </button>
        </div>

        {documents === undefined ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl p-6 animate-pulse"
                style={{
                  background: "var(--white)",
                  border: "1px solid var(--greytransparent-150)",
                }}
              >
                <div
                  className="h-5 rounded w-2/3 mb-4"
                  style={{ background: "var(--greytransparent-150)" }}
                />
                <div
                  className="h-3 rounded w-full mb-2"
                  style={{ background: "var(--greytransparent-100)" }}
                />
                <div
                  className="h-3 rounded w-4/5 mb-2"
                  style={{ background: "var(--greytransparent-100)" }}
                />
                <div
                  className="h-3 rounded w-1/2 mt-6"
                  style={{ background: "var(--greytransparent-100)" }}
                />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-24">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6"
              style={{ background: "var(--greytransparent-150)" }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ stroke: "var(--display-onlight-tertiary)" }}>
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
                <path d="M14 2v6h6" />
                <path d="M12 18v-6" />
                <path d="M9 15h6" />
              </svg>
            </div>
            <h2
              className="font-serif text-xl font-semibold mb-2"
              style={{ color: "var(--display-onlight-primary)" }}
            >
              No documents yet
            </h2>
            <p
              className="text-sm mb-8 max-w-xs mx-auto"
              style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.6 }}
            >
              Create your first document to start writing with AI assistance.
            </p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white transition-all"
              style={{
                background: "var(--color-td-primary)",
                borderRadius: "var(--border-radius-base)",
                boxShadow: "0 2px 8px rgba(228, 66, 50, 0.25)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#ee5244")}
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "var(--color-td-primary)")
              }
            >
              Create Your First Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                id={doc._id}
                title={doc.title}
                content={doc.content}
                updatedAt={doc.updatedAt}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
