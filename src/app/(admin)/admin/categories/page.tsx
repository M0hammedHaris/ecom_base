import { CategoryForm } from "@/components/category/category-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteCategory, getCategories } from "@/lib/actions/categories";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories – Admin",
  description: "Manage your product categories.",
};

function DeleteButton({ categoryId }: { categoryId: number }) {
  async function handleDelete() {
    "use server";
    await deleteCategory(categoryId);
  }

  return (
    <form action={handleDelete}>
      <Button type="submit" variant="destructive" size="sm">
        Delete
      </Button>
    </form>
  );
}

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900">Categories</h1>
        <p className="mt-1 text-neutral-500">
          {categories.length} categor{categories.length !== 1 ? "ies" : "y"} total
        </p>
      </div>

      {/* Add New Category */}
      <div className="rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="mb-6 text-lg font-semibold">Add New Category</h2>
        <CategoryForm />
      </div>

      {/* Categories Table */}
      <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">All Categories</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 bg-neutral-50">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Slug
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-neutral-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-neutral-900">
                      {category.name}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="outline">{category.slug}</Badge>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600 max-w-xs truncate">
                    {category.description || "—"}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <DeleteButton categoryId={category.id} />
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-neutral-500"
                  >
                    No categories yet. Add your first category above.
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
