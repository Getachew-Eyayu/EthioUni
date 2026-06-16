"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Complaint = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  adminNotes: string | null;
  createdAt: string;
  user: { id: string; name: string; email: string };
  university: { id: string; name: string; slug: string };
};

const STATUSES = ["PENDING", "IN_REVIEW", "RESOLVED", "REJECTED"];

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});

  function loadComplaints() {
    fetch("/api/complaints?all=true")
      .then((res) => res.json())
      .then(setComplaints);
  }

  useEffect(() => {
    loadComplaints();
  }, []);

  async function updateComplaint(id: string, status: string) {
    await fetch(`/api/complaints/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        adminNotes: notes[id] || undefined,
      }),
    });
    loadComplaints();
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Complaint management</h2>
      <p className="text-sm text-muted-foreground">
        {complaints.length} total complaint{complaints.length !== 1 ? "s" : ""}
      </p>

      {complaints.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No complaints submitted yet.
          </CardContent>
        </Card>
      ) : (
        complaints.map((c) => (
          <Card key={c.id}>
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <CardTitle className="text-base">{c.title}</CardTitle>
                <Badge>{c.status.replace("_", " ")}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                By {c.user.name} ({c.user.email}) ·{" "}
                {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                {" · "}
                <Link href={`/universities/${c.university.slug}`} className="hover:text-primary">
                  {c.university.name}
                </Link>
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline">{c.category}</Badge>
              <p className="text-sm text-muted-foreground">{c.description}</p>
              {c.adminNotes && (
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p className="font-medium">Previous admin notes</p>
                  <p className="text-muted-foreground">{c.adminNotes}</p>
                </div>
              )}
              <Textarea
                placeholder="Admin notes (optional)"
                value={notes[c.id] ?? c.adminNotes ?? ""}
                onChange={(e) => setNotes({ ...notes, [c.id]: e.target.value })}
                rows={2}
              />
              <div className="flex flex-wrap items-center gap-2">
                <Select
                  value={c.status}
                  onValueChange={(status) => updateComplaint(c.id, status)}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s.replace("_", " ")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateComplaint(c.id, c.status)}
                >
                  Save notes
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
