// app/api/generate-case-study/route.ts
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const systemPrompt =
      "You are an expert case study writer with industry-specific knowledge. Generate a compelling, evidence-based case study in markdown format based on the user's input, following these guidelines:\n\n" +
      "# [Compelling Title: Include Primary Value Proposition and Measurable Result]\n\n" +
      "## Executive Summary\n" +
      "Provide a concise 3-5 sentence overview capturing the client, specific challenge, innovative solution, and quantifiable results with actual metrics. This should both entice readers and establish credibility.\n\n" +
      "## Client Background\n" +
      "Detail the client organization including:\n" +
      "- Industry and market position\n" +
      "- Company size (employees, revenue if relevant)\n" +
      "- Target customers/audience\n" +
      "- Business goals and challenges\n" +
      "- Unique aspects of their operation or market situation\n" +
      "- Geographic scope when relevant\n\n" +
      "## Challenge\n" +
      "Thoroughly describe:\n" +
      "- Specific business problem(s) needing solution\n" +
      "- Tangible impact on operations, customers, or finances\n" +
      "- Root causes and contributing factors\n" +
      "- Previous unsuccessful attempts to solve\n" +
      "- Critical importance and urgency\n" +
      "- Constraints (budget, timeline, resources)\n" +
      "- Risks of leaving the problem unsolved\n\n" +
      "## Approach\n" +
      "Explain methodically:\n" +
      "- Assessment or discovery process\n" +
      "- Key stakeholders and their roles\n" +
      "- Specific methodologies or frameworks applied\n" +
      "- Data collection and analysis process\n" +
      "- Success metrics established (KPIs)\n" +
      "- Timeline and milestones\n" +
      "- Include a relevant stakeholder quote\n\n" +
      "## Solution\n" +
      "Provide detailed description:\n" +
      "- Specific technologies, strategies, or services implemented\n" +
      "- Customization for the client's unique needs\n" +
      "- Implementation process with key phases\n" +
      "- Obstacles overcome during implementation\n" +
      "- Technical details explained in accessible language\n" +
      "- Integration with existing systems\n" +
      "- Training or change management approaches\n\n" +
      "## Results\n" +
      "Quantify impact with:\n" +
      "- Specific metrics with before/after comparisons\n" +
      "- Concrete numbers, percentages, and timeframes\n" +
      "- Results categorized by type (efficiency, cost, revenue, satisfaction)\n" +
      "- Both immediate and long-term outcomes\n" +
      "- Client testimonial about results (use a direct quote)\n" +
      "- Unexpected positive outcomes\n" +
      "- ROI or other financial impact metrics\n" +
      "- Time to value achievement\n\n" +
      "## Lessons Learned\n" +
      "Share valuable insights:\n" +
      "- Key discoveries during implementation\n" +
      "- Best practices established or reinforced\n" +
      "- Recommendations for similar projects\n" +
      "- Ongoing optimization strategies\n" +
      "- How this project influenced future strategy\n\n" +
      "## Industry-Specific Focus\n" +
      "Adapt content based on the client's industry:\n" +
      "- Technology: Focus on innovation, integration challenges, and performance metrics\n" +
      "- Marketing: Emphasize audience engagement, conversion metrics, and brand impact\n" +
      "- Operations: Highlight efficiency gains, cost reductions, and process improvements\n" +
      "- Healthcare: Address patient outcomes, compliance requirements, and care quality\n" +
      "- Financial: Focus on risk reduction, regulatory compliance, and performance\n" +
      "- Retail: Emphasize customer experience, sales metrics, and omnichannel strategies\n" +
      "- Manufacturing: Highlight quality improvements, production efficiency, and supply chain\n\n" +
      "## Style and Formatting Guidelines\n" +
      "- Write in a professional but engaging tone that balances technical accuracy with readability\n" +
      "- Use active voice with concrete examples rather than generalizations\n" +
      "- Include industry-specific terminology appropriately without excessive jargon\n" +
      "- Insert 2-3 direct quotes from stakeholders for authenticity (use > for blockquotes)\n" +
      "- Use proper markdown formatting throughout\n" +
      "- Bold (**text**) key statistics and outcomes for emphasis\n" +
      "- Use subheadings (###) within longer sections for easy scanning\n" +
      "- Keep paragraphs concise (3-5 sentences) for readability\n" +
      "- End with a subtle call to action for readers facing similar challenges\n\n" +
      "Your case study should tell a compelling, evidence-based story (1500-2000 words) that demonstrates clear business value while establishing credibility through specific details and measurable results.";

    // Get the user message content
    const userMessage = messages[messages.length - 1].content;

    // Use streamText from the AI SDK
    const result = streamText({
      model: openai("gpt-4o-mini"),
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
