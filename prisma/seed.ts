import { PrismaClient, UniversityType } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const universities = [
  {
    name: "Addis Ababa University",
    slug: "addis-ababa-university",
    website: "https://www.aau.edu.et",
    location: "Addis Ababa",
    region: "Addis Ababa",
    type: UniversityType.PUBLIC,
    description: "Ethiopia's oldest and largest university, founded in 1950.",
    programs: ["Medicine", "Engineering", "Law", "Business", "Social Sciences"],
    latitude: 9.032,
    longitude: 38.7469,
  },
  {
    name: "Jimma University",
    slug: "jimma-university",
    website: "https://www.ju.edu.et",
    location: "Jimma",
    region: "Oromia",
    type: UniversityType.PUBLIC,
    description: "Known for medicine, public health, and community-based education.",
    programs: ["Medicine", "Public Health", "Agriculture", "Engineering"],
    latitude: 7.6731,
    longitude: 36.8344,
  },
  {
    name: "Bahir Dar University",
    slug: "bahir-dar-university",
    website: "https://www.bdu.edu.et",
    location: "Bahir Dar",
    region: "Amhara",
    type: UniversityType.PUBLIC,
    description: "Major public university on the shores of Lake Tana.",
    programs: ["Engineering", "Textile", "Marine Science", "Education"],
    latitude: 11.5936,
    longitude: 37.3908,
  },
  {
    name: "Hawassa University",
    slug: "hawassa-university",
    website: "https://www.hu.edu.et",
    location: "Hawassa",
    region: "Sidama",
    type: UniversityType.PUBLIC,
    description: "Leading university in southern Ethiopia.",
    programs: ["Agriculture", "Medicine", "Business", "Natural Sciences"],
    latitude: 7.0621,
    longitude: 38.4764,
  },
  {
    name: "Mekelle University",
    slug: "mekelle-university",
    website: "https://www.mu.edu.et",
    location: "Mekelle",
    region: "Tigray",
    type: UniversityType.PUBLIC,
    description: "One of Ethiopia's largest public universities.",
    programs: ["Engineering", "Medicine", "Law", "Dryland Agriculture"],
    latitude: 13.4969,
    longitude: 39.4769,
  },
  {
    name: "St. Mary's University",
    slug: "st-marys-university",
    website: "https://www.smuc.edu.et",
    location: "Addis Ababa",
    region: "Addis Ababa",
    type: UniversityType.PRIVATE,
    description: "Private university offering business and technology programs.",
    programs: ["Business", "Computer Science", "Economics", "Law"],
    latitude: 8.9934,
    longitude: 38.7614,
  },
];

async function main() {
  const adminPassword = await bcrypt.hash("admin123456", 12);

  await prisma.user.upsert({
    where: { email: "admin@ethiouni.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@ethiouni.com",
      password: adminPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  for (const uni of universities) {
    await prisma.university.upsert({
      where: { slug: uni.slug },
      update: uni,
      create: uni,
    });
  }

  console.log("Seed complete: admin@ethiouni.com / admin123456 + 6 universities");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
