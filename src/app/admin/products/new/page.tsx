// src/app/admin/products/new/page.tsx
import { CATEGORIES } from "@/lib/static-data";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin · New product" };

export default function NewProductPage() {
  const categories = CATEGORIES.map((c) => ({ id: c.id, name: c.name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">
          Form works for validation; submitting returns a demo-only error since this build has no database.
        </p>
      </header>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
