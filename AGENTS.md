# AGENTS GUIDE

## Overview

- Monorepo managed by Turborepo (`turbo.json`) with Yarn workspaces (`apps/*`, `packages/*`).
- Apps: `apps/web` (Next.js 16, React 19, Tailwind), `apps/native` (Expo/React Native 0.82), backend: `packages/backend` (Convex functions + OpenAI). All TypeScript.
- Node >= 20.19.4, yarn@1.22.22 (see root package.json).

## Installation & Tooling

- Install deps once at repo root: `yarn` (or `npm install` respecting yarn@1.22.22).
- Root scripts (run at repo root):
  - `npm run dev` → `turbo run dev` (runs workspace dev tasks; turbo UI enabled by default via `turbo.json`).
  - `npm run build` → `turbo run build`.
  - `npm run typecheck` → `turbo run typecheck`.
  - `npm run clean` → `turbo run clean` then removes root `node_modules`.
  - `npm run format` → Prettier on `**/*.{ts,tsx,js,jsx,json,md}` honoring `.gitignore`.
- Turbo caches builds; `dev` is marked `persistent` and `cache: false`. UI can be disabled by removing `"ui": "tui"` in `turbo.json` (see root README note).

## Workspace Commands

- Web (`apps/web`):
  - `npm run dev` / `next dev`
  - `npm run build` / `next build`
  - `npm run start` / `next start`
  - `npm run lint` / `next lint`
  - `npm run typecheck` / `tsc --noEmit`
- Native (`apps/native`):
  - `npm run dev` / `expo start`
  - `npm run android` / `expo start --android`
  - `npm run ios` / `expo start --ios`
  - `npm run web` / `expo start --web`
  - `npm run typecheck` / `tsc --noEmit`
- Backend (`packages/backend`):
  - `npm run dev` / `convex dev`
  - `npm run setup` / `convex dev --until-success` (login + waits for required env vars)
  - `npm run typecheck` / `tsc --noEmit -p convex`

## Environment & Secrets

- Follow root README steps:
  - Run `npm run setup --workspace packages/backend` to initialize Convex; requires Convex CLI auth.
  - Configure Convex env vars via dashboard before deployment completes.
  - Clerk issuer URL must be set in Convex env vars per README links.
  - Optional `OPENROUTER_API_KEY` for summaries (Convex action uses it).
- App envs: create `.env.local` in `apps/web` and `apps/native` from `.example.env` templates.
  - Use `CONVEX_URL` from `packages/backend/.env.local` for `{NEXT,EXPO}_PUBLIC_CONVEX_URL`.
  - Clerk publishable/secret keys needed for both apps.
- Backend Convex functions also read `CONVEX_CLOUD_URL` (for diagnostic messaging) and `OPENAI_API_KEY` (for summaries).

## Code Structure & Patterns

- Web (Next.js App Router): `apps/web/src/app` holds layouts/pages; components under `components/` with subfolders (`home`, `notes`, `common`). Utility `cn` in `src/lib/utils.ts` wraps `clsx` + `tailwind-merge`.
- Styling: Tailwind CSS v4 (per dependencies) with global styles in `src/app/globals.css`.
- Native: entry `index.tsx` → `App.tsx`; `ConvexClientProvider.tsx` wraps `ConvexReactClient` with Clerk (`ConvexProviderWithClerk`, `ClerkProvider`). Fonts loaded in `App.tsx`; ignores React Native warnings.
- Backend (Convex):
  - Schema (`convex/schema.ts`): `notes` table with `userId`, `title`, `content`, optional `summary`.
  - Functions (`convex/notes.ts`): queries `getNotes`, `getNote`; mutations `createNote` (optionally schedules summary), `deleteNote`; uses `getUserId` helper (Clerk auth via `ctx.auth`).
  - Actions (`convex/openai.ts`): `summary` internalAction calls OpenAI chat (`gpt-4-1106-preview`) with JSON response; handles missing API key by storing error text via `saveSummary` internalMutation. `openaiKeySet` query reports key presence. Helper `missingEnvVariableUrl` formats guidance.

## Testing & Quality

- Web: lint (`next lint`), typecheck (`tsc --noEmit`). No unit tests observed.
- Native: typecheck via `tsc --noEmit`. Jest/jest-expo dependencies present but no scripts/tests configured beyond typecheck.
- Backend: typecheck via `tsc --noEmit -p convex`. No tests present.
- Formatting: Prettier via root `npm run format` (respecting `.gitignore`).

## Running & Deployment Notes

- Dev all: `npm run dev` at root runs turbo dev across workspaces (TUI shows logs per task).
- Web only: `cd apps/web && npm run dev`.
- Native only: `cd apps/native && npm run dev` (Expo QR / platform flags as needed).
- Backend only: `cd packages/backend && npm run dev` (Convex local dev server).
- Deployment example (from root README for Vercel+Convex): `cd ../../packages/backend && npx convex deploy --cmd 'cd ../../apps/web && turbo run build' --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL`.

## Gotchas

- Must use Node >= 20.19.4; Yarn v1 workspace tooling expected.
- Ensure Convex, Clerk, and (optionally) OpenRouter env vars are set before running backend `setup`/deploy; missing `OPENROUTER_API_KEY` will store an error string in summaries.
- Turbo dev uses TUI by default; remove `"ui": "tui"` in `turbo.json` if consolidated logs preferred.
- `createNote` scheduler enqueues summaries only when `isSummary` flag is true.
- Fonts for native app loaded from `apps/native/src/assets/fonts`; running without bundling those will fail font load.
