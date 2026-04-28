// src/server/actions/pricing.ts
"use server";

import { requireAdmin } from "@/lib/auth";
import { priceUpdateSchema, type PriceUpdateInput } from "@/lib/validations";

export type PricingResult = { ok: true } | { ok: false; error: string };

const DEMO_ERROR = "Demo deploy — prices are read from static data and cannot be modified.";

export async function updatePriceAction(input: PriceUpdateInput): Promise<PricingResult> {
  await requireAdmin();
  const parsed = priceUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };
  return { ok: false, error: DEMO_ERROR };
}
