# Inkwell - AI Document Editor

A clean, minimal document editor that uses AI to help you write, with the ability to add knowledge context that informs the AI's suggestions.

## Features

- **Rich Text Editing** - Beautiful serif-font editor with formatting tools (bold, italic, headings, lists, blockquotes)
- **Knowledge Context** - Add reference materials that the AI uses when helping you write
- **AI Co-writer** - Chat with an AI assistant that understands your document and references
- **Auto-save** - Documents save automatically as you type
- **Real-time** - All data syncs in real-time via Convex

## Tech Stack

- React + TypeScript (Vite)
- Tailwind CSS v4
- TipTap (rich text editor)
- Convex (backend, database, auth)
- OpenAI GPT-4o

## Getting Started

### Prerequisites

- Node.js >= 18
- A Convex account (free at [convex.dev](https://convex.dev))
- An OpenAI API key

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Convex:**
   ```bash
   npx convex dev
   ```
   This will prompt you to log in and create a new project. It will also generate the `convex/_generated` directory.

3. **Set environment variables:**

   In your Convex dashboard (Settings > Environment Variables), add:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key
   ```

   The `npx convex dev` command will automatically set `VITE_CONVEX_URL` in your `.env.local` file.

4. **Configure Convex Auth:**

   In the Convex dashboard, set the environment variable:
   ```
   SITE_URL=http://localhost:5173
   ```

   Generate and set the JWT signing key:
   ```bash
   npx @convex-dev/auth
   ```

5. **Start the dev server:**
   ```bash
   npm run dev
   ```

6. Open [http://localhost:5173](http://localhost:5173)

## Project Structure

```
convex/           # Backend functions and schema
  schema.ts       # Database schema
  auth.ts         # Authentication config
  documents.ts    # Document CRUD
  knowledge.ts    # Knowledge entries CRUD
  chat.ts         # Chat message storage
  ai.ts           # OpenAI integration

src/
  pages/          # Page components
  components/     # Reusable UI components
  lib/            # Utilities
```
