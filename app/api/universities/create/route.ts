import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole, jsonError } from "@/lib/api-helpers";
import { universitySchema } from "@/lib/validations";
import { slugify } from "@/lib/utils";

export async function POST(req: Request) {
  const { error } = await requireRole(["ADMIN"]);
  if (error) return error;

  try {
    const body = await req.json();
    const parsed = universitySchema.safeParse(body);
    if (!parsed.success) {
      return jsonError(parsed.error.errors[0]?.message || "Invalid data");
    }

    const data = parsed.data;
    const slug = slugify(data.name);

    const university = await prisma.university.create({
      data: {
        ...data,
        slug,
        website: data.website || null,
      },
    });

    return NextResponse.json(university, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create university" }, { status: 500 });
  }
}
