import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, ExternalLink, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RatingForm } from "@/components/university/rating-form";
import { ReviewSection } from "@/components/university/review-section";
import { RATING_CATEGORIES } from "@/lib/utils";

async function getUniversity(slug: string) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/universities/${slug}`, { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function UniversityDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const university = await getUniversity(slug);
  if (!university) notFound();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-start">
        {university.logo ? (
          <Image
            src={university.logo}
            alt={university.name}
            width={96}
            height={96}
            className="rounded-xl object-cover"
          />
        ) : (
          <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-primary/10 text-3xl font-bold text-primary">
            {university.name.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{university.name}</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            {university.location}, {university.region}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Badge>{university.type}</Badge>
            {university.categoryAverages && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {university.categoryAverages.overall.toFixed(1)} overall
              </Badge>
            )}
          </div>
          {university.website && (
            <a
              href={university.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              Visit Website <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        <Button variant="outline" asChild>
          <Link href={`/compare?ids=${university.id}`}>Compare</Link>
        </Button>
      </div>

      {university.description && (
        <p className="mb-8 text-muted-foreground">{university.description}</p>
      )}

      {university.programs?.length > 0 && (
        <div className="mb-8">
          <h2 className="mb-3 text-lg font-semibold">Programs Offered</h2>
          <div className="flex flex-wrap gap-2">
            {university.programs.map((program: string) => (
              <Badge key={program} variant="secondary">{program}</Badge>
            ))}
          </div>
        </div>
      )}

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList>
          <TabsTrigger value="reviews">Reviews ({university.reviewCount})</TabsTrigger>
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="rate">Rate</TabsTrigger>
          <TabsTrigger value="summary">AI Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ReviewSection
            universityId={university.id}
            initialReviews={university.reviews}
          />
        </TabsContent>

        <TabsContent value="ratings">
          {university.categoryAverages ? (
            <div className="grid gap-4 md:grid-cols-3">
              {RATING_CATEGORIES.map(({ key, label }) => (
                <Card key={key}>
                  <CardContent className="flex items-center justify-between pt-6">
                    <span>{label}</span>
                    <span className="flex items-center gap-1 font-bold">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {(university.categoryAverages as Record<string, number>)[key]?.toFixed(1)}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No ratings yet.</p>
          )}
        </TabsContent>

        <TabsContent value="rate">
          <Card>
            <CardHeader>
              <CardTitle>Rate this University</CardTitle>
            </CardHeader>
            <CardContent>
              <RatingForm universityId={university.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary">
          <Card>
            <CardHeader>
              <CardTitle>AI Review Summary</CardTitle>
            </CardHeader>
            <CardContent>
              {university.aiSummary ? (
                <p>{university.aiSummary.summary}</p>
              ) : (
                <p className="text-muted-foreground">
                  No AI summary available yet. Summaries are generated from student reviews.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
