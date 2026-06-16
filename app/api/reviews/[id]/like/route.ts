import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { id: reviewId } = await params;

  const review = await prisma.review.findUnique({ where: { id: reviewId } });
  if (!review) return jsonError("Review not found", 404);

  const existing = await prisma.reviewLike.findUnique({
    where: { userId_reviewId: { userId: user!.id, reviewId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.reviewLike.delete({ where: { id: existing.id } }),
      prisma.review.update({
        where: { id: reviewId },
        data: { likes: { decrement: 1 } },
      }),
    ]);
    return NextResponse.json({ liked: false });
  }

  await prisma.$transaction([
    prisma.reviewLike.create({ data: { userId: user!.id, reviewId } }),
    prisma.review.update({
      where: { id: reviewId },
      data: { likes: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ liked: true });
}
