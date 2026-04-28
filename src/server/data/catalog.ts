// src/server/data/catalog.ts
import "server-only";
import { Prisma, Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CatalogProduct } from "@/types";

export type CatalogQueryParams = {
  q?: string;
  categorySlug?: string;
};

export async function getCatalog(params: CatalogQueryParams): Promise<CatalogProduct[]> {
  const where: Prisma.ProductWhereInput = {
    deletedAt: null,
    isActive: true
  };

  if (params.categorySlug) {
    where.category = { slug: params.categorySlug, deletedAt: null };
  }

  if (params.q && params.q.trim().length > 0) {
    const term = params.q.trim();
    where.OR = [
      { name: { contains: term, mode: "insensitive" } },
      { sku: { contains: term, mode: "insensitive" } },
      { description: { contains: term, mode: "insensitive" } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ category: { displayOrder: "asc" } }, { name: "asc" }],
    include: {
      category: { select: { id: true, name: true, slug: true } },
      prices: { orderBy: { effectiveFrom: "desc" } }
    }
  });

  return products.map((p) => {
    const latestPerTier: Partial<Record<Tier, number>> = {};
    for (const row of p.prices) {
      if (latestPerTier[row.tier] === undefined) {
        latestPerTier[row.tier] = Number(row.price);
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
  return prisma.product.findFirst({
    where: { slug, deletedAt: null },
    include: {
      category: { select: { id: true, name: true, slug: true } },
      prices: { orderBy: [{ tier: "asc" }, { effectiveFrom: "desc" }] }
    }
  });
}
