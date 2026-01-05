import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

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

export const createVideo = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const videoId = await ctx.db.insert("videos", {
      userId,
      title: args.title,
      description: args.description,
      videoUrl: args.videoUrl,
      thumbnailUrl: args.thumbnailUrl,
      duration: args.duration,
      views: 0,
      likes: 0,
      createdAt: Date.now(),
    });
    return videoId;
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
