import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateReviewSummary } from "@/lib/openai";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const { universityId } = await params;

    let summary = await prisma.aiSummary.findUnique({
      where: { universityId },
    });

    if (!summary) {
      const generated = await generateReviewSummary(universityId);
      if (!generated) {
        return NextResponse.json({ error: "No reviews to summarize" }, { status: 404 });
      }
      summary = await prisma.aiSummary.findUnique({ where: { universityId } });
    }

    return NextResponse.json(summary);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ universityId: string }> }
) {
  try {
    const { universityId } = await params;
    const summary = await generateReviewSummary(universityId);

    if (!summary) {
      return NextResponse.json({ error: "No reviews to summarize" }, { status: 404 });
    }

    return NextResponse.json({ summary });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
