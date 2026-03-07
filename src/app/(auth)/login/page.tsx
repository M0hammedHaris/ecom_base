import { LoginForm } from "@/components/auth/login-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your EcomBase account.",
};

export default function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">Welcome Back</h1>
          <p className="mt-2 text-neutral-500">
            Sign in to access your account and orders.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <LoginForm />
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          <Link href="/products" className="hover:underline">
            ← Continue browsing
          </Link>
        </p>
      </div>
    </div>
  );
}
