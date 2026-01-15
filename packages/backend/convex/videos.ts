import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

// YouTube feed functions
export const getYouTubeFeed = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    
    // In a real implementation, this would fetch from YouTube API
    // For now, return mock data
    return [
      {
        id: "1",
        title: "Sample YouTube Video 1",
        description: "This is a sample video description",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        channelTitle: "Sample Channel",
        publishedAt: new Date().toISOString()
      },
      {
        id: "2",
        title: "Sample YouTube Video 2",
        description: "Another sample video description",
        thumbnailUrl: "https://via.placeholder.com/300x200",
        channelTitle: "Another Channel",
        publishedAt: new Date().toISOString()
      }
    ];
  },
});

// Playlist functions
export const getPlaylists = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("playlists")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const createPlaylist = mutation({
  args: {
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    return await ctx.db.insert("playlists", {
      userId,
      name: args.name,
      videoIds: [],
      createdAt: Date.now(),
    });
  },
});

export const addVideoToPlaylist = mutation({
  args: {
    playlistId: v.id("playlists"),
    videoId: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const playlist = await ctx.db.get(args.playlistId);
    
    if (!playlist || playlist.userId !== userId) {
      throw new Error("Unauthorized");
    }

    // Add video ID if not already in playlist
    if (!playlist.videoIds.includes(args.videoId)) {
      await ctx.db.patch(args.playlistId, {
        videoIds: [...playlist.videoIds, args.videoId]
      });
    }
  },
});

// Keep existing video functions for compatibility
export const getVideos = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("videos")
      .filter((q) => q.eq(q.field("userId"), userId))
      .collect();
  },
});

export const getVideo = query({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const updateVideoViews = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const video = await ctx.db.get(args.id);
    if (!video) throw new Error("Video not found");

    await ctx.db.patch(args.id, { views: video.views + 1 });
  },
});

export const deleteVideo = mutation({
  args: { id: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const video = await ctx.db.get(args.id);
    if (!video || video.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
