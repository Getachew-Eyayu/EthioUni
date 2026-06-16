import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { reviewSchema } from "@/lib/validations";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { id } = await params;

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return jsonError("Review not found", 404);
  if (existing.userId !== user!.id) return jsonError("Forbidden", 403);

  const body = await req.json();
  const parsed = reviewSchema.safeParse({ ...body, universityId: existing.universityId });
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message || "Invalid review");
  }

  const review = await prisma.review.update({
    where: { id },
    data: { content: parsed.data.content },
  });

  return NextResponse.json(review);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) return jsonError("Review not found", 404);
  if (existing.userId !== user!.id && user!.role !== "ADMIN" && user!.role !== "MODERATOR") {
    return jsonError("Forbidden", 403);
  }

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ message: "Review deleted" });
}
