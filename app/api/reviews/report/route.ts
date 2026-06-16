import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { reviewId, reason } = await req.json();
  if (!reviewId || !reason) return jsonError("reviewId and reason are required");

  const report = await prisma.reviewReport.create({
    data: {
      reviewId,
      reason,
      userId: user!.id,
    },
  });

  return NextResponse.json(report, { status: 201 });
}
