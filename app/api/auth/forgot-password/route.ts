import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { resetPasswordSchema, newPasswordSchema } from "@/lib/validations";
import { jsonError } from "@/lib/api-helpers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body.token && body.password) {
      const parsed = newPasswordSchema.safeParse(body);
      if (!parsed.success) {
        return jsonError(parsed.error.errors[0]?.message || "Invalid data");
      }

      const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token: parsed.data.token },
      });

      if (!resetToken || resetToken.expires < new Date()) {
        return jsonError("Invalid or expired token", 400);
      }

      const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

      await prisma.$transaction([
        prisma.user.update({
          where: { id: resetToken.userId },
          data: { password: hashedPassword },
        }),
        prisma.passwordResetToken.delete({ where: { id: resetToken.id } }),
      ]);

      return NextResponse.json({ message: "Password reset successful" });
    }

    const parsed = resetPasswordSchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message || "Invalid email");
    }

    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString("hex");
      const expires = new Date(Date.now() + 60 * 60 * 1000);

      await prisma.passwordResetToken.upsert({
        where: { userId: user.id },
        create: { token, expires, userId: user.id },
        update: { token, expires },
      });

      await sendPasswordResetEmail(user.email, token);
    }

    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
