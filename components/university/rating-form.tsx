"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RATING_CATEGORIES } from "@/lib/utils";

export function RatingForm({ universityId }: { universityId: string }) {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  if (!session) {
    return (
      <p className="text-sm text-muted-foreground">
        <a href="/auth/login" className="text-primary hover:underline">Sign in</a> to rate this university.
      </p>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/ratings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ universityId, ...ratings }),
    });

    const data = await res.json();
    setLoading(false);
    setMessage(res.ok ? "Rating submitted!" : data.error || "Failed to submit");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {RATING_CATEGORIES.map(({ key, label }) => (
        <div key={key} className="flex items-center justify-between">
          <Label>{label}</Label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRatings((prev) => ({ ...prev, [key]: n }))}
                className="p-0.5"
              >
                <Star
                  className={`h-5 w-5 ${
                    (ratings[key] || 0) >= n
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      ))}
      <Button type="submit" disabled={loading || Object.keys(ratings).length < 9}>
        {loading ? "Submitting..." : "Submit Rating"}
      </Button>
      {message && <p className="text-sm text-muted-foreground">{message}</p>}
    </form>
  );
}
