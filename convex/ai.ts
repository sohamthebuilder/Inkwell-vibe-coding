"use node";

import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthUserId } from "@convex-dev/auth/server";

export const generate = action({
  args: {
    documentId: v.id("documents"),
    prompt: v.string(),
    documentContent: v.string(),
    knowledgeEntries: v.array(
      v.object({
        title: v.string(),
        content: v.string(),
      })
    ),
    selectedContext: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const knowledgeContext = args.knowledgeEntries.length > 0
      ? args.knowledgeEntries
          .map((k) => `### ${k.title}\n${k.content}`)
          .join("\n\n")
      : "No reference materials provided.";

    const selectedContextSection = args.selectedContext
      ? `\n\n## Selected Text (User highlighted this from the document)\n${args.selectedContext}`
      : "";

    const systemMessage = `You are an expert writing assistant helping the user write and edit a document. You have access to reference materials that the user has provided as context.

When the user asks you to write or edit text, produce high-quality prose that:
- Matches the tone and style of the existing document
- References the provided knowledge materials when relevant
- Is clear, concise, and well-structured
${args.selectedContext ? "- Pay special attention to the selected text the user highlighted — their question likely relates to it" : ""}

## Reference Materials
${knowledgeContext}

## Current Document
${args.documentContent || "(The document is currently empty.)"}${selectedContextSection}

Respond with ONLY the text content that should be inserted or used in the document. Do not include explanations or meta-commentary unless the user specifically asks for feedback rather than content.`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: args.prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenAI API error: ${error}`);
    }

    const data = await response.json();
    const assistantMessage =
      data.choices?.[0]?.message?.content ?? "Sorry, I could not generate a response.";

    await ctx.runMutation(internal.chat.sendInternal, {
      documentId: args.documentId,
      userId,
      role: "assistant",
      content: assistantMessage,
    });

    return assistantMessage;
  },
});
