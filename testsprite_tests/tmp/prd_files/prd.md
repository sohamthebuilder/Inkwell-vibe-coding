# Inkwell — Product Requirements Document

**Version:** 1.0  
**Last Updated:** March 11, 2025

---

## 1. Executive Summary

**Inkwell** is an AI-powered document editor that helps users write with clarity and confidence. It combines a rich text editor, a per-document knowledge base, and a context-aware AI co-writer that uses both the document content and reference materials to assist users without losing their voice.

**Tagline:** *"Clarity, finally."*

**Value Proposition:** Add your knowledge, let AI understand your context, and write with confidence. The AI matches the document's tone and style and uses the knowledge base when relevant.

---

## 2. Product Vision

### 2.1 Problem Statement

Writers face a common challenge: they have reference materials, research notes, and project briefs scattered across tools, but generic AI assistants lack context. This leads to:
- Generic, off-brand AI responses
- Manual copy-pasting of context into every prompt
- Disconnected workflows between research and writing

### 2.2 Solution

Inkwell unifies the writing workflow into a single environment:
- **Knowledge Base:** Store reference materials per document
- **AI Co-Writer:** Context-aware AI that reads your document and knowledge
- **Rich Editor:** Distraction-free writing with formatting and auto-save

### 2.3 Target Users

- **Content creators** (bloggers, writers, marketers)
- **Researchers** (academics, analysts)
- **Business professionals** (proposals, reports, briefs)
- **Anyone** who writes with reference materials and wants AI assistance that preserves their voice

---

## 3. Core Features

### 3.1 Document Management

| Feature | Description | Status |
|---------|-------------|--------|
| Create document | Create new documents from dashboard | ✅ |
| List documents | View all user documents with previews | ✅ |
| Open document | Navigate to editor | ✅ |
| Edit document | Rich text editing with auto-save | ✅ |
| Delete document | Remove with confirmation modal | ✅ |
| Auto-save | 1-second debounce, real-time sync via Convex | ✅ |

### 3.2 Rich Text Editor

| Feature | Description | Status |
|---------|-------------|--------|
| TipTap editor | StarterKit with Placeholder extension | ✅ |
| Formatting | Bold, italic, strikethrough | ✅ |
| Headings | H1, H2, H3 | ✅ |
| Lists | Bullet, ordered | ✅ |
| Blockquotes | Quote blocks | ✅ |
| Undo/Redo | Full history support | ✅ |
| Typography | Serif font (Lora) | ✅ |
| Placeholder | "Start writing your document…" | ✅ |

### 3.3 Knowledge Base

| Feature | Description | Status |
|---------|-------------|--------|
| Per-document entries | Each document has its own knowledge panel | ✅ |
| Add entry | Title + content | ✅ |
| Remove entry | Delete knowledge entries | ✅ |
| AI context | All entries sent as context to AI | ✅ |
| Collapsible panel | Left sidebar, toggle | ✅ |

### 3.4 AI Co-Writer

| Feature | Description | Status |
|---------|-------------|--------|
| Chat interface | Right sidebar chat UI | ✅ |
| Context sources | Document content + knowledge entries + optional selected text | ✅ |
| System prompt | Expert writing assistant, matches tone/style, uses references | ✅ |
| Insert into document | One-click insert of AI response | ✅ |
| Add to AI | Bubble menu on text selection to add to context | ✅ |
| Model | OpenAI GPT-4o (temperature 0.7, max 2048 tokens) | ✅ |
| Chat history | Persisted per document | ✅ |

### 3.5 Authentication & User Management

| Feature | Description | Status |
|---------|-------------|--------|
| Sign up | Email/password via Convex Auth | ✅ |
| Sign in | Email/password | ✅ |
| Protected routes | Dashboard, Editor, Profile require auth | ✅ |
| Profile | Edit name, view email (read-only) | ✅ |
| Sign out | Logout from dashboard | ✅ |

### 3.6 Subscription & Billing

| Feature | Description | Status |
|---------|-------------|--------|
| Free trial popup | Shown after signup | ✅ |
| Polar checkout | Embed checkout for $10/month | ✅ |
| Webhook | Handle subscription.active, order.created | ✅ |
| Subscription status | pending, active | ✅ |
| Skip for now | Dismiss popup, continue to dashboard | ✅ |

---

## 4. User Flows

### 4.1 New User Flow

1. **Landing** → User visits `/`
2. **Sign up** → Clicks "Start for free" → `/auth`
3. **Auth** → Enters email/password, signs up
4. **Free trial popup** → `FreeTrialPopup` shown
5. **Choice** → "Start free trial" (Polar checkout) or "Skip for now" (→ dashboard)
6. **Dashboard** → Document list, create new or open existing

### 4.2 Returning User Flow

1. **Landing** → User visits `/`
2. **Sign in** → `/auth` → Logs in
3. **Dashboard** → Document list
4. **Editor** → Opens document → Edit, knowledge, AI chat

### 4.3 Writing Flow

1. **Create** or **open** document
2. **Add knowledge** (optional) — research notes, briefs, style guides
3. **Write** in editor with formatting
4. **Select text** → "Add to AI" (optional) for focused context
5. **Chat** with AI → Ask for help, rewrites, edits
6. **Insert** AI response into document
7. **Auto-save** → Changes sync in real time

---

## 5. Technical Architecture

### 5.1 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 19, TypeScript, Vite 7 |
| **Routing** | React Router v7 |
| **Styling** | Tailwind CSS v4 |
| **Editor** | TipTap (StarterKit, Placeholder) |
| **Backend** | Convex |
| **Auth** | @convex-dev/auth (Password provider) |
| **AI** | OpenAI GPT-4o |
| **Payments** | Polar (Polar.sh SDK + embed checkout) |
| **Testing** | Vitest, Testing Library |

### 5.2 App Structure

```
App
├── ErrorBoundary
├── ConvexAuthProvider
│   └── BrowserRouter
│       └── App (routes)
│           ├── / (LandingPage)
│           ├── /auth (AuthPage)
│           ├── /dashboard (DashboardPage) [protected]
│           ├── /document/:id (EditorPage) [protected]
│           └── /profile (ProfilePage) [protected]
```

### 5.3 Data Model (Convex)

| Table | Purpose |
|-------|---------|
| **documents** | userId, title, content, createdAt, updatedAt |
| **knowledge** | documentId, userId, title, content, createdAt |
| **chatMessages** | documentId, userId, role, content, createdAt |
| **subscriptions** | userId, email, polarSubscriptionId?, status, createdAt, updatedAt |
| **users** | From authTables (Convex Auth) |

### 5.4 Convex Functions

| File | Purpose |
|------|---------|
| `auth.ts` | Convex Auth + Password provider |
| `documents.ts` | list, get, create, update, remove |
| `knowledge.ts` | list, add, remove |
| `chat.ts` | list, send, sendInternal (AI) |
| `ai.ts` | `generate` action (OpenAI) |
| `users.ts` | currentUser, updateProfile |
| `subscriptions.ts` | getByUser, createPending, activateByEmail |
| `polarWebhook.ts` | handleWebhook (subscription.active, order.created) |
| `http.ts` | Auth routes + `/polar-webhook` POST |

### 5.5 Environment Variables

| Variable | Purpose |
|----------|---------|
| `OPENAI_API_KEY` | OpenAI API for AI generation |
| `POLAR_WEBHOOK_SECRET` | Verify Polar webhook signatures |
| `CONVEX_SITE_URL` | Convex deployment URL |
| `VITE_CONVEX_URL` | Convex URL for frontend |

---

## 6. Key Pages & Components

### 6.1 Pages

| Route | Page | Purpose |
|-------|------|---------|
| `/` | LandingPage | Marketing, hero, features, CTAs |
| `/auth` | AuthPage | Sign in / sign up |
| `/dashboard` | DashboardPage | Document list, create new |
| `/document/:id` | EditorPage | Editor + AI + knowledge |
| `/profile` | ProfilePage | Edit name, view email |

### 6.2 Components

| Component | Purpose |
|-----------|---------|
| **Editor** | TipTap editor, auto-save, debounce, "Add to AI" bubble |
| **EditorToolbar** | Bold, italic, strike, H1–H3, lists, blockquote, undo/redo |
| **KnowledgePanel** | Add/remove knowledge entries per document |
| **AIChatPanel** | Chat UI, sends messages, calls AI, inserts responses |
| **DocumentCard** | Card with preview, delete, confirmation modal |
| **Header** | Logo, user dropdown (Profile, Sign out) |
| **ProtectedRoute** | Auth guard, loading state |
| **FreeTrialPopup** | Post-signup trial popup with Polar checkout |
| **ErrorBoundary** | Error boundary wrapper |

---

## 7. AI System

### 7.1 System Prompt

The AI is configured as an expert writing assistant that:
- Uses document content and knowledge entries as context
- Matches the tone and style of the document
- Outputs only text content (no meta-commentary unless asked)
- Uses references when relevant

### 7.2 Context Assembly

1. **Knowledge entries** — All entries for the document
2. **Document content** — Full document text
3. **Selected text** — User-selected text via "Add to AI" bubble (optional)

### 7.3 Model Configuration

- **Model:** GPT-4o
- **Temperature:** 0.7
- **Max tokens:** 2048

---

## 8. Monetization

### 8.1 Pricing

- **$10/month** — Subscription via Polar
- **Free trial** — Offered at signup
- **Messaging:** "Start with a free trial — cancel anytime"

### 8.2 Subscription Flow

1. User signs up → `FreeTrialPopup` shown
2. "Start free trial" → `createPending` → Polar embed checkout
3. Polar webhook → `activateByEmail` → status set to `active`
4. User with active subscription → redirect to dashboard

### 8.3 Subscription States

- `pending` — Checkout started but not completed
- `active` — `polarSubscriptionId` set, subscription active

---

## 9. Non-Functional Requirements

### 9.1 Performance

- Auto-save debounce: 1 second
- Real-time sync via Convex subscriptions
- Efficient re-renders with React 19

### 9.2 Security

- Auth via Convex Auth (Password provider)
- Protected routes for authenticated users only
- Data scoped by userId (documents, knowledge, chat)

### 9.3 Reliability

- Error boundary for app-level errors
- Real-time sync for data consistency
- Convex backend for reliability

### 9.4 Accessibility

- Semantic HTML structure
- Keyboard navigation support
- Focus management in modals

---

## 10. Future Considerations

### 10.1 Marketing / Landing

- **Features, For Teams, Pricing, Resources** — Nav items present but not yet implemented
- **Templates** — UI shown (Blog Post, Research Paper, etc.) but not functional
- **Footer links** — Placeholder links

### 10.2 Potential Features

- **Templates** — Pre-built document templates
- **Collaboration** — Real-time collaboration, sharing
- **Export** — PDF, Markdown, DOCX
- **Search** — Full-text search across documents
- **Organization** — Folders, tags, favorites
- **OAuth** — Google, GitHub sign-in
- **Usage limits** — Free tier limits, subscription tiers

---

## 11. Success Metrics

| Metric | Description |
|--------|-------------|
| **Signup conversion** | % of landing visitors who sign up |
| **Trial conversion** | % of signups who start trial |
| **Paid conversion** | % of trials that convert to paid |
| **Document creation** | Documents created per user |
| **AI usage** | % of documents with AI chat usage |
| **Retention** | DAU/MAU, retention curves |

---

## 12. Appendix

### 12.1 File Structure

```
convex/
  schema.ts
  auth.ts, auth.config.ts
  documents.ts, knowledge.ts, chat.ts, ai.ts
  users.ts, subscriptions.ts
  polarWebhook.ts, http.ts

src/
  main.tsx, App.tsx
  pages/ LandingPage, AuthPage, DashboardPage, EditorPage, ProfilePage
  components/ Editor, EditorToolbar, KnowledgePanel, AIChatPanel
  components/ DocumentCard, Header, ProtectedRoute, FreeTrialPopup, ErrorBoundary
  lib/ utils.ts
  test/ setup.ts
```

### 12.2 Design Tokens

- **Primary:** `var(--color-td-primary)` (coral/red)
- **Secondary:** `var(--color-td-secondary-light)`, `var(--color-td-secondary-mid)`, `var(--color-td-secondary-dark)`
- **Neutral:** `var(--neutral)`
- **Typography:** Serif (Lora), handwritten accents

---

*This PRD reflects the current state of Inkwell as of March 2025.*
