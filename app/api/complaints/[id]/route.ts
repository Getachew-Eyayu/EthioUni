import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError } from "@/lib/api-helpers";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { error } = await requireRole(["ADMIN", "MODERATOR"]);
  if (error) return error;

  const { id } = await params;
  const { status, adminNotes } = await req.json();

  const validStatuses = ["PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"];
  if (status && !validStatuses.includes(status)) {
    return jsonError("Invalid status");
  }

  const complaint = await prisma.complaint.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(adminNotes !== undefined ? { adminNotes } : {}),
    },
  });

  return NextResponse.json(complaint);
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const complaint = await prisma.complaint.findUnique({
    where: { id },
    include: {
      university: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, name: true } },
    },
  });

  if (!complaint) return jsonError("Complaint not found", 404);
  return NextResponse.json(complaint);
}
