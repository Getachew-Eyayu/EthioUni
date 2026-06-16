"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Report = {
  id: string;
  reason: string;
  status: string;
  createdAt: string;
  user: { id: string; name: string };
  review: {
    id: string;
    content: string;
    user: { id: string; name: string };
    university: { id: string; name: string; slug: string };
  };
};

export default function AdminReviewsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  function loadReports() {
    fetch("/api/admin/reviews")
      .then((res) => res.json())
      .then(setReports);
  }

  useEffect(() => {
    loadReports();
  }, []);

  async function handleReport(reportId: string, hideReview: boolean) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status: "REVIEWED", hideReview }),
    });
    loadReports();
  }

  async function dismissReport(reportId: string) {
    await fetch("/api/admin/reviews", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reportId, status: "DISMISSED" }),
    });
    loadReports();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Review moderation</h2>
      <p className="text-sm text-muted-foreground">
        {reports.length} pending report{reports.length !== 1 ? "s" : ""}
      </p>

      {reports.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No pending review reports.
          </CardContent>
        </Card>
      ) : (
        reports.map((report) => (
          <Card key={report.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base">
                  Report by {report.user.name}
                </CardTitle>
                <Badge variant="secondary">PENDING</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(report.createdAt), { addSuffix: true })}
                {" · "}
                <Link
                  href={`/universities/${report.review.university.slug}`}
                  className="hover:text-primary"
                >
                  {report.review.university.name}
                </Link>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted p-3 text-sm">
                <p className="mb-1 font-medium">Reported review by {report.review.user.name}</p>
                <p className="text-muted-foreground">{report.review.content}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Reason</p>
                <p className="text-sm text-muted-foreground">{report.reason}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReport(report.id, true)}
                >
                  Hide review
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReport(report.id, false)}
                >
                  Mark reviewed
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => dismissReport(report.id)}
                >
                  Dismiss
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
