import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError } from "@/lib/api-helpers";

export async function GET() {
  const { error } = await requireRole(["ADMIN", "MODERATOR"]);
  if (error) return error;

  const reports = await prisma.reviewReport.findMany({
    where: { status: "PENDING" },
    include: {
      review: {
        include: {
          user: { select: { id: true, name: true } },
          university: { select: { id: true, name: true, slug: true } },
        },
      },
      user: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(reports);
}

export async function PATCH(req: Request) {
  const { error } = await requireRole(["ADMIN", "MODERATOR"]);
  if (error) return error;

  const { reportId, status, hideReview } = await req.json();
  if (!reportId) return jsonError("reportId is required");

  const report = await prisma.reviewReport.update({
    where: { id: reportId },
    data: { status: status || "REVIEWED" },
  });

  if (hideReview) {
    await prisma.review.update({
      where: { id: report.reviewId },
      data: { isHidden: true },
    });
  }

  return NextResponse.json(report);
}
