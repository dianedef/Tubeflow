import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

export const getNotes = query({
  args: { videoId: v.id("videos") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("notes")
      .filter((q) => 
        q.and(
          q.eq(q.field("videoId"), args.videoId),
          q.eq(q.field("userId"), userId)
        )
      )
      .order("desc")
      .collect();
  },
});

export const createNote = mutation({
  args: {
    videoId: v.id("videos"),
    content: v.string(),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const noteId = await ctx.db.insert("notes", {
      videoId: args.videoId,
      userId,
      content: args.content,
      timestamp: args.timestamp,
      createdAt: Date.now(),
    });
    return noteId;
  },
});

export const updateNote = mutation({
  args: {
    id: v.id("notes"),
    content: v.string(),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.patch(args.id, {
      content: args.content,
      timestamp: args.timestamp,
    });
  },
});

export const deleteNote = mutation({
  args: { id: v.id("notes") },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    const note = await ctx.db.get(args.id);
    if (!note || note.userId !== userId) throw new Error("Unauthorized");

    await ctx.db.delete(args.id);
  },
});
