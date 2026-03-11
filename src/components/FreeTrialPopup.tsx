import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { PolarEmbedCheckout } from "@polar-sh/checkout/embed";

const CHECKOUT_LINK =
  "https://buy.polar.sh/polar_cl_0SKFAE70KevgfGPSHRXIUJA9Bv1479w3wWuiw47O2Qs";

const benefits = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" /><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z" />
      </svg>
    ),
    title: "AI-Powered Writing",
    description: "Get intelligent suggestions and generate content with context-aware AI",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    title: "Smart Knowledge Base",
    description: "Attach reference materials so your AI assistant truly understands your project",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    title: "Contextual AI Chat",
    description: "Chat with an AI that knows your document and can insert content directly",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" />
      </svg>
    ),
    title: "Unlimited Documents",
    description: "Create as many documents as you need with a beautiful rich text editor",
  },
];

export default function FreeTrialPopup({ email }: { email: string }) {
  const navigate = useNavigate();
  const createPending = useMutation(api.subscriptions.createPending);
  const subscription = useQuery(api.subscriptions.getByUser);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (subscription?.status === "active") {
      navigate("/dashboard", { replace: true });
    }
  }, [subscription, navigate]);

  const handleStartTrial = useCallback(async () => {
    setLoading(true);
    try {
      await createPending({ email });

      const checkoutUrl = `${CHECKOUT_LINK}?customer_email=${encodeURIComponent(email)}`;
      const checkout = await PolarEmbedCheckout.create(checkoutUrl, {
        theme: "light",
      });

      setCheckoutOpen(true);

      checkout.addEventListener("success", () => {
        setCheckoutOpen(false);
      });

      checkout.addEventListener("close", () => {
        setCheckoutOpen(false);
        setLoading(false);
      });
    } catch (err) {
      console.error("Checkout error:", err);
      setLoading(false);
    }
  }, [email, createPending]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(254,253,252,0.92)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full max-w-[480px] rounded-2xl p-8 animate-in fade-in"
        style={{
          background: "var(--white)",
          boxShadow: "var(--shadow-elevated)",
          border: "1px solid var(--greytransparent-150)",
        }}
      >
        <div className="text-center mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--color-td-primary)" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <h2
            className="font-serif text-2xl font-semibold mb-2"
            style={{ color: "var(--display-onlight-primary)", letterSpacing: "-0.01em" }}
          >
            Start your Inkwell journey
          </h2>
          <p
            className="text-sm"
            style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.6 }}
          >
            Unlock AI-powered writing tools designed to help you create your best work.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex gap-3 p-3 rounded-xl"
              style={{ background: "var(--color-td-secondary-light)" }}
            >
              <div
                className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5"
                style={{ color: "var(--color-td-primary)", background: "var(--white)" }}
              >
                {benefit.icon}
              </div>
              <div>
                <p
                  className="text-sm font-semibold mb-0.5"
                  style={{ color: "var(--display-onlight-primary)" }}
                >
                  {benefit.title}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--display-onlight-tertiary)", lineHeight: 1.5 }}
                >
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl p-4 mb-6 text-center"
          style={{
            background: "var(--greytransparent-100)",
            border: "1px solid var(--greytransparent-150)",
          }}
        >
          <div className="flex items-baseline justify-center gap-1">
            <span
              className="font-serif text-3xl font-bold"
              style={{ color: "var(--display-onlight-primary)" }}
            >
              $10
            </span>
            <span
              className="text-sm"
              style={{ color: "var(--display-onlight-tertiary)" }}
            >
              /month
            </span>
          </div>
          <p
            className="text-xs mt-1"
            style={{ color: "var(--display-onlight-tertiary)" }}
          >
            Start with a free trial — cancel anytime
          </p>
        </div>

        <button
          onClick={handleStartTrial}
          disabled={loading || checkoutOpen}
          className="w-full py-3.5 text-sm font-semibold text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          style={{
            background: "var(--color-td-primary)",
            borderRadius: "var(--border-radius-base)",
            boxShadow: "0 1px 3px rgba(228, 66, 50, 0.3)",
          }}
          onMouseEnter={(e) => {
            if (!loading && !checkoutOpen)
              e.currentTarget.style.background = "#ee5244";
          }}
          onMouseLeave={(e) => {
            if (!loading && !checkoutOpen)
              e.currentTarget.style.background = "var(--color-td-primary)";
          }}
        >
          {loading ? "Opening checkout..." : "Start free trial"}
        </button>

        <button
          onClick={() => {
            // #region agent log
            fetch('http://127.0.0.1:7886/ingest/d96981d0-0cd0-42b2-981b-3b729d0b7623',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'909718'},body:JSON.stringify({sessionId:'909718',location:'FreeTrialPopup.tsx:Skip',message:'Skip for now clicked',data:{email},hypothesisId:'C',timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            navigate("/dashboard", { replace: true });
          }}
          className="w-full mt-3 py-2.5 text-sm font-medium transition-colors"
          style={{ color: "var(--display-onlight-tertiary)" }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--display-onlight-primary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--display-onlight-tertiary)";
          }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
