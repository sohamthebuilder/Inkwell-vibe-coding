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
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main className="max-w-6xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-serif text-3xl font-bold text-ink-900">
            Your Documents
          </h1>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-accent-500 text-white rounded-xl
                       font-medium hover:bg-accent-600 transition-colors shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            New Document
          </button>
        </div>

        {documents === undefined ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-cream-200 p-6 animate-pulse"
              >
                <div className="h-5 bg-cream-200 rounded w-2/3 mb-4" />
                <div className="h-3 bg-cream-100 rounded w-full mb-2" />
                <div className="h-3 bg-cream-100 rounded w-4/5 mb-2" />
                <div className="h-3 bg-cream-100 rounded w-1/2 mt-6" />
              </div>
            ))}
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-block p-4 bg-cream-200 rounded-2xl mb-6">
              <svg className="w-12 h-12 text-ink-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-semibold text-ink-700 mb-2">
              No documents yet
            </h2>
            <p className="text-ink-400 mb-6">
              Create your first document to start writing with AI assistance.
            </p>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-accent-500 text-white rounded-xl font-semibold
                         hover:bg-accent-600 transition-colors shadow-sm"
            >
              Create Your First Document
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
