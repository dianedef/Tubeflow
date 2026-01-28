# Tasks

## Pre-Production Checklist

- [ ] **Google OAuth: Add production redirect URI**
  In [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials → OAuth 2.0 Client (`157293832212-...sijbj6`), add the production redirect URI:
  ```
  https://<YOUR_DOMAIN>/api/auth/youtube/callback
  ```
  Also set the `NEXT_PUBLIC_APP_URL` environment variable to your production domain (used by `apps/web/src/app/api/auth/youtube/route.ts` to construct the redirect URI).
