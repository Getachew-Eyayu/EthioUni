import { execSync } from "child_process";
import { PrismaClient } from "@prisma/client";

const candidates = [
  process.env.DATABASE_URL,
  "postgresql://postgres:postgres@localhost:5432/ethiouni?schema=public",
  "postgresql://postgres:@localhost:5432/ethiouni?schema=public",
  "postgresql://user:password@localhost:5432/ethiouni?schema=public",
].filter(Boolean);

for (const url of candidates) {
  process.env.DATABASE_URL = url;
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("OK:", url.replace(/:[^:@/]+@/, ":****@"));
    await prisma.$disconnect();
    execSync("npx prisma db push", { stdio: "inherit", env: process.env });
    execSync("npm run db:seed", { stdio: "inherit", env: process.env });
    process.exit(0);
  } catch (err) {
    console.log("FAIL:", url.replace(/:[^:@/]+@/, ":****@"), "-", err.message?.split("\n")[0]);
    await prisma.$disconnect().catch(() => {});
  }
}

process.exit(1);
