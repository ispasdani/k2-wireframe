// File: schema/convex.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    imageUrl: v.optional(v.string()),
    clerkId: v.string(),
    name: v.string(),
    credits: v.number(),
    linkedInProfile: v.optional(v.string()),
    githubProfile: v.optional(v.string()),
  }),
  payments: defineTable({
    userId: v.id("users"),
    stripeId: v.string(),
    status: v.string(),
    amount: v.number(),
    planId: v.id("plans"),
    createdAt: v.string(),
  }).index("stripeIdIndex", ["stripeId"]),
  plans: defineTable({
    name: v.string(),
    price: v.number(),
    credits: v.number(),
    imageGeneration: v.number(),
    description: v.string(),
    messageOne: v.string(),
    messageTwo: v.string(),
    messageThree: v.string(),
    messageFour: v.string(),
    messageFive: v.string(),
    messageSix: v.string(),
  }),
});
