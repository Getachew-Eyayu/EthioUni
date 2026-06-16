import { PrismaClient } from "@prisma/client";

const passwords = [
  "postgres",
  "password",
  "admin",
  "123456",
  "root",
  "Postgres",
  "1234",
  "",
];

for (const password of passwords) {
  const url = `postgresql://postgres:${password}@localhost:5432/postgres?schema=public`;
  process.env.DATABASE_URL = url;
  const prisma = new PrismaClient();
  try {
    await prisma.$connect();
    console.log("SUCCESS password:", password === "" ? "(empty)" : password);
    await prisma.$disconnect();
    process.exit(0);
  } catch {
    await prisma.$disconnect().catch(() => {});
  }
}

console.log("No working password found");
process.exit(1);
