# Inkwell — AI-Powered Document Editor

> *"Clarity, finally."*

Inkwell is a full-stack, AI-powered document editor that combines a rich text writing environment, a per-document knowledge base, and a context-aware AI co-writer. Users add their reference materials, and the AI uses both the document content and those references to assist writing — without losing the author's voice.

<img width="1440" height="819" alt="Screenshot 2026-03-12 at 9 56 20 AM" src="https://github.com/user-attachments/assets/709bd454-9464-498b-aed8-b1d44d68802d" />
<img width="1903" height="1061" alt="photo-collage png" src="https://github.com/user-attachments/assets/b6973a42-d393-444d-a61c-96d1a9685061" />


Huge shoutout to the youtube tutorial I learned from: https://youtu.be/Qcxq4iXLZbY

**Live stack:** React 19 · TypeScript · Vite 7 · Tailwind CSS v4 · TipTap · Convex · OpenAI GPT-4o · Polar

---

## Table of Contents

- [Why Inkwell](#why-inkwell)
- [Planning & Approach](#planning--approach)
- [Architecture Overview](#architecture-overview)
- [Features Implemented](#features-implemented)
- [Tech Stack Deep Dive](#tech-stack-deep-dive)
- [How Each Feature Was Built](#how-each-feature-was-built)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Future Roadmap](#future-roadmap)

---

## Why Inkwell

Writers deal with a recurring pain point: reference materials, research notes, and project briefs are scattered across tools, while generic AI assistants have no context about what's being written. This leads to:

- Generic, off-brand AI responses that don't match the writer's tone
- Manually copy-pasting context into every AI prompt
- Disconnected workflows between research and actual writing

Inkwell solves this by unifying everything into one environment — the editor, the references, and the AI — so the AI always knows what you're writing about and how you write.

---

## Planning & Approach

The project was planned using a Product Requirements Document (PRD) that defined the scope before any code was written. The planning process followed these steps:

### 1. Define the Problem and Value Proposition

Before building anything, the core user pain point was identified (scattered context, generic AI), and a clear tagline was chosen: *"Add your knowledge, let AI understand your context, and write with confidence."*

### 2. Map Out User Flows

Three primary flows were designed up front:

- **New user flow:** Landing → Sign up → Free trial popup → Dashboard
- **Returning user flow:** Landing → Sign in → Dashboard → Editor
- **Writing flow:** Create/open document → Add knowledge → Write → Chat with AI → Insert AI response → Auto-save

### 3. Choose the Tech Stack

Each technology was chosen for a specific reason:

| Decision | Choice | Reasoning |
|----------|--------|-----------|
| Frontend framework | React 19 + Vite 7 | Fast development, modern features, fast HMR |
| Backend | Convex | Real-time sync, built-in auth, serverless functions, zero backend boilerplate |
| Editor | TipTap | Extensible, headless, rich text with JSON storage |
| AI | OpenAI GPT-4o | Strong writing quality, good instruction following |
| Payments | Polar | Simple subscription billing, embeddable checkout |
| Styling | Tailwind CSS v4 | Utility-first, fast iteration, CSS variable theming |

### 4. Design the Data Model

Four core tables were defined in Convex:

- `documents` — user's documents with title/content
- `knowledge` — per-document reference entries
- `chatMessages` — per-document AI chat history
- `subscriptions` — user billing state

### 5. Build Incrementally

Features were built in a dependency-aware order:

1. Auth & protected routes
2. Document CRUD & dashboard
3. Rich text editor with auto-save
4. Knowledge base panel
5. AI chat integration
6. Subscription & billing
7. Landing page & polish

---

## Architecture Overview

```
┌────────────────────────────────────────────────────┐
│                    Frontend (React)                 │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐ │
│  │  Router   │  │  Auth    │  │  Convex Client   │ │
│  │ (RR v7)  │  │ Provider │  │  (useQuery, etc) │ │
│  └──────────┘  └──────────┘  └──────────────────┘ │
│                                                    │
│  Pages: Landing, Auth, Dashboard, Editor, Profile  │
│  Components: Editor, Toolbar, KnowledgePanel,      │
│              AIChatPanel, DocumentCard, Header      │
└─────────────────────┬──────────────────────────────┘
                      │ Real-time subscriptions
                      ▼
┌────────────────────────────────────────────────────┐
│                  Convex Backend                     │
│                                                    │
│  Queries:    documents.list, knowledge.list, ...   │
│  Mutations:  documents.create, chat.send, ...      │
│  Actions:    ai.generate (calls OpenAI)            │
│  HTTP:       /polar-webhook (Polar billing)        │
│                                                    │
│  Tables: documents, knowledge, chatMessages,       │
│          subscriptions, users (auth)               │
└────────────────────────┬───────────────────────────┘
                         │
              ┌──────────┴──────────┐
              ▼                     ▼
     ┌──────────────┐     ┌──────────────┐
     │   OpenAI API  │     │  Polar API   │
     │   (GPT-4o)    │     │  (Billing)   │
     └──────────────┘     └──────────────┘
```

The frontend communicates with Convex using real-time subscriptions (`useQuery`) for reads and mutations/actions for writes. There is no REST API layer — Convex handles everything with type-safe function calls. The AI action runs server-side on Convex and calls OpenAI directly, so the API key never touches the client.

---

## Features Implemented

### Authentication & User Management

- Email/password sign-up and sign-in via Convex Auth
- Protected routes that redirect unauthenticated users
- User profile page (editable display name, read-only email)
- Sign-out from the header dropdown

### Document Management

- Create new documents from the dashboard
- List all user documents with title previews and timestamps
- Open documents to navigate to the editor
- Delete documents with a confirmation dialog (cascades to knowledge entries and chat messages)

### Rich Text Editor

- TipTap-based editor with StarterKit extensions
- Formatting: bold, italic, strikethrough, headings (H1–H3), bullet/ordered lists, blockquotes, code blocks
- Undo/redo with full history
- Serif typography (Lora font) for a focused writing feel
- Placeholder text when the document is empty
- 1-second debounced auto-save that syncs in real time via Convex

### Knowledge Base

- Per-document knowledge panel (left sidebar)
- Add entries with a title and content (research notes, style guides, briefs)
- Remove entries
- All entries are automatically sent as context to the AI

### AI Co-Writer

- Chat interface in a right sidebar panel
- Context assembly: document content + all knowledge entries + optional selected text
- "Add to AI" bubble menu on text selection for focused context
- One-click "Insert into document" to paste AI responses at the cursor
- Chat history persisted per document
- GPT-4o with temperature 0.7 and 2048 max tokens

### Subscription & Billing

- Free trial popup shown after sign-up
- Polar-powered embedded checkout ($10/month)
- Webhook handling for `subscription.active` and `order.created` events
- Subscription states: `pending` → `active`
- "Skip for now" option to continue without subscribing

### Landing Page

- Marketing page with hero section, feature highlights, and CTAs
- "Try Inkwell free" routes to sign-up or dashboard based on auth state

---

## Tech Stack Deep Dive

### Frontend

| Technology | Version | Role |
|------------|---------|------|
| React | 19 | UI framework with latest features |
| TypeScript | 5.9 | Type safety across the entire stack |
| Vite | 7 | Dev server, HMR, and production builds |
| Tailwind CSS | 4 | Utility-first styling with CSS variable theming |
| React Router | 7 | Client-side routing |
| TipTap | 3.x | Headless rich text editor (StarterKit + Placeholder) |

### Backend

| Technology | Role |
|------------|------|
| Convex | Database, real-time subscriptions, serverless functions, auth |
| @convex-dev/auth | Password-based authentication with session management |
| OpenAI API | GPT-4o for AI writing assistance |
| Polar SDK | Subscription billing and checkout |

### Testing

| Technology | Role |
|------------|------|
| Vitest | Test runner |
| Testing Library | Component testing (React) |
| jsdom | Browser environment simulation |

---

## How Each Feature Was Built

### Authentication

Authentication uses `@convex-dev/auth` with a Password provider. On the backend, `convex/auth.ts` configures the auth system with a profile mapper that extracts `email` and `name` from sign-up params. The frontend wraps the app in `ConvexAuthProvider`, and pages use `useConvexAuth()` to check authentication state. A `ProtectedRoute` component guards dashboard, editor, and profile pages — it shows a loading state while auth is resolving and redirects to `/auth` if the user isn't authenticated.

### Document CRUD

Documents are stored in a `documents` table indexed by `userId`. The backend exposes five functions: `list` (query, filtered by user), `get` (query, single document), `create` (mutation, returns the new document ID), `update` (mutation, patches title/content and sets `updatedAt`), and `remove` (mutation, cascades deletes to related knowledge entries and chat messages). The `DashboardPage` uses `useQuery(api.documents.list)` for a real-time document list, and `DocumentCard` renders each document with a preview, timestamp, and delete button with a portal-based confirmation modal.

### Rich Text Editor

The editor is built on TipTap with `StarterKit` (paragraphs, headings, lists, blockquotes, code, bold, italic, strike, history) and the `Placeholder` extension. Content is stored as TipTap's JSON format in the `documents.content` field. The `Editor` component initializes TipTap with `useEditor`, registers an `onUpdate` callback that fires on every change, and debounces save calls to 1 second using `setTimeout`. A `BubbleMenu` appears on text selection with an "Add to AI" button that sends the selected text to the `AIChatPanel` as additional context. The `EditorToolbar` component reads the editor's active state (`editor.isActive('bold')`, etc.) to toggle button styles.

### Knowledge Base

Each document has its own set of knowledge entries stored in the `knowledge` table, indexed by `documentId`. The `KnowledgePanel` component (collapsible left sidebar) uses `useQuery(api.knowledge.list, { documentId })` and provides a form to add new entries (title + content). Entries can be removed individually. When the AI is invoked, all knowledge entries for the current document are included in the system prompt as reference context.

### AI Integration

The AI system works through a Convex action (`convex/ai.ts`) that runs server-side:

1. The `AIChatPanel` collects the current document content, all knowledge entries, and any selected text context.
2. It sends the user's message via `useMutation(api.chat.send)` to persist it.
3. It calls `useAction(api.ai.generate)` with the full context.
4. The action builds a system prompt that includes the document content, knowledge entries, and selected text, instructing the AI to match the document's tone and use references when relevant.
5. It calls the OpenAI API directly via `fetch` (POST to `https://api.openai.com/v1/chat/completions`) with model `gpt-4o`, temperature `0.7`, and max tokens `2048`.
6. The assistant's response is saved to `chatMessages` via an internal mutation and returned to the client.
7. The user can click "Insert into document" on any AI response, which calls `editor.chain().focus().command(...)` to insert the text at the cursor position.

### Subscription & Billing

After sign-up, a `FreeTrialPopup` modal appears offering a free trial. Clicking "Start free trial" calls `createPending` (creates a subscription record with status `pending`) and renders Polar's `PolarEmbedCheckout` component with a checkout link. When the user completes payment, Polar sends a webhook to the `/polar-webhook` endpoint defined in `convex/http.ts`. The `polarWebhook.ts` handler validates the webhook signature, checks for `subscription.active` or `order.created` events, extracts the customer email, and calls `activateByEmail` to set the subscription status to `active` with the Polar subscription ID.

### Styling & Theming

Tailwind CSS v4 is configured via the Vite plugin (`@tailwindcss/vite`). Custom design tokens are defined as CSS variables in `src/index.css` using Tailwind's `@theme` directive — primary color (coral/red), secondary shades, neutrals, and display colors. Three font families are used: Lora (serif, for the editor), Inter (sans-serif, for UI), and Shantell Sans (handwritten accents for branding). The overall design aesthetic is warm, clean, and minimal.

---

## Project Structure

```
inkwell/
├── convex/                         # Convex backend
│   ├── schema.ts                   # Database schema (documents, knowledge, chatMessages, subscriptions)
│   ├── auth.ts                     # Convex Auth setup with Password provider
│   ├── auth.config.ts              # Auth configuration (site URL, app ID)
│   ├── documents.ts                # Document CRUD (list, get, create, update, remove)
│   ├── knowledge.ts                # Knowledge entries (list, add, remove)
│   ├── chat.ts                     # Chat messages (list, send, sendInternal)
│   ├── ai.ts                       # OpenAI GPT-4o integration (generate action)
│   ├── users.ts                    # User profile (currentUser, updateProfile)
│   ├── subscriptions.ts            # Subscription management (getByUser, createPending, activateByEmail)
│   ├── polarWebhook.ts             # Polar webhook handler
│   └── http.ts                     # HTTP routes (auth endpoints + /polar-webhook)
│
├── src/
│   ├── main.tsx                    # App entry point, ConvexAuthProvider setup
│   ├── App.tsx                     # Route definitions (React Router v7)
│   ├── index.css                   # Global styles, Tailwind theme, CSS variables
│   │
│   ├── pages/
│   │   ├── LandingPage.tsx         # Marketing page with hero, features, CTAs
│   │   ├── AuthPage.tsx            # Sign in / sign up with free trial popup
│   │   ├── DashboardPage.tsx       # Document list and creation
│   │   ├── EditorPage.tsx          # Main editor with knowledge + AI panels
│   │   └── ProfilePage.tsx         # User profile management
│   │
│   ├── components/
│   │   ├── Editor.tsx              # TipTap editor with auto-save and bubble menu
│   │   ├── EditorToolbar.tsx       # Formatting toolbar (bold, italic, headings, etc.)
│   │   ├── KnowledgePanel.tsx      # Per-document knowledge sidebar
│   │   ├── AIChatPanel.tsx         # AI chat sidebar with insert-to-document
│   │   ├── DocumentCard.tsx        # Document card with delete confirmation
│   │   ├── Header.tsx              # App header with user dropdown
│   │   ├── ProtectedRoute.tsx      # Auth guard for protected pages
│   │   ├── FreeTrialPopup.tsx      # Post-signup trial modal with Polar checkout
│   │   └── ErrorBoundary.tsx       # React error boundary
│   │
│   ├── lib/
│   │   └── utils.ts                # Shared utilities
│   │
│   └── test/
│       └── setup.ts                # Vitest test setup
│
├── index.html                      # HTML entry point
├── package.json                    # Dependencies and scripts
├── vite.config.ts                  # Vite + Tailwind plugin config
├── tsconfig.json                   # TypeScript configuration
├── eslint.config.js                # ESLint configuration
└── prd.md                          # Product Requirements Document
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- A [Convex](https://convex.dev) account (free tier available)
- An [OpenAI](https://platform.openai.com) API key
- A [Polar](https://polar.sh) account (for billing — optional for local dev)

### Setup

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/inkwell.git
   cd inkwell
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Initialize Convex:**

   ```bash
   npx convex dev
   ```

   This will prompt you to log in, create a project, and generate the `convex/_generated` directory. It also sets `VITE_CONVEX_URL` in `.env.local`.

4. **Set environment variables** in the Convex dashboard (Settings → Environment Variables):

   ```
   OPENAI_API_KEY=sk-your-openai-api-key
   SITE_URL=http://localhost:5173
   ```

5. **Generate auth signing keys:**

   ```bash
   npx @convex-dev/auth
   ```

6. **Start the dev server** (in a separate terminal from `npx convex dev`):

   ```bash
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173)

### Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run dev:convex` | Start Convex dev server |
| `npm run build` | Type-check and build for production |
| `npm run test` | Run tests in watch mode |
| `npm run test:run` | Run tests once |
| `npm run lint` | Run ESLint |

---

## Environment Variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `VITE_CONVEX_URL` | `.env.local` (auto-generated) | Convex deployment URL for the frontend |
| `OPENAI_API_KEY` | Convex dashboard | OpenAI API key for AI generation |
| `SITE_URL` | Convex dashboard | Used by Convex Auth for callback URLs |
| `POLAR_WEBHOOK_SECRET` | Convex dashboard | Validates incoming Polar webhook signatures |
| `CONVEX_SITE_URL` | Convex dashboard | Convex HTTP endpoint URL |

---

## Future Roadmap

- **Document templates** — Pre-built starting points (blog post, research paper, business brief)
- **Real-time collaboration** — Multiple users editing the same document
- **Export** — PDF, Markdown, and DOCX export
- **Full-text search** — Search across all documents
- **Organization** — Folders, tags, and favorites
- **OAuth providers** — Google and GitHub sign-in
- **Usage tiers** — Free tier limits with multiple subscription plans

---

## License

This project is private. All rights reserved.
