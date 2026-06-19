// This is a placeholder for Prisma seed file
// Uncomment and customize as needed

// import { prisma } from "@/lib/prisma";

// async function main() {
//   try {
//     // Add sample universities
//     const addisAbaba = await prisma.university.upsert({
//       where: { slug: "addis-ababa-university" },
//       update: {},
//       create: {
//         name: "Addis Ababa University",
//         slug: "addis-ababa-university",
//         location: "Addis Ababa",
//         region: "Addis Ababa",
//         type: "PUBLIC",
//         programs: ["Engineering", "Medicine", "Law"],
//       },
//     });

//     console.log("✓ Seeded database with:", addisAbaba);
//   } catch (error) {
//     console.error("Error seeding database:", error);
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();

export {};
