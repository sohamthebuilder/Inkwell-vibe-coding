import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";

export const list = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return [];
    return await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.documentId))
      .order("desc")
      .collect();
  },
});

export const add = mutation({
  args: {
    documentId: v.id("documents"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    return await ctx.db.insert("knowledge", {
      documentId: args.documentId,
      userId,
      title: args.title,
      content: args.content,
      createdAt: Date.now(),
    });
  },
});

export const remove = mutation({
  args: { id: v.id("knowledge") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    const entry = await ctx.db.get(args.id);
    if (!entry || entry.userId !== userId) throw new Error("Not found");
    await ctx.db.delete(args.id);
  },
});
