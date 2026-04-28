// src/app/admin/pricing/page.tsx
import { Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { PricingEditor } from "@/components/admin/pricing-editor";

export const metadata = { title: "Admin · Pricing" };
export const dynamic = "force-dynamic";

export default async function AdminPricingPage() {
  const products = await prisma.product.findMany({
    where: { deletedAt: null },
    orderBy: [{ category: { displayOrder: "asc" } }, { name: "asc" }],
    include: { prices: { orderBy: { effectiveFrom: "desc" } } }
  });

  const rows = products.map((p) => {
    const latest = (tier: Tier) => {
      const row = p.prices.find((pr) => pr.tier === tier);
      return row ? Number(row.price) : 0;
    };
    return {
      id: p.id,
      name: p.name,
      sku: p.sku,
      prices: {
        MRP: latest(Tier.MRP),
        RETAIL: latest(Tier.RETAIL),
        B2B: latest(Tier.B2B),
        B2C: latest(Tier.B2C)
      }
    };
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing editor</h1>
        <p className="text-sm text-muted-foreground">
          Edit a cell, blur to save. Each save inserts a new effective-dated row.
        </p>
      </header>
      <PricingEditor rows={rows} />
    </div>
  );
}
