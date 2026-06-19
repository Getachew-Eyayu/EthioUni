import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateUniversitySummary(
  reviews: string[]
): Promise<string> {
  if (!process.env.OPENAI_API_KEY) {
    console.warn("OpenAI API key not set");
    return "AI summary unavailable";
  }

  try {
    const message = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "Summarize the following university reviews in a professional manner.",
        },
        {
          role: "user",
          content: reviews.join("\n"),
        },
      ],
    });

    return (
      message.choices[0]?.message?.content || "Unable to generate summary"
    );
  } catch (error) {
    console.error("Error generating summary:", error);
    throw error;
  }
}
