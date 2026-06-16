"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, MessageSquare, Flag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type Review = {
  id: string;
  content: string;
  likes: number;
  createdAt: string;
  user: { id: string; name: string; image: string | null };
  replies: Array<{
    id: string;
    content: string;
    createdAt: string;
    user: { id: string; name: string; image: string | null };
  }>;
  _count: { reviewLikes: number };
};

export function ReviewSection({
  universityId,
  initialReviews,
}: {
  universityId: string;
  initialReviews: Review[];
}) {
  const { data: session } = useSession();
  const [reviews, setReviews] = useState(initialReviews);
  const [content, setContent] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, universityId }),
    });

    if (res.ok) {
      const review = await res.json();
      setReviews([review, ...reviews]);
      setContent("");
    }
    setLoading(false);
  };

  const toggleLike = async (reviewId: string) => {
    const res = await fetch(`/api/reviews/${reviewId}/like`, { method: "POST" });
    if (res.ok) {
      const { liked } = await res.json();
      setReviews(reviews.map((r) =>
        r.id === reviewId
          ? { ...r, likes: liked ? r.likes + 1 : r.likes - 1 }
          : r
      ));
    }
  };

  const submitReply = async (reviewId: string) => {
    if (!replyContent.trim()) return;
    const res = await fetch("/api/reviews/reply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, reviewId }),
    });

    if (res.ok) {
      const reply = await res.json();
      setReviews(reviews.map((r) =>
        r.id === reviewId ? { ...r, replies: [...r.replies, reply] } : r
      ));
      setReplyContent("");
      setReplyTo(null);
    }
  };

  const reportReview = async (reviewId: string) => {
    const reason = prompt("Why are you reporting this review?");
    if (!reason) return;
    await fetch("/api/reviews/report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviewId, reason }),
    });
    alert("Review reported. Thank you.");
  };

  return (
    <div className="space-y-6">
      {session && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Write a Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submitReview} className="space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your experience..."
                className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                required
                minLength={10}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Posting..." : "Post Review"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {reviews.length === 0 ? (
        <p className="text-muted-foreground">No reviews yet. Be the first!</p>
      ) : (
        reviews.map((review) => (
          <Card key={review.id}>
            <CardContent className="pt-6">
              <div className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-medium">{review.user.name}</span>
                  <span className="ml-2 text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
              <p className="mb-3">{review.content}</p>
              <div className="flex gap-2">
                {session && (
                  <>
                    <Button variant="ghost" size="sm" onClick={() => toggleLike(review.id)}>
                      <Heart className="mr-1 h-4 w-4" /> {review.likes}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setReplyTo(review.id)}>
                      <MessageSquare className="mr-1 h-4 w-4" /> Reply
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => reportReview(review.id)}>
                      <Flag className="mr-1 h-4 w-4" /> Report
                    </Button>
                  </>
                )}
              </div>

              {review.replies.length > 0 && (
                <div className="mt-4 space-y-2 border-l-2 pl-4">
                  {review.replies.map((reply) => (
                    <div key={reply.id} className="text-sm">
                      <span className="font-medium">{reply.user.name}</span>
                      <span className="ml-2 text-muted-foreground">
                        {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                      <p className="mt-1">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {replyTo === review.id && session && (
                <div className="mt-3 flex gap-2">
                  <Input
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                  />
                  <Button size="sm" onClick={() => submitReply(review.id)}>Send</Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
