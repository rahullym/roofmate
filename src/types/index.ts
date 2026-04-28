// src/types/index.ts
import type { Category, Product, PriceTier, Tier } from "@prisma/client";

export type ProductWithPrices = Product & {
  category: Pick<Category, "id" | "name" | "slug">;
  prices: PriceTier[];
};

export type CatalogProduct = {
  id: string;
  name: string;
  slug: string;
  sku: string;
  unit: string;
  imageUrl: string | null;
  category: { name: string; slug: string };
  prices: Partial<Record<Tier, number>>;
  currency: string;
};
