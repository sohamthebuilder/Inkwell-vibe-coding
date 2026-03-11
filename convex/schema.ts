import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const schema = defineSchema({
  ...authTables,

  documents: defineTable({
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_user", ["userId"]),

  knowledge: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),

  chatMessages: defineTable({
    documentId: v.id("documents"),
    userId: v.id("users"),
    role: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    createdAt: v.number(),
  }).index("by_document", ["documentId"]),

  subscriptions: defineTable({
    userId: v.id("users"),
    email: v.string(),
    polarSubscriptionId: v.optional(v.string()),
    status: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_email", ["email"]),
});

export default schema;
