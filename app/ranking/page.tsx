import Link from "next/link";
import Image from "next/image";
import { Star, Trophy, Medal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

async function getRankings() {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/universities?sort=rating`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

function RankIcon({ rank }: { rank: number }) {
  if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
  if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
  if (rank === 3) return <Medal className="h-5 w-5 text-amber-700" />;
  return <span className="w-5 text-center font-bold text-muted-foreground">{rank}</span>;
}

export default async function RankingPage() {
  const universities = await getRankings();
  const ranked = universities.filter(
    (u: { avgRating: number }) => u.avgRating > 0
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">University Rankings</h1>
        <p className="text-muted-foreground">
          Top Ethiopian universities ranked by student ratings
        </p>
      </div>

      {ranked.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No rated universities yet. Be the first to rate a university!
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {ranked.map(
            (
              uni: {
                id: string;
                name: string;
                slug: string;
                logo: string | null;
                location: string;
                region: string;
                type: string;
                avgRating: number;
                ratingCount: number;
                reviewCount: number;
              },
              index: number
            ) => {
              const rank = index + 1;
              return (
                <Card
                  key={uni.id}
                  className={rank <= 3 ? "border-primary/30 bg-primary/5" : ""}
                >
                  <CardContent className="flex items-center gap-4 py-4">
                    <div className="flex w-8 shrink-0 justify-center">
                      <RankIcon rank={rank} />
                    </div>
                    {uni.logo ? (
                      <Image
                        src={uni.logo}
                        alt={uni.name}
                        width={48}
                        height={48}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 font-bold text-primary">
                        {uni.name.charAt(0)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/universities/${uni.slug}`}
                        className="font-semibold hover:text-primary"
                      >
                        {uni.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {uni.location}, {uni.region}
                      </p>
                    </div>
                    <Badge variant={uni.type === "PUBLIC" ? "default" : "secondary"}>
                      {uni.type}
                    </Badge>
                    <div className="hidden text-right sm:block">
                      <div className="flex items-center gap-1 font-bold">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {uni.avgRating.toFixed(1)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {uni.ratingCount} ratings · {uni.reviewCount} reviews
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          )}
        </div>
      )}
    </div>
  );
}
