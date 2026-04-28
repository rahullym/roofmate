// src/components/tier-toggle.tsx
"use client";

import * as React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Tier } from "@prisma/client";
import { ALL_TIERS, TIER_LABEL } from "@/lib/pricing";
import { cn } from "@/lib/utils";

export function TierToggle({ activeTier }: { activeTier: Tier }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const setTier = (tier: Tier) => {
    const next = new URLSearchParams(params.toString());
    next.set("tier", tier);
    router.push(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div
      role="tablist"
      aria-label="Pricing tier"
      className="inline-flex items-center rounded-md border p-1 text-sm"
    >
      {ALL_TIERS.map((tier) => {
        const isActive = tier === activeTier;
        return (
          <button
            key={tier}
            role="tab"
            aria-selected={isActive}
            onClick={() => setTier(tier)}
            className={cn(
              "px-3 py-1.5 rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"
            )}
            type="button"
          >
            {TIER_LABEL[tier]}
          </button>
        );
      })}
    </div>
  );
}
