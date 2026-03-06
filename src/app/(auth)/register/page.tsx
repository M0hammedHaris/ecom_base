import { RegisterForm } from "@/components/auth/register-form";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create Account",
  description: "Create a new EcomBase account.",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-neutral-900">
            Create an Account
          </h1>
          <p className="mt-2 text-neutral-500">
            Join EcomBase to track orders and save your preferences.
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-8">
          <RegisterForm />
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
