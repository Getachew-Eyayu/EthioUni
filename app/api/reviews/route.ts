import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { reviewSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("universityId");

  const reviews = await prisma.review.findMany({
    where: {
      isHidden: false,
      ...(universityId ? { universityId } : {}),
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      university: { select: { id: true, name: true, slug: true } },
      replies: {
        include: { user: { select: { id: true, name: true, image: true } } },
        orderBy: { createdAt: "asc" },
      },
      _count: { select: { reviewLikes: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reviews);
}

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message || "Invalid review");
    }

    const review = await prisma.review.create({
      data: {
        content: parsed.data.content,
        userId: user!.id,
        universityId: parsed.data.universityId,
      },
      include: {
        user: { select: { id: true, name: true, image: true } },
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
  }
}
