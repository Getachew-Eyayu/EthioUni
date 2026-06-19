import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  verificationUrl: string
) {
  try {
    await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: `<a href="${verificationUrl}">Verify your email</a>`,
    });
  } catch (error) {
    console.error("Failed to send verification email:", error);
    throw error;
  }
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string
) {
  try {
    await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Reset your password",
      html: `<a href="${resetUrl}">Reset your password</a>`,
    });
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    throw error;
  }
}
