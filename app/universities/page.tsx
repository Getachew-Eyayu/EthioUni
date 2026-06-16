import { Suspense } from "react";
import { UniversityCard } from "@/components/university/university-card";
import { UniversityFilters } from "@/components/university/university-filters";

async function getUniversities(searchParams: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  if (searchParams.search) params.set("search", searchParams.search);
  if (searchParams.region) params.set("region", searchParams.region);
  if (searchParams.type) params.set("type", searchParams.type);
  if (searchParams.sort) params.set("sort", searchParams.sort);

  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/universities?${params.toString()}`, {
    cache: "no-store",
  });

  if (!res.ok) return [];
  return res.json();
}

export default async function UniversitiesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const universities = await getUniversities(params);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Universities</h1>
        <p className="text-muted-foreground">
          Browse and discover Ethiopian universities
        </p>
      </div>

      <Suspense fallback={<div className="mb-6 h-16 animate-pulse rounded-lg bg-muted" />}>
        <UniversityFilters />
      </Suspense>

      {universities.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">
          No universities found. Try adjusting your filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni: Parameters<typeof UniversityCard>[0]["university"]) => (
            <UniversityCard key={uni.id} university={uni} />
          ))}
        </div>
      )}
    </div>
  );
}
