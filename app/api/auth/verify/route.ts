import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsonError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    if (!token) return jsonError("Token is required");

    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken || verificationToken.expires < new Date()) {
      return jsonError("Invalid or expired token", 400);
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: verificationToken.userId },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({ where: { id: verificationToken.id } }),
    ]);

    return NextResponse.json({ message: "Email verified successfully" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
