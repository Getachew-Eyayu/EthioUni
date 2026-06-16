"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Star, MapPin, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RATING_CATEGORIES } from "@/lib/utils";

type University = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  location: string;
  region: string;
  type: string;
  programs: string[];
  avgRating: number;
  ratingCount: number;
  reviewCount: number;
  categoryAverages: Record<string, number> | null;
};

function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids") || "";
  const [selectedIds, setSelectedIds] = useState<string[]>(
    idsParam ? idsParam.split(",").filter(Boolean).slice(0, 4) : []
  );
  const [universities, setUniversities] = useState<University[]>([]);
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/universities")
      .then((res) => res.json())
      .then(setAllUniversities);
  }, []);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setUniversities([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetch(`/api/universities?ids=${selectedIds.join(",")}`)
      .then((res) => res.json())
      .then((data) => {
        setUniversities(data);
        setLoading(false);
      });
  }, [selectedIds]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedIds.length) params.set("ids", selectedIds.join(","));
    router.replace(`/compare?${params.toString()}`, { scroll: false });
  }, [selectedIds, router]);

  function addUniversity(id: string) {
    if (selectedIds.includes(id) || selectedIds.length >= 4) return;
    setSelectedIds([...selectedIds, id]);
  }

  function removeUniversity(id: string) {
    setSelectedIds(selectedIds.filter((i) => i !== id));
  }

  const available = allUniversities.filter((u) => !selectedIds.includes(u.id));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Compare Universities</h1>
        <p className="text-muted-foreground">
          Select up to 4 universities to compare side by side
        </p>
      </div>

      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div className="min-w-[240px] flex-1">
          <Select
            onValueChange={addUniversity}
            disabled={selectedIds.length >= 4}
          >
            <SelectTrigger>
              <SelectValue placeholder="Add a university..." />
            </SelectTrigger>
            <SelectContent>
              {available.map((u) => (
                <SelectItem key={u.id} value={u.id}>
                  {u.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {selectedIds.length > 0 && (
          <Button variant="outline" onClick={() => setSelectedIds([])}>
            Clear all
          </Button>
        )}
      </div>

      {selectedIds.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {selectedIds.map((id) => {
            const uni = allUniversities.find((u) => u.id === id);
            return (
              <Badge key={id} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1">
                {uni?.name || id}
                <button
                  type="button"
                  onClick={() => removeUniversity(id)}
                  className="ml-1 rounded-full p-0.5 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : selectedIds.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <Plus className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">
              Add universities from the dropdown above to start comparing
            </p>
            <Button asChild variant="outline">
              <Link href="/universities">Browse universities</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="overflow-x-auto">
            <div
              className="grid gap-4"
              style={{
                gridTemplateColumns: `repeat(${universities.length}, minmax(220px, 1fr))`,
              }}
            >
              {universities.map((uni) => (
                <Card key={uni.id}>
                  <CardHeader className="text-center">
                    {uni.logo ? (
                      <Image
                        src={uni.logo}
                        alt={uni.name}
                        width={64}
                        height={64}
                        className="mx-auto rounded-lg object-cover"
                      />
                    ) : (
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-lg bg-primary/10 text-2xl font-bold text-primary">
                        {uni.name.charAt(0)}
                      </div>
                    )}
                    <CardTitle className="text-base">
                      <Link href={`/universities/${uni.slug}`} className="hover:text-primary">
                        {uni.name}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {uni.location}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Type</span>
                      <Badge variant="outline">{uni.type}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Region</span>
                      <span>{uni.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Overall rating</span>
                      <span className="flex items-center gap-1 font-bold">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {uni.avgRating > 0 ? uni.avgRating.toFixed(1) : "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ratings</span>
                      <span>{uni.ratingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reviews</span>
                      <span>{uni.reviewCount}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Programs</span>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {uni.programs.slice(0, 4).map((p) => (
                          <Badge key={p} variant="secondary" className="text-xs">
                            {p}
                          </Badge>
                        ))}
                        {uni.programs.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{uni.programs.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Rating categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="py-2 text-left font-medium">Category</th>
                      {universities.map((u) => (
                        <th key={u.id} className="px-4 py-2 text-center font-medium">
                          {u.name.split(" ")[0]}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {RATING_CATEGORIES.map(({ key, label }) => (
                      <tr key={key} className="border-b">
                        <td className="py-2">{label}</td>
                        {universities.map((u) => (
                          <td key={u.id} className="px-4 py-2 text-center">
                            {u.categoryAverages?.[key]
                              ? u.categoryAverages[key].toFixed(1)
                              : "N/A"}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
      <CompareContent />
    </Suspense>
  );
}
