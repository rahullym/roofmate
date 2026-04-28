// src/lib/pricing.ts
import { Tier, Role } from "@prisma/client";

export const ALL_TIERS: readonly Tier[] = [Tier.MRP, Tier.RETAIL, Tier.B2B, Tier.B2C] as const;

export const TIER_LABEL: Record<Tier, string> = {
  MRP: "MRP",
  RETAIL: "Retail",
  B2B: "B2B",
  B2C: "B2C"
};

const PRIVILEGED_ROLES: ReadonlySet<Role> = new Set([Role.ADMIN, Role.SALES]);

export function canSeeAllTiers(role: Role | undefined | null): boolean {
  if (!role) return false;
  return PRIVILEGED_ROLES.has(role);
}

export function resolveVisibleTier(params: {
  requestedTier?: string | null;
  role: Role | null | undefined;
  allowedTier: Tier;
}): Tier {
  const { requestedTier, role, allowedTier } = params;
  if (!canSeeAllTiers(role)) return allowedTier;
  if (!requestedTier) return allowedTier;
  const upper = requestedTier.toUpperCase();
  if ((ALL_TIERS as readonly string[]).includes(upper)) {
    return upper as Tier;
  }
  return allowedTier;
}

export function pickLatestPrice(
  prices: { tier: Tier; price: unknown; effectiveFrom: Date }[],
  tier: Tier
): { price: number; effectiveFrom: Date } | null {
  const filtered = prices.filter((p) => p.tier === tier);
  if (filtered.length === 0) return null;
  const latest = filtered.reduce((acc, cur) =>
    cur.effectiveFrom > acc.effectiveFrom ? cur : acc
  );
  return { price: Number(latest.price), effectiveFrom: latest.effectiveFrom };
}
