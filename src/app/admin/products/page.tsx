// src/app/admin/products/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { Tier } from "@prisma/client";
import { PRODUCTS, getCategoryById } from "@/lib/static-data";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";

export const metadata = { title: "Admin · Products" };
export const dynamic = "force-dynamic";

export default function AdminProductsPage() {
  const rows = PRODUCTS.map((p) => {
    const byTier = (tier: Tier) => {
      const row = p.prices.find((pr) => pr.tier === tier);
      return row ? row.price : null;
    };
    const cat = getCategoryById(p.categoryId);
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      slug: p.slug,
      category: cat?.name ?? "—",
      isActive: p.isActive,
      mrp: byTier(Tier.MRP),
      retail: byTier(Tier.RETAIL),
      b2b: byTier(Tier.B2B),
      b2c: byTier(Tier.B2C)
    };
  }).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Read-only in this static demo build.</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4" aria-hidden /> New product
          </Link>
        </Button>
      </header>
      <ProductTable rows={rows} />
    </div>
  );
}
