import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserId } from "./utils";

// Settings validators
const notificationsValidator = v.object({
  email: v.boolean(),
  push: v.boolean(),
  newComments: v.boolean(),
  newLikes: v.boolean(),
});

const playbackValidator = v.object({
  autoplay: v.boolean(),
  defaultQuality: v.optional(v.string()),
  defaultSpeed: v.optional(v.number()),
});

const notesValidator = v.object({
  defaultTimestamped: v.boolean(),
  sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
});

// Get current user's settings
export const getSettings = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    // Return default settings if none exist
    if (!settings) {
      return {
        theme: "system" as const,
        language: "en",
        notifications: {
          email: true,
          push: true,
          newComments: true,
          newLikes: false,
        },
        playback: {
          autoplay: true,
          defaultQuality: "auto",
          defaultSpeed: 1,
        },
        notes: {
          defaultTimestamped: true,
          sortOrder: "asc" as const,
        },
      };
    }

    return settings;
  },
});

// Update theme setting
export const updateTheme = mutation({
  args: {
    theme: v.union(v.literal("light"), v.literal("dark"), v.literal("system")),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        theme: args.theme,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        userId,
        theme: args.theme,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update language setting
export const updateLanguage = mutation({
  args: {
    language: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        language: args.language,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        userId,
        language: args.language,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update notification settings
export const updateNotifications = mutation({
  args: {
    notifications: notificationsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        notifications: args.notifications,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        userId,
        notifications: args.notifications,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update playback settings
export const updatePlayback = mutation({
  args: {
    playback: playbackValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        playback: args.playback,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        userId,
        playback: args.playback,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update notes settings
export const updateNotesSettings = mutation({
  args: {
    notes: notesValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (settings) {
      await ctx.db.patch(settings._id, {
        notes: args.notes,
        updatedAt: Date.now(),
      });
    } else {
      await ctx.db.insert("settings", {
        userId,
        notes: args.notes,
        updatedAt: Date.now(),
      });
    }
  },
});

// Update all settings at once
export const updateAllSettings = mutation({
  args: {
    theme: v.optional(v.union(v.literal("light"), v.literal("dark"), v.literal("system"))),
    language: v.optional(v.string()),
    notifications: v.optional(notificationsValidator),
    playback: v.optional(playbackValidator),
    notes: v.optional(notesValidator),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const settings = await ctx.db
      .query("settings")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (args.theme !== undefined) updateData.theme = args.theme;
    if (args.language !== undefined) updateData.language = args.language;
    if (args.notifications !== undefined) updateData.notifications = args.notifications;
    if (args.playback !== undefined) updateData.playback = args.playback;
    if (args.notes !== undefined) updateData.notes = args.notes;

    if (settings) {
      await ctx.db.patch(settings._id, updateData);
      return settings._id;
    } else {
      return await ctx.db.insert("settings", {
        userId,
        ...updateData,
      } as {
        userId: string;
        theme?: "light" | "dark" | "system";
        language?: string;
        notifications?: {
          email: boolean;
          push: boolean;
          newComments: boolean;
          newLikes: boolean;
        };
        playback?: {
          autoplay: boolean;
          defaultQuality?: string;
          defaultSpeed?: number;
        };
        notes?: {
          defaultTimestamped: boolean;
          sortOrder?: "asc" | "desc";
        };
        updatedAt: number;
      });
    }
  },
});
