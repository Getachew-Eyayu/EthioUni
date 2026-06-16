import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const region = searchParams.get("region") || "";
    const type = searchParams.get("type") || "";
    const sort = searchParams.get("sort") || "name";
    const ids = searchParams.get("ids") || "";

    const where: Prisma.UniversityWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (region) where.region = region;
    if (type === "PUBLIC" || type === "PRIVATE") where.type = type;

    if (ids) {
      where.id = { in: ids.split(",") };
    }

    const universities = await prisma.university.findMany({
      where,
      include: {
        ratings: {
          select: {
            overall: true,
            education: true,
            instructors: true,
            food: true,
            beauty: true,
            behavior: true,
            admin: true,
            library: true,
            dormitory: true,
            security: true,
          },
        },
        _count: { select: { reviews: true, ratings: true } },
        aiSummary: { select: { summary: true, generatedAt: true } },
      },
    });

    const enriched = universities.map((uni) => {
      const avgRating =
        uni.ratings.length > 0
          ? uni.ratings.reduce((sum, r) => sum + r.overall, 0) / uni.ratings.length
          : 0;

      const categoryAverages =
        uni.ratings.length > 0
          ? {
              education: avgField(uni.ratings.map((r) => r.education)),
              instructors: avgField(uni.ratings.map((r) => r.instructors)),
              food: avgField(uni.ratings.map((r) => r.food)),
              beauty: avgField(uni.ratings.map((r) => r.beauty)),
              behavior: avgField(uni.ratings.map((r) => r.behavior)),
              admin: avgField(uni.ratings.map((r) => r.admin)),
              library: avgField(uni.ratings.map((r) => r.library)),
              dormitory: avgField(uni.ratings.map((r) => r.dormitory)),
              security: avgField(uni.ratings.map((r) => r.security)),
            }
          : null;

      const { ratings, ...rest } = uni;
      return {
        ...rest,
        avgRating: Math.round(avgRating * 10) / 10,
        ratingCount: uni._count.ratings,
        reviewCount: uni._count.reviews,
        categoryAverages,
      };
    });

    if (sort === "rating") {
      enriched.sort((a, b) => b.avgRating - a.avgRating);
    } else if (sort === "reviews") {
      enriched.sort((a, b) => b.reviewCount - a.reviewCount);
    } else {
      enriched.sort((a, b) => a.name.localeCompare(b.name));
    }

    return NextResponse.json(enriched);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch universities" }, { status: 500 });
  }
}

function avgField(nums: number[]) {
  if (nums.length === 0) return 0;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 10) / 10;
}
