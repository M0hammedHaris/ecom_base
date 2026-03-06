import { ProductDetail } from "@/components/product/product-detail";
import { ProductGrid } from "@/components/product/product-grid";
import { getProductBySlug, getProducts } from "@/lib/actions/products";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at EcomBase.`,
    openGraph: {
      title: product.name,
      description: product.description || `Buy ${product.name} at EcomBase.`,
      images: product.imageUrl ? [{ url: product.imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getProducts({
    category: product.category,
    limit: 4,
  });
  const filtered = relatedProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetail product={product} />

      {filtered.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold text-neutral-900">
            Related Products
          </h2>
          <ProductGrid products={filtered} />
        </section>
      )}
    </div>
  );
}
