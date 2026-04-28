// src/components/product-row.tsx
import Image from "next/image";
import Link from "next/link";
import { Tier } from "@prisma/client";
import type { CatalogProduct } from "@/types";
import { TIER_LABEL } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";

const VISIBLE_TIERS: readonly Tier[] = [Tier.MRP, Tier.B2B, Tier.B2C];

export function ProductRow({ product }: { product: CatalogProduct }) {
  return (
    <div className="group relative grid grid-cols-[56px_1fr] sm:grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_5rem_5rem_5rem] gap-3 sm:gap-4 px-3 sm:px-4 py-2.5 sm:py-2 items-start sm:items-center hover:bg-accent/40 active:bg-accent/60 transition-colors">
      <Link
        href={`/products/${product.slug}`}
        className="absolute inset-0 z-10"
        aria-label={`View ${product.name}`}
      >
        <span className="sr-only">View {product.name}</span>
      </Link>

      <div className="relative h-14 w-14 sm:h-10 sm:w-10 overflow-hidden rounded-md bg-muted shrink-0">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt=""
            fill
            sizes="(max-width: 640px) 56px, 40px"
            className="object-cover"
          />
        ) : null}
      </div>

      <div className="min-w-0">
        <span className="block font-medium text-sm leading-tight truncate group-hover:underline">
          {product.name}
        </span>
        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
          <span className="sm:hidden">{product.category.name} · </span>
          {product.sku} · {product.unit}
        </p>

        <div className="mt-2 grid grid-cols-3 gap-2 sm:hidden">
          {VISIBLE_TIERS.map((tier) => {
            const price = product.prices[tier];
            return (
              <div key={tier} className="rounded-md border bg-background px-2 py-1.5 text-right">
                <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                  {TIER_LABEL[tier]}
                </div>
                <div className="text-xs font-semibold tabular-nums">
                  {price !== undefined ? formatCurrency(price, product.currency) : "—"}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="hidden sm:block text-sm text-muted-foreground truncate">
        {product.category.name}
      </div>

      {VISIBLE_TIERS.map((tier) => {
        const price = product.prices[tier];
        return (
          <div
            key={tier}
            className="hidden sm:block text-right text-sm font-medium tabular-nums"
          >
            {price !== undefined ? formatCurrency(price, product.currency) : "—"}
          </div>
        );
      })}
    </div>
  );
}
