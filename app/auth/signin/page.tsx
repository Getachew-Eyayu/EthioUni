'use client';

import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="w-full max-w-md space-y-6 rounded-lg border border-gray-200 bg-white p-8 shadow">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold">Sign in to EthioUni</h1>
        <p className="text-gray-600">Welcome back</p>
      </div>

      <div className="space-y-4">
        <button className="w-full rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          Continue with Google
        </button>
        <button className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 hover:bg-gray-50">
          Continue with GitHub
        </button>
      </div>

      <p className="text-center text-sm text-gray-600">
        Don't have an account?{' '}
        <Link href="/auth/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
