// src/app/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import { Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin · Edit product" };

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: params.id },
      include: { prices: { orderBy: { effectiveFrom: "desc" } } }
    }),
    prisma.category.findMany({
      where: { deletedAt: null },
      orderBy: { displayOrder: "asc" },
      select: { id: true, name: true }
    })
  ]);

  if (!product) notFound();

  const latestByTier = (tier: Tier) => {
    const row = product.prices.find((p) => p.tier === tier);
    return row ? Number(row.price) : 0;
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Edit product</h1>
        <p className="text-sm text-muted-foreground">Updates write a new price row per tier (price history is preserved).</p>
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
