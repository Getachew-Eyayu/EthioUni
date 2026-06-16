import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { ratingSchema } from "@/lib/validations";
import { calculateOverallRating } from "@/lib/utils";

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = ratingSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message || "Invalid rating data");
    }

    const data = parsed.data;
    const overall = calculateOverallRating(data);

    const rating = await prisma.rating.upsert({
      where: {
        userId_universityId: {
          userId: user!.id,
          universityId: data.universityId,
        },
      },
      create: {
        userId: user!.id,
        universityId: data.universityId,
        education: data.education,
        instructors: data.instructors,
        food: data.food,
        beauty: data.beauty,
        behavior: data.behavior,
        admin: data.admin,
        library: data.library,
        dormitory: data.dormitory,
        security: data.security,
        overall,
      },
      update: {
        education: data.education,
        instructors: data.instructors,
        food: data.food,
        beauty: data.beauty,
        behavior: data.behavior,
        admin: data.admin,
        library: data.library,
        dormitory: data.dormitory,
        security: data.security,
        overall,
      },
    });

    return NextResponse.json({ message: "Rating submitted", rating });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit rating" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const universityId = searchParams.get("universityId");

  if (!universityId) {
    return jsonError("universityId is required");
  }

  const ratings = await prisma.rating.findMany({
    where: { universityId },
    include: { user: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(ratings);
}
