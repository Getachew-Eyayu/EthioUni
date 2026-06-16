"use client";

import Link from "next/link";
import Image from "next/image";
import { Star, MapPin, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type University = {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  location: string;
  region: string;
  type: "PUBLIC" | "PRIVATE";
  description: string | null;
  website: string | null;
  programs: string[];
  avgRating: number;
  ratingCount: number;
  reviewCount: number;
};

export function UniversityCard({ university }: { university: University }) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          {university.logo ? (
            <Image
              src={university.logo}
              alt={university.name}
              width={48}
              height={48}
              className="rounded-lg object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-lg font-bold text-primary">
              {university.name.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <CardTitle className="text-lg">
              <Link href={`/universities/${university.slug}`} className="hover:text-primary">
                {university.name}
              </Link>
            </CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {university.location}, {university.region}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex flex-wrap gap-2">
          <Badge variant={university.type === "PUBLIC" ? "default" : "secondary"}>
            {university.type}
          </Badge>
          {university.avgRating > 0 && (
            <Badge variant="outline" className="gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {university.avgRating.toFixed(1)} ({university.ratingCount})
            </Badge>
          )}
        </div>
        {university.description && (
          <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
            {university.description}
          </p>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{university.reviewCount} reviews</span>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-primary hover:underline"
            >
              Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
