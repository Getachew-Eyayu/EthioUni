import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { profileSchema } from "@/lib/validations";

export async function GET() {
  const { error, user } = await requireAuth();
  if (error) return error;

  const profile = await prisma.user.findUnique({
    where: { id: user!.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      _count: {
        select: { reviews: true, ratings: true, complaints: true },
      },
    },
  });

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message || "Invalid data");
  }

  const updated = await prisma.user.update({
    where: { id: user!.id },
    data: {
      name: parsed.data.name,
      ...(parsed.data.image ? { image: parsed.data.image } : {}),
    },
    select: { id: true, name: true, email: true, image: true, role: true },
  });

  return NextResponse.json(updated);
}
