"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: string;
  adminNotes: string | null;
  university: { id: string; name: string; slug: string };
};

const statusColors: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  PENDING: "secondary",
  IN_REVIEW: "default",
  RESOLVED: "outline",
  REJECTED: "destructive",
};

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/complaints")
      .then((res) => res.json())
      .then((data) => {
        setComplaints(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">My Complaints</h1>
          <p className="text-muted-foreground">
            Track the status of complaints you&apos;ve submitted
          </p>
        </div>
        <Button asChild>
          <Link href="/complaints/new">
            <Plus className="h-4 w-4" />
            New complaint
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-muted-foreground">
              You haven&apos;t submitted any complaints yet.
            </p>
            <Button asChild>
              <Link href="/complaints/new">Submit a complaint</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {complaints.map((c) => (
            <Card key={c.id}>
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <CardTitle className="text-lg">{c.title}</CardTitle>
                  <Badge variant={statusColors[c.status] || "secondary"}>
                    {c.status.replace("_", " ")}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  <Link
                    href={`/universities/${c.university.slug}`}
                    className="hover:text-primary"
                  >
                    {c.university.name}
                  </Link>
                  {" · "}
                  {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                </p>
              </CardHeader>
              <CardContent>
                <Badge variant="outline" className="mb-2">
                  {c.category}
                </Badge>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {c.description}
                </p>
                {c.adminNotes && (
                  <div className="mt-3 rounded-md bg-muted p-3 text-sm">
                    <p className="font-medium">Admin response</p>
                    <p className="text-muted-foreground">{c.adminNotes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
