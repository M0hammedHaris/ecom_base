import { ProductForm } from "@/components/product/product-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteProduct, getProducts } from "@/lib/actions/products";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products – Admin",
  description: "Manage your product catalog.",
};

function DeleteButton({ productId }: { productId: number }) {
  async function handleDelete() {
    "use server";
    await deleteProduct(productId);
  }

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">Products</h1>
          <p className="mt-1 text-neutral-500">
            {products.length} product{products.length !== 1 ? "s" : ""} total
          </p>
        </div>
      </div>

      {/* Add New Product */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Add New Product</h2>
        <ProductForm />
      </div>

      {/* Products Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Product Catalog</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-neutral-900">
                        {product.name}
                      </p>
                      <p className="text-sm text-neutral-500">{product.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {product.category || "—"}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-neutral-900">
                    {formatPrice(product.price)}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    {product.inventory}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {product.inventory === 0 && (
                        <Badge variant="destructive">Out of Stock</Badge>
                      )}
                      {product.featured && (
                        <Badge variant="secondary">Featured</Badge>
                      )}
                      {product.inventory > 0 && !product.featured && (
                        <Badge variant="outline">Active</Badge>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteButton productId={product.id} />
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-neutral-500"
                  >
                    No products yet. Add your first product above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
