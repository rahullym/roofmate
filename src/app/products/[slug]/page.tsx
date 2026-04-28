// src/app/products/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Tier } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { resolveVisibleTier, canSeeAllTiers, ALL_TIERS, TIER_LABEL, pickLatestPrice } from "@/lib/pricing";
import { getProductBySlug } from "@/server/data/catalog";
import { TierToggle } from "@/components/tier-toggle";
import { PriceDisplay } from "@/components/price-display";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type Params = { slug: string };
type SearchParams = { tier?: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: "Product not found" };
  return { title: product.name, description: product.description ?? undefined };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const user = await getSessionUser();
  const allowedTier = user?.allowedTier ?? Tier.B2C;
  const role = user?.role ?? null;
  const visibleTier = resolveVisibleTier({ requestedTier: searchParams.tier, role, allowedTier });

  const latest = pickLatestPrice(product.prices, visibleTier);
  const showAllTiers = canSeeAllTiers(role);

  return (
    <div className="container py-8 max-w-5xl">
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:underline">
          Catalog
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/category/${product.category.slug}`} className="hover:underline">
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-foreground">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] rounded-lg border overflow-hidden bg-muted">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              No image
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Badge variant="secondary">{product.category.name}</Badge>
          <h1 className="text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="text-sm text-muted-foreground">SKU: {product.sku} · {product.unit}</p>
          {product.description ? <p className="text-sm leading-relaxed">{product.description}</p> : null}

          {showAllTiers ? <TierToggle activeTier={visibleTier} /> : null}

          {latest ? (
            <PriceDisplay
              tier={visibleTier}
              price={latest.price}
              currency={product.prices[0]?.currency ?? "INR"}
              unit={product.unit}
              size="lg"
            />
          ) : (
            <p className="text-sm text-muted-foreground">
              {user ? "No price configured for your tier." : "Sign in to view pricing."}
            </p>
          )}
        </div>
      </div>

      {showAllTiers ? (
        <Card className="mt-10">
          <CardHeader>
            <CardTitle>All tiers</CardTitle>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <thead className="text-muted-foreground">
                <tr>
                  <th className="py-2 text-left">Tier</th>
                  <th className="py-2 text-left">Price</th>
                  <th className="py-2 text-left">Effective from</th>
                </tr>
              </thead>
              <tbody>
                {ALL_TIERS.map((t) => {
                  const row = pickLatestPrice(product.prices, t);
                  return (
                    <tr key={t} className="border-t">
                      <td className="py-2 font-medium">{TIER_LABEL[t]}</td>
                      <td className="py-2 tabular-nums">
                        {row ? formatCurrency(row.price, product.prices[0]?.currency ?? "INR") : "—"}
                      </td>
                      <td className="py-2 text-muted-foreground">
                        {row ? row.effectiveFrom.toISOString().slice(0, 10) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
