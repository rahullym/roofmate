// src/components/price-display.tsx
import { Tier } from "@prisma/client";
import { TIER_LABEL } from "@/lib/pricing";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type PriceDisplayProps = {
  tier: Tier;
  price: number;
  currency?: string;
  unit?: string;
  size?: "sm" | "md" | "lg";
};

export function PriceDisplay({ tier, price, currency = "INR", unit, size = "md" }: PriceDisplayProps) {
  const sizeClass = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-lg";
  return (
    <div className="flex flex-col gap-1">
      <Badge variant="outline" className="w-fit text-[10px] tracking-wider uppercase">
        {TIER_LABEL[tier]} price
      </Badge>
      <div className="flex items-baseline gap-2">
        <span className={`${sizeClass} font-semibold tabular-nums`}>{formatCurrency(price, currency)}</span>
        {unit ? <span className="text-xs text-muted-foreground">{unit}</span> : null}
      </div>
    </div>
  );
}
