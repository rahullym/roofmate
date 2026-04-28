// src/lib/static-data.ts
// Static catalog data — used in lieu of a database for the demo deploy.
// Mirrors the shape of the Prisma seed so consumers can be swapped trivially
// if a DB is reintroduced later.
import { Tier, Role } from "@prisma/client";

export type StaticCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
};

export type StaticPriceTier = {
  tier: Tier;
  price: number;
  currency: string;
  effectiveFrom: Date;
};

export type StaticProduct = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  unit: string;
  imageUrl: string;
  isActive: boolean;
  prices: StaticPriceTier[];
};

export type StaticAdminUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
  allowedTier: Tier;
};

const CURRENCY = "INR";
const EFFECTIVE_FROM = new Date("2026-04-01T00:00:00.000Z");

const tierMultipliers: Record<Tier, number> = {
  MRP: 1.0,
  RETAIL: 0.92,
  B2B: 0.78,
  B2C: 0.85
};

function buildPrices(mrp: number): StaticPriceTier[] {
  return (Object.keys(tierMultipliers) as Tier[]).map((tier) => ({
    tier,
    price: Math.round(mrp * tierMultipliers[tier] * 100) / 100,
    currency: CURRENCY,
    effectiveFrom: EFFECTIVE_FROM
  }));
}

export const CATEGORIES: StaticCategory[] = [
  {
    id: "cat-roofing-sheets",
    name: "Roofing Sheets",
    slug: "roofing-sheets",
    description: "Galvalume, polycarbonate, and color-coated profile sheets.",
    displayOrder: 1
  },
  {
    id: "cat-tiles",
    name: "Tiles",
    slug: "tiles",
    description: "Clay, concrete, and ceramic roof tiles.",
    displayOrder: 2
  },
  {
    id: "cat-accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Fasteners, sealants, ridge caps, and gutters.",
    displayOrder: 3
  }
];

type Seed = {
  id: string;
  categoryId: string;
  name: string;
  sku: string;
  description: string;
  unit: string;
  mrp: number;
  imageUrl: string;
};

const SEEDS: Seed[] = [
  {
    id: "p-rs-gal-05-t",
    categoryId: "cat-roofing-sheets",
    name: "Galvalume Trapezoidal Sheet 0.5mm",
    sku: "RS-GAL-05-T",
    description: "0.5mm galvalume coated trapezoidal profile sheet.",
    unit: "per sq ft",
    mrp: 65,
    imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800"
  },
  {
    id: "p-rs-pc-12-c",
    categoryId: "cat-roofing-sheets",
    name: "Polycarbonate Corrugated Sheet 1.2mm",
    sku: "RS-PC-12-C",
    description: "Translucent polycarbonate corrugated sheet, UV-stabilised.",
    unit: "per sq ft",
    mrp: 110,
    imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800"
  },
  {
    id: "p-rs-cc-045-p",
    categoryId: "cat-roofing-sheets",
    name: "Color-coated Profile Sheet 0.45mm",
    sku: "RS-CC-045-P",
    description: "Pre-painted galvanised steel sheet, slate grey.",
    unit: "per sq ft",
    mrp: 78,
    imageUrl: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=800"
  },
  {
    id: "p-tl-cly-mgr",
    categoryId: "cat-tiles",
    name: "Mangalore Clay Tile",
    sku: "TL-CLY-MGR",
    description: "Traditional Mangalore-pattern clay roof tile.",
    unit: "per piece",
    mrp: 38,
    imageUrl: "https://images.unsplash.com/photo-1597047084897-51e81819a499?w=800"
  },
  {
    id: "p-tl-con-int",
    categoryId: "cat-tiles",
    name: "Concrete Interlocking Tile",
    sku: "TL-CON-INT",
    description: "Charcoal concrete interlocking tile, 420x330mm.",
    unit: "per piece",
    mrp: 52,
    imageUrl: "https://images.unsplash.com/photo-1568871391107-0e26217aab3e?w=800"
  },
  {
    id: "p-tl-cer-glz",
    categoryId: "cat-tiles",
    name: "Ceramic Glazed Roof Tile",
    sku: "TL-CER-GLZ",
    description: "Glazed ceramic tile, terracotta finish.",
    unit: "per piece",
    mrp: 64,
    imageUrl: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800"
  },
  {
    id: "p-ac-scr-55",
    categoryId: "cat-accessories",
    name: "Self-drilling Roof Screw 55mm",
    sku: "AC-SCR-55",
    description: "Hex-head self-drilling screw with EPDM washer.",
    unit: "per box (250)",
    mrp: 850,
    imageUrl: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=800"
  },
  {
    id: "p-ac-seal-pu",
    categoryId: "cat-accessories",
    name: "Polyurethane Roof Sealant",
    sku: "AC-SEAL-PU",
    description: "600ml PU sealant cartridge, weather-resistant.",
    unit: "per cartridge",
    mrp: 420,
    imageUrl: "https://images.unsplash.com/photo-1581094289810-adf5d25690e3?w=800"
  },
  {
    id: "p-ac-rdg-8",
    categoryId: "cat-accessories",
    name: "Galvanised Ridge Cap 8ft",
    sku: "AC-RDG-8",
    description: "Pre-formed galvanised steel ridge cap, 8 feet.",
    unit: "per piece",
    mrp: 540,
    imageUrl: "https://images.unsplash.com/photo-1503387837-b154d5074bd2?w=800"
  }
];

export const PRODUCTS: StaticProduct[] = SEEDS.map((s) => ({
  id: s.id,
  categoryId: s.categoryId,
  name: s.name,
  slug: s.sku.toLowerCase(),
  sku: s.sku,
  description: s.description,
  unit: s.unit,
  imageUrl: s.imageUrl,
  isActive: true,
  prices: buildPrices(s.mrp)
}));

export const STATIC_ADMIN: StaticAdminUser = {
  id: "user-admin",
  email: "admin@roofmate.test",
  name: "Asha Admin",
  role: Role.ADMIN,
  allowedTier: Tier.MRP
};

export function getCategories(): StaticCategory[] {
  return [...CATEGORIES].sort((a, b) => a.displayOrder - b.displayOrder);
}

export function getCategoryBySlug(slug: string): StaticCategory | null {
  return CATEGORIES.find((c) => c.slug === slug) ?? null;
}

export function getCategoryById(id: string): StaticCategory | null {
  return CATEGORIES.find((c) => c.id === id) ?? null;
}

export function getProductBySlug(slug: string): (StaticProduct & { category: StaticCategory }) | null {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p) return null;
  const category = getCategoryById(p.categoryId);
  if (!category) return null;
  return { ...p, category };
}

export function getProductById(id: string): (StaticProduct & { category: StaticCategory }) | null {
  const p = PRODUCTS.find((x) => x.id === id);
  if (!p) return null;
  const category = getCategoryById(p.categoryId);
  if (!category) return null;
  return { ...p, category };
}

export function searchProducts(opts: { q?: string; categorySlug?: string }): (StaticProduct & { category: StaticCategory })[] {
  const q = opts.q?.trim().toLowerCase() ?? "";
  return PRODUCTS.filter((p) => p.isActive)
    .filter((p) => {
      if (!opts.categorySlug) return true;
      const cat = getCategoryById(p.categoryId);
      return cat?.slug === opts.categorySlug;
    })
    .filter((p) => {
      if (!q) return true;
      return (
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    })
    .map((p) => {
      const category = getCategoryById(p.categoryId);
      if (!category) throw new Error(`orphan product ${p.id}`);
      return { ...p, category };
    })
    .sort((a, b) => {
      if (a.category.displayOrder !== b.category.displayOrder) {
        return a.category.displayOrder - b.category.displayOrder;
      }
      return a.name.localeCompare(b.name);
    });
}
