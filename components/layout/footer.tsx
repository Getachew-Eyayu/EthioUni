import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/30">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-3 font-bold text-primary">EthioUni</h3>
            <p className="text-sm text-muted-foreground">
              Discover, rate, review, and compare Ethiopian universities.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Explore</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/universities">Universities</Link></li>
              <li><Link href="/ranking">Rankings</Link></li>
              <li><Link href="/compare">Compare</Link></li>
              <li><Link href="/map">Map</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/auth/login">Sign in</Link></li>
              <li><Link href="/auth/register">Sign up</Link></li>
              <li><Link href="/profile">Profile</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/complaints">Track Complaints</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} EthioUni. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
