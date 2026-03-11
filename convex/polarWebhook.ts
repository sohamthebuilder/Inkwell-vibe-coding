"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import {
  validateEvent,
  WebhookVerificationError,
} from "@polar-sh/sdk/webhooks";
import { internal } from "./_generated/api";

export const handleWebhook = internalAction({
  args: {
    body: v.string(),
    headers: v.any(),
  },
  handler: async (ctx, args) => {
    const secret = process.env.POLAR_WEBHOOK_SECRET;
    if (!secret) throw new Error("POLAR_WEBHOOK_SECRET not configured");

    const event = validateEvent(
      args.body,
      args.headers as Record<string, string>,
      secret,
    );

    if (event.type === "subscription.active") {
      const email = event.data.customer.email;
      const subscriptionId = event.data.id;
      await ctx.runMutation(internal.subscriptions.activateByEmail, {
        email,
        polarSubscriptionId: subscriptionId,
      });
    } else if (event.type === "order.created") {
      const email = event.data.customer.email;
      const subscriptionId =
        event.data.subscriptionId ?? event.data.id;
      await ctx.runMutation(internal.subscriptions.activateByEmail, {
        email,
        polarSubscriptionId: subscriptionId,
      });
    }
  },
});
