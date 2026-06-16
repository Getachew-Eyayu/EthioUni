import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/api-helpers";

export async function GET() {
  const { error } = await requireRole(["ADMIN", "MODERATOR"]);
  if (error) return error;

  const [userCount, universityCount, reviewCount, complaintCount, pendingComplaints, pendingReports] =
    await Promise.all([
      prisma.user.count(),
      prisma.university.count(),
      prisma.review.count(),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "PENDING" } }),
      prisma.reviewReport.count({ where: { status: "PENDING" } }),
    ]);

  const topUniversities = await prisma.university.findMany({
    include: {
      ratings: { select: { overall: true } },
      _count: { select: { reviews: true } },
    },
    take: 5,
  });

  const ranked = topUniversities
    .map((u) => ({
      id: u.id,
      name: u.name,
      slug: u.slug,
      avgRating:
        u.ratings.length > 0
          ? u.ratings.reduce((s, r) => s + r.overall, 0) / u.ratings.length
          : 0,
      reviewCount: u._count.reviews,
    }))
    .sort((a, b) => b.avgRating - a.avgRating);

  return NextResponse.json({
    stats: {
      users: userCount,
      universities: universityCount,
      reviews: reviewCount,
      complaints: complaintCount,
      pendingComplaints,
      pendingReports,
    },
    topUniversities: ranked,
  });
}
