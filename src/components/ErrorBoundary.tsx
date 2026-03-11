import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Uncaught error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-screen flex items-center justify-center p-6"
          style={{ background: "var(--neutral, #f8f8f6)" }}
        >
          <div
            className="max-w-lg w-full rounded-2xl p-8 text-center"
            style={{
              background: "var(--white, #fff)",
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div
              className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5"
              style={{ background: "rgba(228, 66, 50, 0.1)" }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e44232"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>

            <h1
              className="text-xl font-semibold mb-2"
              style={{ color: "var(--display-onlight-primary, #1a1a1a)" }}
            >
              Something went wrong
            </h1>

            <p
              className="text-sm mb-6"
              style={{
                color: "var(--display-onlight-tertiary, #888)",
                lineHeight: 1.6,
              }}
            >
              An unexpected error occurred. You can try reloading the page or
              going back to the dashboard.
            </p>

            <div
              className="text-left rounded-lg p-4 mb-6 overflow-auto max-h-40"
              style={{
                background: "var(--neutral, #f8f8f6)",
                border: "1px solid var(--greytransparent-150, #e5e5e5)",
              }}
            >
              <p
                className="text-xs font-mono break-all"
                style={{ color: "#e44232", lineHeight: 1.6 }}
              >
                {this.state.error?.message || "Unknown error"}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.location.assign("/dashboard")}
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all hover:brightness-95"
                style={{
                  background: "var(--greytransparent-100, #f0f0f0)",
                  color: "var(--display-onlight-primary, #1a1a1a)",
                }}
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 text-sm font-medium text-white rounded-lg transition-all hover:brightness-95"
                style={{ background: "var(--color-td-primary, #e44232)" }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
