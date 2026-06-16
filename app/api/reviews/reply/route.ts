import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, jsonError } from "@/lib/api-helpers";
import { reviewReplySchema } from "@/lib/validations";

export async function POST(req: Request) {
  const { error, user } = await requireAuth();
  if (error) return error;

  const body = await req.json();
  const parsed = reviewReplySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message || "Invalid reply");
  }

  const reply = await prisma.reviewReply.create({
    data: {
      content: parsed.data.content,
      userId: user!.id,
      reviewId: parsed.data.reviewId,
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(reply, { status: 201 });
}
