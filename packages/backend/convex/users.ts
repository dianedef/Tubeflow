import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getUserId } from "./utils";

// Get current user from Convex (synced from Clerk)
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    return user;
  },
});

// Get user by Clerk ID
export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
  },
});

// Create or update user from Clerk webhook
export const upsertUser = internalMutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const now = Date.now();

    if (existingUser) {
      // Update existing user
      await ctx.db.patch(existingUser._id, {
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
        updatedAt: now,
      });
      return existingUser._id;
    } else {
      // Create new user
      const userId = await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        avatarUrl: args.avatarUrl,
        createdAt: now,
        updatedAt: now,
      });

      // Create default settings for new user
      await ctx.db.insert("settings", {
        userId: args.clerkId,
        theme: "system",
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
          sortOrder: "asc",
        },
        updatedAt: now,
      });

      // Create default free subscription
      await ctx.db.insert("subscriptions", {
        userId: args.clerkId,
        plan: "free",
        status: "active",
        createdAt: now,
        updatedAt: now,
      });

      return userId;
    }
  },
});

// Delete user from Clerk webhook
export const deleteUser = internalMutation({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (user) {
      // Delete user's settings
      const settings = await ctx.db
        .query("settings")
        .withIndex("by_user_id", (q) => q.eq("userId", args.clerkId))
        .first();
      if (settings) await ctx.db.delete(settings._id);

      // Delete user's subscription
      const subscription = await ctx.db
        .query("subscriptions")
        .withIndex("by_user_id", (q) => q.eq("userId", args.clerkId))
        .first();
      if (subscription) await ctx.db.delete(subscription._id);

      // Delete user
      await ctx.db.delete(user._id);
    }
  },
});

// Update user profile (called from frontend)
export const updateProfile = mutation({
  args: {
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      ...(args.name !== undefined && { name: args.name }),
      ...(args.avatarUrl !== undefined && { avatarUrl: args.avatarUrl }),
      updatedAt: Date.now(),
    });

    return user._id;
  },
});

// Ensure user exists (create if not) - called on first app load
export const ensureUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
    avatarUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", userId))
      .first();

    const now = Date.now();

    if (existingUser) {
      return existingUser._id;
    }

    // Create new user
    const newUserId = await ctx.db.insert("users", {
      clerkId: userId,
      email: args.email,
      name: args.name,
      avatarUrl: args.avatarUrl,
      createdAt: now,
      updatedAt: now,
    });

    // Create default settings
    await ctx.db.insert("settings", {
      userId: userId,
      theme: "system",
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
        sortOrder: "asc",
      },
      updatedAt: now,
    });

    // Create default free subscription
    await ctx.db.insert("subscriptions", {
      userId: userId,
      plan: "free",
      status: "active",
      createdAt: now,
      updatedAt: now,
    });

    return newUserId;
  },
});
