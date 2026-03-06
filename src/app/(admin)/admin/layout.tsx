import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col">
        <div className="p-6 border-b border-neutral-200">
          <Link href="/admin" className="font-bold text-lg text-neutral-900">
            Admin Panel
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/products", label: "Products" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-neutral-200">
          <Link
            href="/products"
            className="block px-4 py-2 rounded-lg text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
          >
            ← Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
