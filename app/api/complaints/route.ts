import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { complaintSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const all = searchParams.get("all") === "true";

  const isAdmin = user!.role === "ADMIN" || user!.role === "MODERATOR";

  const complaints = await prisma.complaint.findMany({
    where: all && isAdmin ? {} : { userId: user!.id },
    include: {
      university: { select: { id: true, name: true, slug: true } },
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(complaints);
}

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = complaintSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message || "Invalid complaint");
  }

  const complaint = await prisma.complaint.create({
    data: {
      ...parsed.data,
      userId: user!.id,
    },
    include: {
      university: { select: { id: true, name: true, slug: true } },
    },
  });

  return NextResponse.json(complaint, { status: 201 });
}
