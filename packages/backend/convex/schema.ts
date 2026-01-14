import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  videos: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(), // Placeholder for YouTube API later
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()), // in seconds
    views: v.number(),
    likes: v.number(),
    createdAt: v.number(),
  }),
  channels: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  }),
  comments: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }),
  likes: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("dislike")),
  }),
  notes: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    content: v.string(),
    timestamp: v.optional(v.number()), // Video timestamp in seconds
    createdAt: v.number(),
  }),
});
