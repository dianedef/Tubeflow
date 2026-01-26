# Doppler Configuration

## Overview

Doppler manages secrets for the tubeflow project. No .env files should be used.

## Project Setup

- **Project**: `tubeflow`
- **Config**: `dev`
- **Doppler CLI**: `/usr/bin/doppler`

## Environment Variables

| Variable                            | Purpose                 |
| ----------------------------------- | ----------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (web)        |
| `CLERK_SECRET_KEY`                  | Clerk auth (server)     |
| `NEXT_PUBLIC_CONVEX_URL`            | Convex backend (web)    |
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk auth (native)     |
| `EXPO_PUBLIC_CONVEX_URL`            | Convex backend (native) |
| `OPENROUTER_API_KEY`                | AI summaries (optional) |

## Usage

### Development (PM2)

The app runs via PM2. Update `ecosystem.config.cjs`:

```javascript
args: ["-c", "doppler run -- yarn dev"];
```

### Manual Commands

```bash
# Web app
cd apps/web && npm run dev

# Native app
cd apps/native && npm run dev

# Verify secrets
doppler run -- printenv | grep CLERK
```

## Managing Secrets

```bash
# Get value
doppler secrets get NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

# Set value
doppler secrets set KEY_NAME "value"
```

## Note

Turbo passes through env vars via `globalPassThroughEnv` in `turbo.json`.
