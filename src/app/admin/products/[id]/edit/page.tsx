// src/app/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { Tier } from "@prisma/client";
import { CATEGORIES, getProductById } from "@/lib/static-data";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin · Edit product" };

export default function EditProductPage({ params }: { params: { id: string } }) {
  const product = getProductById(params.id);
  if (!product) notFound();

  const categories = CATEGORIES.map((c) => ({ id: c.id, name: c.name })).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  const latestByTier = (tier: Tier) => {
    const row = product.prices.find((p) => p.tier === tier);
    return row ? row.price : 0;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <p className="text-sm text-muted-foreground">
          Read-only demo: fields are populated from static data, but saves are disabled.
        </p>
      </header>
      <ProductForm
        mode="edit"
        categories={categories}
        defaultValues={{
          id: product.id,
          name: product.name,
          sku: product.sku,
          categoryId: product.categoryId,
          description: product.description ?? "",
          unit: product.unit,
          imageUrl: product.imageUrl ?? "",
          isActive: product.isActive,
          prices: {
            MRP: latestByTier(Tier.MRP),
            RETAIL: latestByTier(Tier.RETAIL),
            B2B: latestByTier(Tier.B2B),
            B2C: latestByTier(Tier.B2C)
          }
        }}
      />
    </div>
  );
}
