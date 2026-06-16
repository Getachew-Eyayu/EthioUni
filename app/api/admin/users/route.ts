import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError } from "@/lib/api-helpers";

export async function GET() {
  const { error } = await requireRole(["ADMIN", "MODERATOR"]);
  if (error) return error;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: { select: { reviews: true, ratings: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}

export async function PATCH(req: Request) {
  const { error } = await requireRole(["ADMIN"]);
  if (error) return error;

  const { userId, role } = await req.json();
  if (!userId || !role) return jsonError("userId and role are required");

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: { id: true, name: true, email: true, role: true },
  });

  return NextResponse.json(user);
}
