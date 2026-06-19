import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authConfig = {
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request: { pathname } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = pathname.startsWith("/dashboard");
      if (isOnProtectedRoute && !isLoggedIn) return false;
      return true;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validate credentials here
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
