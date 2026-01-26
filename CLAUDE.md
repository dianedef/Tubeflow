# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TubeFlow is a fullstack TypeScript monorepo for a video note-taking application (evolving from a YouTube clone MVP). The app allows users to watch videos from URLs, take timestamped notes, and manage video playlists.

**Tech Stack:**
- **Monorepo:** Turborepo with Yarn workspaces
- **Frontend (Web):** Next.js 16 with App Router, React 19, Tailwind CSS v4, Clerk auth
- **Frontend (Native):** React Native with Expo 54 (currently less developed than web)
- **Backend:** Convex (real-time database, server functions, auth)
- **Video Playback:** react-player (web), expo-av planned (native)

**Key Features:**
- Video playback from URLs (YouTube, Vimeo, etc.)
- Timestamped note-taking during video watching
- User authentication via Clerk
- Real-time data sync via Convex subscriptions
- Planned: Playlists, comments, likes, AI summaries

## Development Commands

### Initial Setup

```bash
# Install dependencies (requires Node.js >=20.19.4)
yarn

# Set up Convex backend (first time only)
npm run setup --workspace packages/backend
```

**Important:** Before running setup, configure Clerk authentication:
1. Add `CLERK_JWT_ISSUER_DOMAIN` to Convex environment variables (from Clerk dashboard → JWT Templates → "convex")
2. Enable Google and Apple as Social Connection providers in Clerk
3. Optionally add `OPENAI_API_KEY` for AI summaries

### Running the Application

```bash
# Run web app only
npm run dev

# Or with Doppler for environment variables
doppler run -- npm run dev

# Run specific workspace
turbo run dev --filter=web-app
turbo run dev --filter=native-app
turbo run dev --filter=@packages/backend
```

### Build and Validation

```bash
# Build all workspaces
yarn build

# Type checking
yarn typecheck

# Format code
yarn format

# Lint (web app)
cd apps/web && npm run lint
```

### Convex Backend Operations

```bash
cd packages/backend

# Start dev server (watches for changes)
npm run dev

# Deploy to production
npx convex deploy

# View dashboard
npx convex dashboard
```

## Architecture

### Monorepo Structure

```
tubeflow/
├── apps/
│   ├── web/              # Next.js web application
│   └── native/           # React Native/Expo mobile app
└── packages/
    └── backend/          # Convex backend functions & schema
```

All workspaces share the `@packages/backend` package for end-to-end type safety between backend and frontend.

### Convex Backend (`packages/backend/convex/`)

**Core Concept:** Convex provides reactive queries, mutations, and actions with built-in real-time subscriptions.

**Database Schema** (`schema.ts`):
- `videos`: User videos with URL, title, description, views, likes
- `notes`: Timestamped notes linked to videos
- `channels`: User channel profiles
- `comments`: Video comments
- `likes`: Video like/dislike tracking
- Planned: `playlists` table

**Server Functions:**
- **Queries** (read-only, reactive): `getVideos`, `getNotes`, `getVideo`, `getYouTubeFeed`
- **Mutations** (write operations): `createNote`, `updateNote`, `deleteNote`, `updateVideoViews`, `addVideoToPlaylist`
- **Actions** (external API calls): OpenAI integration for AI summaries (optional)

**Authentication:**
- Configured in `auth.config.ts` via Clerk
- Use `getUserId(ctx)` helper from `utils.ts` to get authenticated user in queries/mutations
- All data access is scoped per user (no cross-user data leakage)

### Web App (`apps/web/`)

**Framework:** Next.js 16 with App Router

**Routing Structure:**
- `/` - Landing page
- `/videos` - Video feed (currently mock data)
- `/videos/create` - Add video by URL
- `/videos/[id]` - Video player + notes panel
- `/notes` - Legacy notes interface (being phased out)

**Key Components:**
- `VideoPlayer` (react-player wrapper): Controls, progress tracking, timestamp callbacks
- `NotesPanel`: Create/display/delete timestamped notes
- `Header`: Navigation with theme toggle
- `ui/*`: Radix UI components (avatar, dropdown, card, badge)

**Data Fetching Pattern:**
```tsx
import { useQuery, useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

// Reactive query (auto-updates)
const videos = useQuery(api.videos.getVideos);

// Mutation
const createNote = useMutation(api.notes.createNote);
await createNote({ videoId, content, timestamp });
```

**Styling:**
- Tailwind CSS v4 (CSS-first config in `@import "@tailwindcss/postcss"`
- CSS custom properties for theming (see `globals.css`)
- `next-themes` for dark mode toggle

### Native App (`apps/native/`)

**Status:** Basic structure exists but less developed than web app

**Structure:**
- `src/screens/`: React Native screens
- `src/navigation/`: React Navigation setup
- Entry point: `App.tsx`

**Key Libraries:**
- `@clerk/clerk-expo`: Authentication
- `@react-navigation/*`: Navigation
- Planned: expo-av for video playback

## Environment Variables

Configure via `.env.local` or Doppler:

**Web & Native (frontend):**
- `NEXT_PUBLIC_CONVEX_URL` / `EXPO_PUBLIC_CONVEX_URL`: Convex deployment URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` / `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk public key
- `CLERK_SECRET_KEY`: Clerk secret (server-side only)

**Backend (Convex dashboard):**
- `CLERK_JWT_ISSUER_DOMAIN`: Clerk JWT issuer for auth validation
- `OPENAI_API_KEY`: Optional for AI summaries

**Note:** Turbo passes through these vars via `globalPassThroughEnv` in `turbo.json`

## Key Development Patterns

### Adding a New Convex Function

1. Define in `packages/backend/convex/*.ts`:
```ts
export const myQuery = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;
    return await ctx.db.get(args.id);
  },
});
```

2. Convex auto-generates typed API at `_generated/api`
3. Use in frontend: `useQuery(api.filename.myQuery, { id })`

### Adding a New Route (Next.js App Router)

1. Create directory in `apps/web/src/app/[route-name]/`
2. Add `page.tsx` with `"use client"` directive if using React hooks
3. Import components from `@/components/`
4. Fetch data with `useQuery` from Convex

### Working with Real-time Data

All Convex queries are reactive by default:
```tsx
const notes = useQuery(api.notes.getNotes, { videoId });
// Component re-renders automatically when notes change
```

### Authentication Check Pattern

In Convex functions:
```ts
const userId = await getUserId(ctx);
if (!userId) throw new Error("Unauthorized");
```

In React components (web):
```tsx
import { useUser } from "@clerk/nextjs";
const { user } = useUser();
```

## Deployment

**Web (Vercel recommended):**
```bash
cd apps/web
# Build command (includes Convex deploy):
cd ../../packages/backend && npx convex deploy --cmd 'cd ../../apps/web && turbo run build' --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL
```

See `apps/web/vercel.json` for Vercel configuration.

**Native (Expo):**
```bash
cd apps/native
npx expo build
```

## Current State & Roadmap

**Implemented:**
- ✅ Video player with react-player
- ✅ Timestamped notes (create, display, delete)
- ✅ User authentication (Clerk)
- ✅ Basic video feed (mock data)
- ✅ Real-time database with Convex

**In Progress (see ROADMAP.md):**
- YouTube API integration for real video fetching
- Playlist management
- Comments & likes system
- Native app feature parity
- Click timestamp to seek video
- AI-powered video summaries (OpenAI)

**Architecture Notes:**
- Originally designed as YouTube clone, now pivoting to video note-taking app
- Some legacy code remains in `/notes` routes (being migrated to `/videos`)
- Convex schema includes channels/comments/likes tables for future YouTube-like features
- Environment variables use both NEXT_PUBLIC_* and EXPO_PUBLIC_* prefixes for cross-platform support
