// src/app/admin/pricing/page.tsx
import { Tier } from "@prisma/client";
import { PRODUCTS, getCategoryById } from "@/lib/static-data";
import { PricingEditor } from "@/components/admin/pricing-editor";

export const metadata = { title: "Admin · Pricing" };
export const dynamic = "force-dynamic";

export default function AdminPricingPage() {
  const rows = PRODUCTS.map((p) => {
    const latest = (tier: Tier) => {
      const row = p.prices.find((pr) => pr.tier === tier);
      return row ? row.price : 0;
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
  }).sort((a, b) => {
    const ca = getCategoryById(PRODUCTS.find((p) => p.id === a.id)!.categoryId)?.displayOrder ?? 0;
    const cb = getCategoryById(PRODUCTS.find((p) => p.id === b.id)!.categoryId)?.displayOrder ?? 0;
    return ca - cb || a.name.localeCompare(b.name);
  });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Pricing editor</h1>
        <p className="text-sm text-muted-foreground">
          Read-only in this static demo build. Edits will surface a demo-mode error.
        </p>
      </header>
      <PricingEditor rows={rows} />
    </div>
  );
}
