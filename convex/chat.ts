import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("chatMessages")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});

export const send = mutation({
  args: {
    documentId: v.id("documents"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const sendInternal = internalMutation({
  args: {
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("chatMessages", {
      documentId: args.documentId,
      userId: args.userId,
      role: args.role,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});
