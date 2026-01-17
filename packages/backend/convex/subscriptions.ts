import { v } from "convex/values";
import { mutation, query, internalMutation } from "./_generated/server";
import { getUserId } from "./utils";

// Plan types and their features
export const PLANS = {
  free: {
    name: "Free",
    maxVideos: 10,
    maxNotesPerVideo: 50,
    maxPlaylists: 3,
    aiSummaries: false,
    exportNotes: false,
  },
  pro: {
    name: "Pro",
    maxVideos: 100,
    maxNotesPerVideo: 500,
    maxPlaylists: 20,
    aiSummaries: true,
    exportNotes: true,
  },
  team: {
    name: "Team",
    maxVideos: -1, // unlimited
    maxNotesPerVideo: -1,
    maxPlaylists: -1,
    aiSummaries: true,
    exportNotes: true,
  },
} as const;

// Get current user's subscription
export const getSubscription = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return null;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!subscription) {
      // Return default free subscription
      return {
        plan: "free" as const,
        status: "active" as const,
        features: PLANS.free,
      };
    }

    return {
      ...subscription,
      features: PLANS[subscription.plan],
    };
  },
});

// Get subscription limits for the current user
export const getSubscriptionLimits = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) return PLANS.free;

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (!subscription) return PLANS.free;

    return PLANS[subscription.plan];
  },
});

// Check if user can perform an action based on their plan
export const checkLimit = query({
  args: {
    feature: v.union(
      v.literal("videos"),
      v.literal("notesPerVideo"),
      v.literal("playlists"),
      v.literal("aiSummaries"),
      v.literal("exportNotes")
    ),
    currentCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const userId = await getUserId(ctx);
    if (!userId) return { allowed: false, reason: "Unauthorized" };

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    const plan = subscription?.plan ?? "free";
    const features = PLANS[plan];

    switch (args.feature) {
      case "videos":
        if (features.maxVideos === -1) return { allowed: true };
        if (args.currentCount !== undefined && args.currentCount >= features.maxVideos) {
          return {
            allowed: false,
            reason: `You've reached the limit of ${features.maxVideos} videos on the ${features.name} plan`,
          };
        }
        return { allowed: true };

      case "notesPerVideo":
        if (features.maxNotesPerVideo === -1) return { allowed: true };
        if (args.currentCount !== undefined && args.currentCount >= features.maxNotesPerVideo) {
          return {
            allowed: false,
            reason: `You've reached the limit of ${features.maxNotesPerVideo} notes per video on the ${features.name} plan`,
          };
        }
        return { allowed: true };

      case "playlists":
        if (features.maxPlaylists === -1) return { allowed: true };
        if (args.currentCount !== undefined && args.currentCount >= features.maxPlaylists) {
          return {
            allowed: false,
            reason: `You've reached the limit of ${features.maxPlaylists} playlists on the ${features.name} plan`,
          };
        }
        return { allowed: true };

      case "aiSummaries":
        if (!features.aiSummaries) {
          return {
            allowed: false,
            reason: "AI summaries are not available on the Free plan",
          };
        }
        return { allowed: true };

      case "exportNotes":
        if (!features.exportNotes) {
          return {
            allowed: false,
            reason: "Note export is not available on the Free plan",
          };
        }
        return { allowed: true };

      default:
        return { allowed: false, reason: "Unknown feature" };
    }
  },
});

// Update subscription (called from Stripe webhook)
export const updateSubscription = internalMutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const existingSubscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .first();

    const now = Date.now();

    if (existingSubscription) {
      await ctx.db.patch(existingSubscription._id, {
        plan: args.plan,
        status: args.status,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        updatedAt: now,
      });
      return existingSubscription._id;
    } else {
      return await ctx.db.insert("subscriptions", {
        userId: args.userId,
        plan: args.plan,
        status: args.status,
        stripeCustomerId: args.stripeCustomerId,
        stripeSubscriptionId: args.stripeSubscriptionId,
        currentPeriodStart: args.currentPeriodStart,
        currentPeriodEnd: args.currentPeriodEnd,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Cancel subscription (downgrade to free)
export const cancelSubscription = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await getUserId(ctx);
    if (!userId) throw new Error("Unauthorized");

    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .first();

    if (subscription) {
      await ctx.db.patch(subscription._id, {
        status: "canceled",
        updatedAt: Date.now(),
      });
    }
  },
});

// Get all plan options for pricing page
export const getPlans = query({
  args: {},
  handler: async () => {
    return Object.entries(PLANS).map(([key, value]) => ({
      id: key,
      ...value,
    }));
  },
});
