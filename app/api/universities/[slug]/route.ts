import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const university = await prisma.university.findUnique({
      where: { slug },
      include: {
        ratings: true,
        reviews: {
          where: { isHidden: false },
          include: {
            user: { select: { id: true, name: true, image: true } },
            replies: {
              include: { user: { select: { id: true, name: true, image: true } } },
              orderBy: { createdAt: "asc" },
            },
            _count: { select: { reviewLikes: true, replies: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        aiSummary: true,
        _count: { select: { reviews: true, ratings: true, complaints: true } },
      },
    });

    if (!university) {
      return NextResponse.json({ error: "University not found" }, { status: 404 });
    }

    const categoryAverages = university.ratings.length > 0
      ? {
          education: avg(university.ratings.map((r) => r.education)),
          instructors: avg(university.ratings.map((r) => r.instructors)),
          food: avg(university.ratings.map((r) => r.food)),
          beauty: avg(university.ratings.map((r) => r.beauty)),
          behavior: avg(university.ratings.map((r) => r.behavior)),
          admin: avg(university.ratings.map((r) => r.admin)),
          library: avg(university.ratings.map((r) => r.library)),
          dormitory: avg(university.ratings.map((r) => r.dormitory)),
          security: avg(university.ratings.map((r) => r.security)),
          overall: avg(university.ratings.map((r) => r.overall)),
        }
      : null;

    const { ratings, ...rest } = university;

    return NextResponse.json({
      ...rest,
      categoryAverages,
      ratingCount: university._count.ratings,
      reviewCount: university._count.reviews,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch university" }, { status: 500 });
  }
}

function avg(nums: number[]) {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}
