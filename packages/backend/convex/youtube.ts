import { v } from "convex/values";
import { mutation, query, action, internalMutation, internalQuery, internalAction } from "./_generated/server";
import { getUserId } from "./utils";
import { internal, api } from "./_generated/api";

// Cache TTL in milliseconds (10 minutes)
const CACHE_TTL = 10 * 60 * 1000;

// =============================================================================
// QUERIES
// =============================================================================

/**
 * Check if the current user has YouTube connected
 */
export const getYoutubeConnectionStatus = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return { connected: false };

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) return { connected: false };

    return {
      connected: user.youtubeConnected ?? false,
      hasTokens: !!(user.youtubeAccessToken && user.youtubeRefreshToken),
    };
  },
});

/**
 * Get YouTube playlists from cache
 */
export const getYoutubePlaylists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const playlists = await ctx.db
      .query("youtubePlaylistsCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return playlists.map((p) => ({
      id: p.youtubePlaylistId,
      title: p.title,
      description: p.description,
      thumbnailUrl: p.thumbnailUrl,
      videoCount: p.videoCount,
      privacyStatus: p.privacyStatus,
      publishedAt: p.publishedAt,
      cachedAt: p.cachedAt,
      isStale: Date.now() - p.cachedAt > CACHE_TTL,
    }));
  },
});

/**
 * Get videos for a specific YouTube playlist from cache
 */
export const getPlaylistVideos = query({
  args: { playlistId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const videos = await ctx.db
      .query("youtubeVideosCache")
      .withIndex("by_user_and_playlist", (q) =>
        q.eq("userId", userId).eq("youtubePlaylistId", args.playlistId)
      )
      .collect();

    return videos
      .sort((a, b) => a.position - b.position)
      .map((v) => ({
        id: v.youtubeVideoId,
        playlistItemId: v.playlistItemId,
        title: v.title,
        description: v.description,
        thumbnailUrl: v.thumbnailUrl,
        channelTitle: v.channelTitle,
        duration: v.duration,
        position: v.position,
        publishedAt: v.publishedAt,
        cachedAt: v.cachedAt,
        isStale: Date.now() - v.cachedAt > CACHE_TTL,
      }));
  },
});

/**
 * Get a single playlist by ID from cache
 */
export const getPlaylistById = query({
  args: { playlistId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const playlist = await ctx.db
      .query("youtubePlaylistsCache")
      .withIndex("by_user_and_youtube_id", (q) =>
        q.eq("userId", userId).eq("youtubePlaylistId", args.playlistId)
      )
      .first();

    if (!playlist) return null;

    return {
      id: playlist.youtubePlaylistId,
      title: playlist.title,
      description: playlist.description,
      thumbnailUrl: playlist.thumbnailUrl,
      videoCount: playlist.videoCount,
      privacyStatus: playlist.privacyStatus,
      publishedAt: playlist.publishedAt,
      cachedAt: playlist.cachedAt,
      isStale: Date.now() - playlist.cachedAt > CACHE_TTL,
    };
  },
});

/**
 * Get all videos from all playlists for the current user
 */
export const getAllVideos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const videos = await ctx.db
      .query("youtubeVideosCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    // Remove duplicates (same video in multiple playlists)
    const uniqueVideos = new Map<string, typeof videos[0]>();
    for (const video of videos) {
      if (!uniqueVideos.has(video.youtubeVideoId)) {
        uniqueVideos.set(video.youtubeVideoId, video);
      }
    }

    return Array.from(uniqueVideos.values()).map((v) => ({
      id: v.youtubeVideoId,
      playlistId: v.youtubePlaylistId,
      title: v.title,
      description: v.description,
      thumbnailUrl: v.thumbnailUrl,
      channelTitle: v.channelTitle,
      duration: v.duration,
      publishedAt: v.publishedAt,
      cachedAt: v.cachedAt,
    }));
  },
});

// =============================================================================
// MUTATIONS
// =============================================================================

/**
 * Save YouTube OAuth tokens after successful authentication
 */
export const saveYoutubeTokens = mutation({
  args: {
    accessToken: v.string(),
    refreshToken: v.string(),
    expiresIn: v.number(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      youtubeAccessToken: args.accessToken,
      youtubeRefreshToken: args.refreshToken,
      youtubeTokenExpiry: Date.now() + args.expiresIn * 1000,
      youtubeConnected: true,
      updatedAt: Date.now(),
    });
  },
});

/**
 * Disconnect YouTube (remove tokens and clear cache)
 */
export const disconnectYoutube = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    // Remove tokens
    await ctx.db.patch(user._id, {
      youtubeAccessToken: undefined,
      youtubeRefreshToken: undefined,
      youtubeTokenExpiry: undefined,
      youtubeConnected: false,
      updatedAt: Date.now(),
    });

    // Clear playlists cache
    const playlists = await ctx.db
      .query("youtubePlaylistsCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const playlist of playlists) {
      await ctx.db.delete(playlist._id);
    }

    // Clear videos cache
    const videos = await ctx.db
      .query("youtubeVideosCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    for (const video of videos) {
      await ctx.db.delete(video._id);
    }
  },
});

/**
 * Update playlists cache with fresh data from YouTube API
 */
export const updatePlaylistsCache = mutation({
  args: {
    playlists: v.array(
      v.object({
        youtubePlaylistId: v.string(),
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        videoCount: v.number(),
        privacyStatus: v.string(),
        publishedAt: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const now = Date.now();

    // Get existing playlists
    const existingPlaylists = await ctx.db
      .query("youtubePlaylistsCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const existingMap = new Map(
      existingPlaylists.map((p) => [p.youtubePlaylistId, p])
    );

    // Update or insert playlists
    for (const playlist of args.playlists) {
      const existing = existingMap.get(playlist.youtubePlaylistId);

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...playlist,
          cachedAt: now,
        });
        existingMap.delete(playlist.youtubePlaylistId);
      } else {
        await ctx.db.insert("youtubePlaylistsCache", {
          userId,
          ...playlist,
          cachedAt: now,
        });
      }
    }

    // Delete playlists that no longer exist on YouTube
    for (const playlist of Array.from(existingMap.values())) {
      await ctx.db.delete(playlist._id);
    }
  },
});

/**
 * Update videos cache for a specific playlist
 */
export const updateVideosCache = mutation({
  args: {
    playlistId: v.string(),
    videos: v.array(
      v.object({
        youtubeVideoId: v.string(),
        playlistItemId: v.optional(v.string()),
        title: v.string(),
        description: v.optional(v.string()),
        thumbnailUrl: v.optional(v.string()),
        channelTitle: v.string(),
        duration: v.optional(v.string()),
        position: v.number(),
        publishedAt: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const now = Date.now();

    // Get existing videos for this playlist
    const existingVideos = await ctx.db
      .query("youtubeVideosCache")
      .withIndex("by_user_and_playlist", (q) =>
        q.eq("userId", userId).eq("youtubePlaylistId", args.playlistId)
      )
      .collect();

    const existingMap = new Map(
      existingVideos.map((v) => [v.youtubeVideoId, v])
    );

    // Update or insert videos
    for (const video of args.videos) {
      const existing = existingMap.get(video.youtubeVideoId);

      if (existing) {
        await ctx.db.patch(existing._id, {
          ...video,
          youtubePlaylistId: args.playlistId,
          cachedAt: now,
        });
        existingMap.delete(video.youtubeVideoId);
      } else {
        await ctx.db.insert("youtubeVideosCache", {
          userId,
          youtubePlaylistId: args.playlistId,
          ...video,
          cachedAt: now,
        });
      }
    }

    // Delete videos that no longer exist in the playlist
    for (const video of Array.from(existingMap.values())) {
      await ctx.db.delete(video._id);
    }
  },
});

/**
 * Internal mutation to update tokens after refresh
 */
export const updateYoutubeTokens = internalMutation({
  args: {
    userId: v.string(),
    accessToken: v.string(),
    expiresIn: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      youtubeAccessToken: args.accessToken,
      youtubeTokenExpiry: Date.now() + args.expiresIn * 1000,
      updatedAt: Date.now(),
    });
  },
});

// =============================================================================
// ACTIONS (External API calls)
// =============================================================================

/**
 * Get user's YouTube tokens (for use in actions)
 */
async function getYoutubeTokens(ctx: any, userId: string) {
  const user = await ctx.runQuery(internal.youtube.getUserTokens, { userId });
  return user;
}

/**
 * Internal query to get user tokens for actions
 */
export const getUserTokens = internalQuery({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.userId))
      .first();

    if (!user) return null;

    return {
      accessToken: user.youtubeAccessToken,
      refreshToken: user.youtubeRefreshToken,
      tokenExpiry: user.youtubeTokenExpiry,
    };
  },
});

/**
 * Refresh YouTube access token using refresh token
 */
export const refreshYoutubeToken = action({
  args: {},
  handler: async (ctx): Promise<string | null> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const tokens = await ctx.runQuery(internal.youtube.getUserTokens, { userId });

    if (!tokens?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const clientId = process.env.GOOGLE_CLIENT_ID || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error("Missing Google OAuth credentials:", { 
        hasClientId: !!clientId, 
        hasClientSecret: !!clientSecret,
        clientIdSource: process.env.GOOGLE_CLIENT_ID ? "GOOGLE_CLIENT_ID" : (process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? "NEXT_PUBLIC_GOOGLE_CLIENT_ID" : "none")
      });
      throw new Error("Google OAuth credentials not configured");
    }

    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: tokens.refreshToken,
        grant_type: "refresh_token",
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Token refresh failed:", error);
      throw new Error("Failed to refresh token");
    }

    const data = await response.json();

    // Update tokens in database
    await ctx.runMutation(internal.youtube.updateYoutubeTokens, {
      userId,
      accessToken: data.access_token,
      expiresIn: data.expires_in,
    });

    return data.access_token;
  },
});

/**
 * Helper to get valid access token (refreshes if expired)
 */
async function getValidAccessToken(ctx: any, userId: string): Promise<string> {
  const tokens = await ctx.runQuery(internal.youtube.getUserTokens, { userId });

  if (!tokens?.accessToken) {
    throw new Error("YouTube not connected");
  }

  // Check if token is expired or will expire soon (within 5 minutes)
  if (tokens.tokenExpiry && tokens.tokenExpiry < Date.now() + 5 * 60 * 1000) {
    const newToken = await ctx.runAction(api.youtube.refreshYoutubeToken, {});
    if (!newToken) throw new Error("Failed to refresh token");
    return newToken;
  }

  return tokens.accessToken;
}

/**
 * Fetch user's YouTube playlists from API
 */
export const fetchYoutubePlaylists = action({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?" +
        new URLSearchParams({
          part: "snippet,contentDetails,status",
          mine: "true",
          maxResults: "50",
        }),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to fetch playlists");
    }

    const data = await response.json();

    const playlists = (data.items || []).map((item: any) => ({
      youtubePlaylistId: item.id,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url,
      videoCount: item.contentDetails?.itemCount || 0,
      privacyStatus: item.status?.privacyStatus || "private",
      publishedAt: item.snippet.publishedAt,
    }));

    // Update cache
    await ctx.runMutation(api.youtube.updatePlaylistsCache, { playlists });

    return playlists;
  },
});

/**
 * Fetch videos for a specific playlist from YouTube API
 */
export const fetchPlaylistItems = action({
  args: { playlistId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    // Fetch playlist items
    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?" +
        new URLSearchParams({
          part: "snippet,contentDetails",
          playlistId: args.playlistId,
          maxResults: "50",
        }),
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to fetch playlist items");
    }

    const data = await response.json();

    // Get video IDs for duration lookup
    const videoIds = (data.items || [])
      .map((item: any) => item.contentDetails?.videoId)
      .filter(Boolean)
      .join(",");

    // Fetch video details for duration
    let durations: Record<string, string> = {};
    if (videoIds) {
      const videosResponse = await fetch(
        "https://www.googleapis.com/youtube/v3/videos?" +
          new URLSearchParams({
            part: "contentDetails",
            id: videoIds,
          }),
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (videosResponse.ok) {
        const videosData = await videosResponse.json();
        durations = (videosData.items || []).reduce(
          (acc: Record<string, string>, item: any) => {
            acc[item.id] = parseDuration(item.contentDetails?.duration);
            return acc;
          },
          {}
        );
      }
    }

    const videos = (data.items || []).map((item: any, index: number) => ({
      youtubeVideoId: item.contentDetails?.videoId,
      playlistItemId: item.id,
      title: item.snippet.title,
      description: item.snippet.description || "",
      thumbnailUrl:
        item.snippet.thumbnails?.high?.url ||
        item.snippet.thumbnails?.medium?.url ||
        item.snippet.thumbnails?.default?.url,
      channelTitle: item.snippet.videoOwnerChannelTitle || "",
      duration: durations[item.contentDetails?.videoId] || "",
      position: item.snippet.position ?? index,
      publishedAt: item.snippet.publishedAt,
    }));

    // Update cache
    await ctx.runMutation(api.youtube.updateVideosCache, {
      playlistId: args.playlistId,
      videos,
    });

    return videos;
  },
});

/**
 * Create a new YouTube playlist
 */
export const createYoutubePlaylist = action({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    privacyStatus: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlists?part=snippet,status",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            title: args.title,
            description: args.description || "",
          },
          status: {
            privacyStatus: args.privacyStatus || "private",
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to create playlist");
    }

    const data = await response.json();

    // Refresh playlists cache
    await ctx.runAction(api.youtube.fetchYoutubePlaylists, {});

    return {
      id: data.id,
      title: data.snippet.title,
    };
  },
});

/**
 * Add a video to a YouTube playlist
 */
export const addVideoToYoutubePlaylist = action({
  args: {
    playlistId: v.string(),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    const response = await fetch(
      "https://www.googleapis.com/youtube/v3/playlistItems?part=snippet",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          snippet: {
            playlistId: args.playlistId,
            resourceId: {
              kind: "youtube#video",
              videoId: args.videoId,
            },
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to add video to playlist");
    }

    const data = await response.json();

    // Refresh playlist items cache
    await ctx.runAction(api.youtube.fetchPlaylistItems, {
      playlistId: args.playlistId,
    });

    return { playlistItemId: data.id };
  },
});

/**
 * Remove a video from a YouTube playlist
 */
export const removeVideoFromYoutubePlaylist = action({
  args: {
    playlistItemId: v.string(),
    playlistId: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?id=${args.playlistItemId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to remove video from playlist");
    }

    // Refresh playlist items cache
    await ctx.runAction(api.youtube.fetchPlaylistItems, {
      playlistId: args.playlistId,
    });
  },
});

/**
 * Delete a YouTube playlist
 */
export const deleteYoutubePlaylist = action({
  args: { playlistId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const userId = identity.subject;
    const accessToken = await getValidAccessToken(ctx, userId);

    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?id=${args.playlistId}`,
      {
        method: "DELETE",
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error("YouTube API error:", error);
      throw new Error("Failed to delete playlist");
    }

    // Refresh playlists cache
    await ctx.runAction(api.youtube.fetchYoutubePlaylists, {});
  },
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Parse ISO 8601 duration to human-readable format
 * e.g., "PT1H23M45S" -> "1:23:45"
 */
function parseDuration(duration: string | undefined): string {
  if (!duration) return "";

  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "";

  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
