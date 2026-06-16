import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = req.auth?.user?.role;

  const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ];
  const protectedRoutes = ["/profile", "/complaints"];
  const adminRoutes = ["/admin"];

  if (authRoutes.some((r) => pathname.startsWith(r)) && isLoggedIn) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (
    protectedRoutes.some((r) => pathname.startsWith(r)) &&
    !isLoggedIn
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (role !== "ADMIN" && role !== "MODERATOR") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/profile/:path*",
    "/complaints/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/auth/reset-password",
  ],
};
