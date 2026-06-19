export async function generateMetadata() {
  return {
    title: "Authentication",
    description: "Sign in to EthioUni",
  };
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex h-screen items-center justify-center">{children}</div>;
}
