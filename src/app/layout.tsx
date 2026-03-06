import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EcomBase – Next.js 16+ E-commerce",
    template: "%s | EcomBase",
  },
  description:
    "Production-ready e-commerce built with Next.js 16, React 19, Tailwind CSS 4, and Drizzle ORM.",
  keywords: ["ecommerce", "nextjs", "react", "tailwindcss", "drizzle"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white antialiased">{children}</body>
    </html>
  );
}
