# Developer Snippet Vault & AI Publisher

A modern, production-grade snippet management application built with Next.js 14 App Router, TypeScript, Supabase, and Google Gemini AI.

---

## Overview

**Developer Snippet Vault & AI Publisher** allows authenticated software engineers to organize and manage reusable code snippets securely. By integrating the Google Gemini API, every snippet is automatically analyzed upon creation and modification to produce 3 to 5 relevant lowercase tags and a concise, single-sentence plain-English summary.

Key capabilities:
- **Create Snippets:** Save multi-language code snippets with automated Gemini AI metadata generation.
- **Edit Snippets:** Update snippet titles, language classifications, or code bodies with smart change detection.
- **Delete Snippets:** Safely delete snippets with verification dialogs and server-side cascade isolation.
- **Search Snippets:** Search through snippet titles and code contents in real time.
- **Filter by Language:** Filter by programming languages (JavaScript, TypeScript, Python, Go, Rust, SQL, and more).
- **Sort Snippets:** Sort by newest, oldest, or recently updated.
- **Copy Code:** One-click clipboard copy with visual confirmation.
- **Automated AI Tags:** 3 to 5 relevant tags generated via structured JSON schemas (`@google/genai`).
- **Automated AI Summaries:** Exactly one plain-English summary sentence explaining code functionality without hallucinating features.
- **Regenerate AI Metadata:** Manual on-demand AI regeneration with ownership verification and real-time status feedback.

---

## Features

- **End-to-End Authentication:** Supabase Auth cookie-based session management (`@supabase/ssr`) with automatic session refresh middleware.
- **PostgreSQL Row Level Security (RLS):** Strict isolation ensuring users can only read, write, edit, and delete their own code snippets.
- **Server Actions Architecture:** Secure Next.js Server Actions with server-derived user sessions (`supabase.auth.getUser()`).
- **Gemini AI Structured Output:** Powered by the official `@google/genai` Node.js SDK using stable Gemini 3.7 Flash with multi-model fallback (`gemini-3.7-flash` -> `gemini-3.6-flash` -> `gemini-3.5-flash-lite`).
- **Non-Blocking AI Resiliency:** Snippet CRUD operations never fail if the AI service experiences rate limiting or outages. Fallback tags and summaries are handled gracefully.
- **Clean UI & Responsive Experience:** Dark-themed UI crafted with Tailwind CSS, Lucide icons, skeleton loading states, and contextual not-found pages.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict mode)
- **Styling:** Tailwind CSS & responsive utilities
- **Database:** Supabase PostgreSQL
- **Security:** PostgreSQL Row Level Security (RLS)
- **Authentication:** Supabase Auth via `@supabase/ssr`
- **AI Engine:** Google Gemini API via official `@google/genai` SDK
- **Deployment Target:** Vercel

---

## Project Structure

```text
├── app/
│   ├── dashboard/
│   │   ├── snippets/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/page.tsx     # Snippet editor with change detection
│   │   │   │   ├── loading.tsx       # Snippet details skeleton loading
│   │   │   │   ├── not-found.tsx     # Contextual 404 for missing/forbidden snippets
│   │   │   │   └── page.tsx          # Snippet view with AI insights card
│   │   │   └── new/page.tsx          # Snippet creation form
│   │   ├── loading.tsx               # Dashboard skeleton loader
│   │   └── page.tsx                  # Dashboard with search, filter, and vault grid
│   ├── login/page.tsx                # Secure sign-in page
│   ├── register/page.tsx             # New developer registration page
│   ├── error.tsx                     # Global error boundary
│   ├── layout.tsx                    # Root layout with metadata and providers
│   ├── loading.tsx                   # Root loading state
│   ├── not-found.tsx                 # Global 404 handler
│   └── page.tsx                      # Landing page with interactive code preview
├── components/
│   ├── snippets/
│   │   ├── ai-metadata-card.tsx      # AI summary, tags, and Regenerate AI action
│   │   ├── code-viewer.tsx           # Formatted code view with copy button
│   │   ├── copy-code-button.tsx      # Clipboard copy utility
│   │   ├── delete-snippet-dialog.tsx # Secure delete confirmation dialog
│   │   ├── snippet-card.tsx          # Dashboard snippet preview card
│   │   ├── snippet-form.tsx          # Create/edit snippet form
│   │   ├── snippet-list.tsx          # Snippet grid and empty states
│   │   └── snippet-search.tsx        # Search, filter, and sorting controls
│   ├── ui/                           # Reusable UI primitives (Button, Card, Badge)
│   ├── footer.tsx                    # Site footer
│   └── navbar.tsx                    # Responsive navigation header
├── lib/
│   ├── actions/
│   │   └── snippets.ts               # Server actions (create, update, delete, regenerate)
│   ├── ai/
│   │   └── gemini.ts                 # Server-only Gemini AI service
│   ├── constants/
│   │   └── languages.ts              # Supported programming languages and color styles
│   ├── supabase/
│   │   ├── client.ts                 # Browser Supabase client
│   │   ├── middleware.ts             # Session refresh and route protection
│   │   └── server.ts                 # Server component / server action Supabase client
│   └── utils.ts                      # General helper utilities
├── supabase/
│   └── migrations/
│       ├── 001_initial_schema.sql    # Profiles, snippets, RLS policies, triggers
│       └── 002_gemini_ai.sql         # Migration adding tags (text[]) and summary (text)
├── .env.example                      # Template for environment variables
└── README.md                         # Documentation
```

---

## Environment Variables

Configure the following variables in your `.env.local` file for local development, and in your Vercel Project Settings for production.

```env
# Next.js Public Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase Auth & PostgreSQL Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key

# Google Gemini AI Integration (Server-Side ONLY)
GEMINI_API_KEY=your_gemini_api_key
```

> [!CAUTION]
> Never prefix `GEMINI_API_KEY` with `NEXT_PUBLIC_`. The Gemini API key must always remain exclusively on the server to prevent exposure in client browser bundles.

---

## Supabase Setup

Follow these steps to configure your Supabase backend:

1. **Create Supabase Project:**
   Create a new project at [supabase.com](https://supabase.com).

2. **Configure Environment Variables:**
   Copy your Project URL and Publishable Key from **Project Settings > API** into `.env.local`.

3. **Run Migration 001:**
   In the Supabase SQL Editor, run `supabase/migrations/001_initial_schema.sql` to create:
   - `profiles` table with automatic user profile creation trigger.
   - `snippets` table with timestamps and updated_at triggers.
   - Row Level Security (RLS) policies enforcing ownership isolation for all CRUD operations.

4. **Run Migration 002:**
   Run `supabase/migrations/002_gemini_ai.sql` to add:
   - `tags` column (`text[] NOT NULL DEFAULT '{}'`).
   - `summary` column (`text`).
   - GIN index on `tags` for high-performance array querying.

5. **Verify Row Level Security:**
   Confirm that RLS is enabled for both `profiles` and `snippets` tables under **Authentication > Policies**.

---

## Gemini Setup

1. Visit [Google AI Studio](https://aistudio.google.com/) and sign in with your Google account.
2. Click **Get API key** and generate a new key for your project.
3. Add the key to `.env.local` as `GEMINI_API_KEY=AIzaSy...`.
4. The service automatically utilizes `gemini-3.7-flash` as primary, with seamless fallback to `gemini-3.6-flash` and `gemini-3.5-flash-lite`.

---

## Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and GEMINI_API_KEY
```

### 3. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Verification

Before deploying, run linting and type checking:

```bash
# Run ESLint quality checks
npm run lint

# Run Next.js production build
npm run build
```

---

## Deployment to Vercel

1. Push your repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com), select **Add New > Project** and import your repository.
3. Set the Root Directory if your project is in a nested directory.
4. Add the required Environment Variables in the Vercel project configuration:
   - `NEXT_PUBLIC_APP_URL` (e.g. `https://your-domain.vercel.app`)
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `GEMINI_API_KEY`
5. Click **Deploy**. Vercel will build and serve the application globally.
