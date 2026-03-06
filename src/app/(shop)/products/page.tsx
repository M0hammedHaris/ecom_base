import { ProductGrid } from "@/components/product/product-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getProducts } from "@/lib/actions/products";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our full product catalog.",
};

const CATEGORIES = ["All", "Clothing", "Electronics", "Home & Garden", "Sports"];

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    featured?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const category =
    params.category && params.category !== "all"
      ? params.category
      : undefined;
  const search = params.search;
  const featured = params.featured === "true" ? true : undefined;

  const products = await getProducts({ category, search, featured });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            {search ? `Search: "${search}"` : category ?? "All Products"}
          </h1>
          <p className="mt-1 text-neutral-500">
            {products.length} product{products.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {/* Search */}
        <form className="flex w-full max-w-sm items-center gap-2">
          <Input
            name="search"
            placeholder="Search products..."
            defaultValue={search}
            className="flex-1"
          />
          <Button type="submit" size="icon" variant="outline">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
        </form>
      </div>

      {/* Category Filters */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const catParam = cat === "All" ? undefined : cat.toLowerCase();
          const isActive =
            cat === "All" ? !category : category === cat.toLowerCase();
          return (
            <Button
              key={cat}
              asChild
              variant={isActive ? "default" : "outline"}
              size="sm"
            >
              <Link
                href={
                  catParam
                    ? `/products?category=${catParam}`
                    : "/products"
                }
              >
                {cat}
              </Link>
            </Button>
          );
        })}
        {featured !== undefined && (
          <Badge variant="secondary" className="flex items-center gap-1 px-3">
            Featured only
            <Link href="/products" className="ml-1 hover:underline">
              ✕
            </Link>
          </Badge>
        )}
      </div>

      {/* Product Grid */}
      <ProductGrid products={products} />
    </div>
  );
}
