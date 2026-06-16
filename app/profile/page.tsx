"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Star, AlertTriangle } from "lucide-react";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: string;
  emailVerified: string | null;
  createdAt: string;
  _count: { reviews: number; ratings: number; complaints: number };
};

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.id) {
          setProfile(data);
          setName(data.name);
          setImage(data.image || "");
        }
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, image: image || undefined }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }

    setMessage("Profile updated successfully");
    setProfile((p) => (p ? { ...p, name: data.name, image: data.image } : p));
    await update({ name: data.name, image: data.image });
  }

  if (!session) return null;

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-2 text-3xl font-bold">Profile</h1>
      <p className="mb-8 text-muted-foreground">Manage your account settings</p>

      {profile && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <Star className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile._count.ratings}</p>
                <p className="text-sm text-muted-foreground">Ratings</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <MessageSquare className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile._count.reviews}</p>
                <p className="text-sm text-muted-foreground">Reviews</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-3 pt-6">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <div>
                <p className="text-2xl font-bold">{profile._count.complaints}</p>
                <p className="text-sm text-muted-foreground">Complaints</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            {profile?.email}
            {profile?.emailVerified ? (
              <Badge className="ml-2" variant="secondary">Verified</Badge>
            ) : (
              <Badge className="ml-2" variant="outline">Unverified</Badge>
            )}
            {profile?.role !== "USER" && (
              <Badge className="ml-2">{profile?.role}</Badge>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </div>
            )}
            {message && (
              <div className="rounded-md bg-primary/10 px-3 py-2 text-sm text-primary">
                {message}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Avatar URL (optional)</Label>
              <Input
                id="image"
                type="url"
                placeholder="https://..."
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="mt-6">
        <Button variant="outline" asChild>
          <Link href="/complaints">View my complaints</Link>
        </Button>
      </div>
    </div>
  );
}
