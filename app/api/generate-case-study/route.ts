// app/api/generate-case-study/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Create the system prompt for case study generation
    const systemPrompt =
      "You are a professional case study writer. " +
      "Generate a comprehensive, well-structured case study in markdown format based on the user's input. " +
      "Include the following sections:\n" +
      "# [Title of Case Study]\n\n" +
      "## Executive Summary\n\n" +
      "## Client Background\n\n" +
      "## Challenge\n\n" +
      "## Approach\n\n" +
      "## Solution\n\n" +
      "## Results\n" +
      "Include specific metrics where possible.\n\n" +
      "## Lessons Learned\n\n" +
      "Your case study should be detailed, professional, and ready for publication or download. " +
      "Write in a clear, engaging style with proper markdown formatting.";

    // Get the user message content
    const userMessage = messages[messages.length - 1].content;

    // Use streamText from the AI SDK
    const result = streamText({
      model: openai("gpt-4"),
      system: systemPrompt,
      prompt: userMessage,
      temperature: 0.7,
      maxTokens: 2000,
      onError({ error }) {
        console.error("Error generating case study:", error);
      },
    });

    // Return a streaming response - using dataStream which is compatible with useChat
    return result.toDataStreamResponse();
  } catch (error: unknown) {
    const errorMessage = error as { message: string };
    console.error("Error in case study API route:", error);
    return new Response(
      JSON.stringify({
        error: errorMessage.message || "Failed to generate case study",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
