import { Separator } from "@/components/ui/separator";
import { Store } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-3">
            <Link href="/" className="flex items-center gap-2 font-bold text-lg">
              <Store className="h-5 w-5" />
              <span>EcomBase</span>
            </Link>
            <p className="text-sm text-neutral-500">
              Production-ready e-commerce built with Next.js 16, React 19, and
              Drizzle ORM.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Shop</h4>
            <ul className="space-y-2">
              {[
                { href: "/products", label: "All Products" },
                { href: "/products?category=clothing", label: "Clothing" },
                { href: "/products?category=electronics", label: "Electronics" },
                { href: "/products?featured=true", label: "Featured" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Company</h4>
            <ul className="space-y-2">
              {[
                { href: "#", label: "About" },
                { href: "#", label: "Blog" },
                { href: "#", label: "Careers" },
                { href: "#", label: "Contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Legal</h4>
            <ul className="space-y-2">
              {[
                { href: "#", label: "Privacy Policy" },
                { href: "#", label: "Terms of Service" },
                { href: "#", label: "Cookie Policy" },
                { href: "#", label: "Refund Policy" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} EcomBase. All rights reserved.
          </p>
          <p className="text-sm text-neutral-400">
            Built with Next.js 16 · React 19 · Tailwind CSS 4 · Drizzle ORM
          </p>
        </div>
      </div>
    </footer>
  );
}
