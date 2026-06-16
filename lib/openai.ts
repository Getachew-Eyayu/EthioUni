import OpenAI from "openai";
import { prisma } from "@/lib/prisma";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export async function generateReviewSummary(universityId: string) {
  const reviews = await prisma.review.findMany({
    where: { universityId, isHidden: false },
    take: 50,
    orderBy: { createdAt: "desc" },
    select: { content: true },
  });

  if (reviews.length === 0) {
    return null;
  }

  const reviewTexts = reviews.map((r, i) => `Review ${i + 1}: ${r.content}`).join("\n\n");

  if (!openai) {
    const fallback = `Based on ${reviews.length} reviews, students share mixed experiences about this university. Configure OPENAI_API_KEY for AI-generated summaries.`;
    await prisma.aiSummary.upsert({
      where: { universityId },
      create: { universityId, summary: fallback },
      update: { summary: fallback, generatedAt: new Date() },
    });
    return fallback;
  }

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You summarize university reviews concisely. Highlight common themes, strengths, and concerns. Keep it under 200 words. Be balanced and factual.",
      },
      {
        role: "user",
        content: `Summarize these reviews for an Ethiopian university:\n\n${reviewTexts}`,
      },
    ],
    max_tokens: 300,
  });

  const summary =
    completion.choices[0]?.message?.content ||
    "Unable to generate summary at this time.";

  await prisma.aiSummary.upsert({
    where: { universityId },
    create: { universityId, summary },
    update: { summary, generatedAt: new Date() },
  });

  return summary;
}
