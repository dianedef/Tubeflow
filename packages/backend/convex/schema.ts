import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - synced from Clerk via webhook
  users: defineTable({
    clerkId: v.string(), // Clerk user ID (same as userId in other tables)
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_clerk_id", ["clerkId"]),

  // User settings/preferences
  settings: defineTable({
    userId: v.string(), // References users.clerkId
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    language: v.optional(v.string()), // e.g., "en", "fr", "es"
    notifications: v.optional(
      v.object({
        email: v.boolean(),
        push: v.boolean(),
        newComments: v.boolean(),
        newLikes: v.boolean(),
      })
    ),
    playback: v.optional(
      v.object({
        autoplay: v.boolean(),
        defaultQuality: v.optional(v.string()), // e.g., "1080p", "720p", "auto"
        defaultSpeed: v.optional(v.number()), // e.g., 1, 1.25, 1.5, 2
      })
    ),
    notes: v.optional(
      v.object({
        defaultTimestamped: v.boolean(), // Auto-add timestamp when creating notes
        sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
      })
    ),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  // User subscriptions (for premium features)
  subscriptions: defineTable({
    userId: v.string(),
    plan: v.union(v.literal("free"), v.literal("pro"), v.literal("team")),
    status: v.union(
      v.literal("active"),
      v.literal("canceled"),
      v.literal("past_due"),
      v.literal("trialing")
    ),
    stripeCustomerId: v.optional(v.string()),
    stripeSubscriptionId: v.optional(v.string()),
    currentPeriodStart: v.optional(v.number()),
    currentPeriodEnd: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  // Playlists for organizing videos
  playlists: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    videoIds: v.array(v.id("videos")),
    isPublic: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user_id", ["userId"]),

  videos: defineTable({
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    videoUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    duration: v.optional(v.number()),
    views: v.number(),
    likes: v.number(),
    createdAt: v.number(),
  }).index("by_user_id", ["userId"]),

  channels: defineTable({
    userId: v.string(),
    name: v.string(),
    description: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  }).index("by_user_id", ["userId"]),

  comments: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_video_id", ["videoId"]),

  likes: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    type: v.union(v.literal("like"), v.literal("dislike")),
  })
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),

  notes: defineTable({
    videoId: v.id("videos"),
    userId: v.string(),
    content: v.string(),
    timestamp: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_video_id", ["videoId"])
    .index("by_user_and_video", ["userId", "videoId"]),
});
