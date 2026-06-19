import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const universities = await prisma.university.findMany({
      take: 10,
      select: {
        id: true,
        name: true,
        slug: true,
        location: true,
        type: true,
      },
    });

    return NextResponse.json(universities);
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}
