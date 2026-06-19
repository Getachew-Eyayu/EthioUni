import { PrismaAdapter } from "@auth/prisma-adapter";
import { authConfig } from "./auth.config";
import { prisma } from "./prisma";
import NextAuth from "next-auth";

export const { handlers, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
});
