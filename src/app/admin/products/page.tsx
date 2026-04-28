// src/app/admin/products/page.tsx
import Link from "next/link";
import { Plus } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { ProductTable } from "@/components/admin/product-table";

export const metadata = { title: "Admin · Products" };
export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: { displayOrder: "asc" } }, { name: "asc" }],
    include: {
      category: { select: { name: true } },
      prices: { orderBy: { effectiveFrom: "desc" } }
    }
  });

  const rows = products.map((p) => {
    const byTier = (tier: string) => {
      const row = p.prices.find((pr) => pr.tier === tier);
      return row ? Number(row.price) : null;
    };
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      slug: p.slug,
      category: p.category.name,
      isActive: p.isActive,
      mrp: byTier("MRP"),
      retail: byTier("RETAIL"),
      b2b: byTier("B2B"),
      b2c: byTier("B2C")
    };
  });

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
          <p className="text-sm text-muted-foreground">Add, edit, or soft-delete catalog items.</p>
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
