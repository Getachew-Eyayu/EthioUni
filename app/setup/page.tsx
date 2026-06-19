import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Provider Setup Instructions</h1>
      <div className="mt-4 space-y-4">
        <div>
          <h2 className="text-xl font-semibold">1. Environment Variables</h2>
          <p>Copy .env.example to .env.local and fill in your values</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">2. Database Setup</h2>
          <p>Run: npm run db:push</p>
        </div>
        <div>
          <h2 className="text-xl font-semibold">3. NextAuth Setup</h2>
          <p>Generate secret: openssl rand -base64 32</p>
        </div>
      </div>
    </div>
  );
}
