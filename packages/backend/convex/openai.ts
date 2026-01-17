import OpenAI from "openai";
import { internalAction, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { missingEnvVariableUrl } from "./utils";

export const openaiKeySet = query({
  args: {},
  handler: async () => {
    return !!process.env.OPENROUTER_API_KEY;
  },
});

export const summary = internalAction({
  args: {
    id: v.id("videos"),
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, { id, title, content }) => {
    const prompt = `Take in the following video and return a summary: Title: ${title}, Description: ${content}`;

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      const error = missingEnvVariableUrl(
        "OPENROUTER_API_KEY",
        "https://openrouter.ai/keys",
      );
      console.error(error);
      await ctx.runMutation(internal.openai.saveSummary, {
        id: id,
        summary: error,
      });
      return;
    }
    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });
    const output = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a helpful assistant designed to output JSON in this format: {summary: string}",
        },
        { role: "user", content: prompt },
      ],
      model: "anthropic/claude-3.5-sonnet",
      response_format: { type: "json_object" },
    });

    // Pull the message content out of the response
    const messageContent = output.choices[0]?.message.content;

    console.log({ messageContent });

    const parsedOutput = JSON.parse(messageContent!);
    console.log({ parsedOutput });

    await ctx.runMutation(internal.openai.saveSummary, {
      id: id,
      summary: parsedOutput.summary,
    });
  },
});

export const saveSummary = internalMutation({
  args: {
    id: v.id("videos"),
    summary: v.string(),
  },
  handler: async (ctx, { id, summary }) => {
    await ctx.db.patch(id, {
      description: summary,
    });
  },
});
