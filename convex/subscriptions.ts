import { query, mutation, internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

export const getByUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
  },
});

export const createPending = mutation({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("subscriptions")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();

    if (existing) return existing._id;

    const now = Date.now();
    return await ctx.db.insert("subscriptions", {
      userId,
      email: args.email,
      status: "pending",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const activateByEmail = internalMutation({
  args: {
    email: v.string(),
    polarSubscriptionId: v.string(),
  },
  handler: async (ctx, args) => {
    const subscription = await ctx.db
      .query("subscriptions")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (subscription) {
      await ctx.db.patch(subscription._id, {
        status: "active",
        polarSubscriptionId: args.polarSubscriptionId,
        updatedAt: Date.now(),
      });
      return { updated: true };
    }

    return { updated: false };
  },
});
