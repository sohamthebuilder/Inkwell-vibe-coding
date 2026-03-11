import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";
import { internal } from "./_generated/api";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/polar-webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.text();
    const headers: Record<string, string> = {};
    request.headers.forEach((value, key) => {
      headers[key] = value;
    });

    try {
      await ctx.runAction(internal.polarWebhook.handleWebhook, {
        body,
        headers,
      });
      return new Response(null, { status: 200 });
    } catch (error) {
      console.error("Polar webhook error:", error);
      return new Response("Webhook processing failed", { status: 400 });
    }
  }),
});

export default http;
