"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, MessageSquare, AlertTriangle } from "lucide-react";

type Analytics = {
  stats: {
    users: number;
    universities: number;
    reviews: number;
    complaints: number;
    pendingComplaints: number;
    pendingReports: number;
  };
  topUniversities: {
    id: string;
    name: string;
    slug: string;
    avgRating: number;
    reviewCount: number;
  }[];
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<Analytics | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) {
    return <div className="animate-pulse space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-lg bg-muted" />
        ))}
      </div>
    </div>;
  }

  const statCards = [
    { label: "Users", value: data.stats.users, icon: Users },
    { label: "Universities", value: data.stats.universities, icon: Building2 },
    { label: "Reviews", value: data.stats.reviews, icon: MessageSquare },
    {
      label: "Pending complaints",
      value: data.stats.pendingComplaints,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {data.stats.pendingReports > 0 && (
        <Card className="border-destructive/50">
          <CardContent className="py-4">
            <p className="text-sm">
              <span className="font-semibold">{data.stats.pendingReports}</span> review
              reports pending moderation.{" "}
              <Link href="/admin/reviews" className="text-primary hover:underline">
                Review now →
              </Link>
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Top rated universities</CardTitle>
        </CardHeader>
        <CardContent>
          {data.topUniversities.length === 0 ? (
            <p className="text-sm text-muted-foreground">No ratings yet.</p>
          ) : (
            <div className="space-y-3">
              {data.topUniversities.map((uni, i) => (
                <div key={uni.id} className="flex items-center justify-between text-sm">
                  <span>
                    <span className="mr-2 font-bold text-muted-foreground">{i + 1}.</span>
                    <Link href={`/universities/${uni.slug}`} className="hover:text-primary">
                      {uni.name}
                    </Link>
                  </span>
                  <span className="text-muted-foreground">
                    {uni.avgRating.toFixed(1)} · {uni.reviewCount} reviews
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
