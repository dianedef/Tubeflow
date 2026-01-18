import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@packages/backend/convex/_generated/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const youtubeApi = (api as any).youtube as Record<string, any> | undefined;

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;
const REDIRECT_URI =
  process.env.NODE_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/youtube/callback`
    : "http://localhost:3000/api/auth/youtube/callback";

/**
 * GET /api/auth/youtube/callback
 * Handles the OAuth callback from Google, exchanges code for tokens,
 * and saves them to Convex
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  // Handle errors from Google
  if (error) {
    console.error("OAuth error:", error);
    return redirectWithError("Google OAuth was denied or failed");
  }

  // Verify required params
  if (!code || !state) {
    return redirectWithError("Missing authorization code or state");
  }

  // Verify state matches (CSRF protection)
  const storedState = request.cookies.get("youtube_oauth_state")?.value;
  if (state !== storedState) {
    return redirectWithError("Invalid state parameter");
  }

  // Verify user is authenticated with Clerk
  const { userId, getToken } = await auth();
  if (!userId) {
    return redirectWithError("User not authenticated");
  }

  try {
    // Exchange authorization code for tokens
    const tokens = await exchangeCodeForTokens(code);

    // Get Clerk token for Convex authentication
    const convexToken = await getToken({ template: "convex" });
    if (!convexToken) {
      return redirectWithError("Could not get Convex authentication token");
    }

    // Save tokens to Convex
    const convex = new ConvexHttpClient(CONVEX_URL);
    convex.setAuth(convexToken);

    await convex.mutation(youtubeApi!.saveYoutubeTokens, {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      expiresIn: tokens.expires_in,
    });

    // Clear the state cookie and redirect to success page
    const response = NextResponse.redirect(
      new URL("/playlists?youtube_connected=true", request.url)
    );
    response.cookies.delete("youtube_oauth_state");

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return redirectWithError("Failed to complete YouTube authorization");
  }
}

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

async function exchangeCodeForTokens(code: string): Promise<TokenResponse> {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google OAuth credentials not configured");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error("Token exchange error:", error);
    throw new Error("Failed to exchange authorization code for tokens");
  }

  return response.json();
}

function redirectWithError(message: string): NextResponse {
  const errorUrl = new URL("/playlists", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  errorUrl.searchParams.set("youtube_error", message);
  return NextResponse.redirect(errorUrl);
}
