// src/server/data/catalog.ts
import "server-only";
import { Tier } from "@prisma/client";
import { searchProducts, getProductBySlug as getStaticProductBySlug } from "@/lib/static-data";
import type { CatalogProduct } from "@/types";

export type CatalogQueryParams = {
  q?: string;
  categorySlug?: string;
};

export async function getCatalog(params: CatalogQueryParams): Promise<CatalogProduct[]> {
  const products = searchProducts(params);

  return products.map((p) => {
    const latestPerTier: Partial<Record<Tier, number>> = {};
    for (const row of p.prices) {
      if (latestPerTier[row.tier] === undefined) {
        latestPerTier[row.tier] = row.price;
      }
    }
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      unit: p.unit,
      imageUrl: p.imageUrl,
      category: { name: p.category.name, slug: p.category.slug },
      prices: latestPerTier,
      currency: p.prices[0]?.currency ?? "INR"
    };
  });
}

export async function getProductBySlug(slug: string) {
  return getStaticProductBySlug(slug);
}
