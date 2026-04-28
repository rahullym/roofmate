// src/server/actions/pricing.ts
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { priceUpdateSchema, type PriceUpdateInput } from "@/lib/validations";

export type PricingResult = { ok: true } | { ok: false; error: string };

export async function updatePriceAction(input: PriceUpdateInput): Promise<PricingResult> {
  const admin = await requireAdmin();
  const parsed = priceUpdateSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Invalid input" };

  const { productId, tier, price } = parsed.data;

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, slug: true, deletedAt: true }
    });
    if (!product || product.deletedAt) return { ok: false, error: "Product not found" };

    const now = new Date();
    const latest = await prisma.priceTier.findFirst({
      where: { productId, tier },
      orderBy: { effectiveFrom: "desc" }
    });

    if (latest && Number(latest.price) === price) {
      return { ok: true };
    }

    await prisma.$transaction([
      prisma.priceTier.create({
        data: { productId, tier, price, effectiveFrom: now }
      }),
      prisma.auditLog.create({
        data: {
          userId: admin.id,
          action: "PRICE_UPDATE",
          entityType: "PriceTier",
          entityId: productId,
          diff: { tier, before: latest ? Number(latest.price) : null, after: price }
        }
      })
    ]);

    revalidatePath("/admin/pricing");
    revalidatePath("/");
    revalidatePath(`/products/${product.slug}`);
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to update price" };
  }
}
