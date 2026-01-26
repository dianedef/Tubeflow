import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

// Get notes for a Convex video (legacy)
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

// Get notes for a YouTube video
export const getNotesByYoutubeVideo = query({
  args: { youtubeVideoId: v.string() },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("notes")
      .withIndex("by_user_and_youtube_video", (q) =>
        q.eq("userId", userId).eq("youtubeVideoId", args.youtubeVideoId)
      )
      .order("desc")
      .collect();
  },
});

// Get all notes for the current user (across all videos)
export const getAllNotes = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();
  },
});

// Get all notes with YouTube video metadata
export const getAllNotesWithVideoInfo = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return [];

    const notes = await ctx.db
      .query("notes")
      .filter((q) => q.eq(q.field("userId"), userId))
      .order("desc")
      .collect();

    // Enrich notes with video info from cache
    const enrichedNotes = await Promise.all(
      notes.map(async (note) => {
        let videoInfo = null;

        if (note.youtubeVideoId) {
          // Get video info from YouTube cache
          const cachedVideo = await ctx.db
            .query("youtubeVideosCache")
            .withIndex("by_video", (q) =>
              q.eq("youtubeVideoId", note.youtubeVideoId!)
            )
            .first();

          if (cachedVideo) {
            videoInfo = {
              id: cachedVideo.youtubeVideoId,
              title: cachedVideo.title,
              thumbnailUrl: cachedVideo.thumbnailUrl,
              channelTitle: cachedVideo.channelTitle,
              isYoutube: true,
            };
          }
        } else if (note.videoId) {
          // Get video info from local videos table
          const localVideo = await ctx.db.get(note.videoId);
          if (localVideo) {
            videoInfo = {
              id: localVideo._id,
              title: localVideo.title,
              thumbnailUrl: localVideo.thumbnailUrl,
              channelTitle: "",
              isYoutube: false,
            };
          }
        }

        return {
          ...note,
          videoInfo,
        };
      })
    );

    return enrichedNotes;
  },
});

// Create note for a Convex video (legacy)
export const createNote = mutation({
  args: {
    videoId: v.optional(v.id("videos")),
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

// Create note for a YouTube video
export const createNoteForYoutubeVideo = mutation({
  args: {
    youtubeVideoId: v.string(),
    content: v.string(),
    timestamp: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const noteId = await ctx.db.insert("notes", {
      youtubeVideoId: args.youtubeVideoId,
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
