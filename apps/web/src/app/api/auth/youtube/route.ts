import { NextRequest, NextResponse } from "next/server";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
    : "http://localhost:3000/api/auth/youtube/callback";

// YouTube OAuth scope - full access for read/write operations
const YOUTUBE_SCOPE = "https://www.googleapis.com/auth/youtube";

/**
 * GET /api/auth/youtube
 * Initiates YouTube OAuth flow by redirecting to Google's OAuth consent screen
 */
export async function GET(request: NextRequest) {
  if (!GOOGLE_CLIENT_ID) {
    return NextResponse.json(
      { error: "Google Client ID not configured" },
      { status: 500 }
    );
  }

  // Generate state for CSRF protection
  const state = crypto.randomUUID();

  // Store state in a cookie for verification in callback
  const response = NextResponse.redirect(buildAuthUrl(state));
  response.cookies.set("youtube_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 10, // 10 minutes
    path: "/",
  });

  return response;
}

function buildAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: GOOGLE_CLIENT_ID!,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: YOUTUBE_SCOPE,
    access_type: "offline", // Required for refresh token
    prompt: "consent", // Force consent to get refresh token
    state,
  });

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}
