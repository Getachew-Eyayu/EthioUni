import Link from "next/link";
import { ArrowRight, BarChart3, MapPin, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Star,
    title: "Rate & Review",
    description: "Share your experience across 9 rating categories and write detailed reviews.",
  },
  {
    icon: BarChart3,
    title: "Compare Universities",
    description: "Side-by-side comparison of ratings, programs, and student feedback.",
  },
  {
    icon: MapPin,
    title: "Interactive Map",
    description: "Explore all Ethiopian universities on an interactive map by region.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Real student reviews, complaints tracking, and AI-powered summaries.",
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-20 md:py-32">
        <div className="container mx-auto px-4 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Discover Ethiopian
            <span className="text-primary"> Universities</span>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-muted-foreground">
            EthioUni is your platform to discover, rate, review, compare, and submit
            complaints about universities across Ethiopia.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/universities">
                Explore Universities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/ranking">View Rankings</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16">
        <h2 className="mb-10 text-center text-3xl font-bold">Why EthioUni?</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to share your experience?</h2>
          <p className="mb-8 text-muted-foreground">
            Join thousands of students helping others choose the right university.
          </p>
          <Button size="lg" asChild>
            <Link href="/auth/register">Create Free Account</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
