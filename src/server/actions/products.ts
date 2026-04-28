// src/server/actions/products.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Tier } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import {
  productCreateSchema,
  productUpdateSchema,
  productDeleteSchema,
  type ProductCreateInput,
  type ProductUpdateInput
} from "@/lib/validations";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string[]> };

export async function createProductAction(input: ProductCreateInput): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = productCreateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }
  const data = parsed.data;

  try {
    const slug = slugify(`${data.sku}-${data.name}`).slice(0, 80);

    const product = await prisma.$transaction(async (tx) => {
      const created = await tx.product.create({
        data: {
          name: data.name,
          slug,
          sku: data.sku,
          categoryId: data.categoryId,
          description: data.description ?? null,
          unit: data.unit,
          imageUrl: data.imageUrl?.length ? data.imageUrl : null,
          isActive: data.isActive
        }
      });

      await tx.priceTier.createMany({
        data: (Object.keys(data.prices) as Tier[]).map((tier) => ({
          productId: created.id,
          tier,
          price: data.prices[tier]
        }))
      });

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "CREATE",
          entityType: "Product",
          entityId: created.id,
          diff: { after: { ...data, slug } }
        }
      });

      return created;
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/products/${product.slug}`);
    return { ok: true };
  } catch (err) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      return { ok: false, error: "A product with that SKU already exists" };
    }
    console.error(err);
    return { ok: false, error: "Failed to create product" };
  }
}

export async function updateProductAction(input: ProductUpdateInput): Promise<ActionResult> {
  const admin = await requireAdmin();

  const parsed = productUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors
    };
  }
  const data = parsed.data;

  try {
    const before = await prisma.product.findUnique({
      where: { id: data.id },
      include: { prices: true }
    });
    if (!before) return { ok: false, error: "Product not found" };

    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: data.id },
        data: {
          name: data.name,
          sku: data.sku,
          categoryId: data.categoryId,
          description: data.description ?? null,
          unit: data.unit,
          imageUrl: data.imageUrl?.length ? data.imageUrl : null,
          isActive: data.isActive
        }
      });

      // For each tier, insert a new PriceTier row (effective now) if price changed.
      const now = new Date();
      for (const tier of Object.keys(data.prices) as Tier[]) {
        const newPrice = data.prices[tier];
        const latest = before.prices
          .filter((p) => p.tier === tier)
          .sort((a, b) => b.effectiveFrom.getTime() - a.effectiveFrom.getTime())[0];
        if (!latest || Number(latest.price) !== newPrice) {
          await tx.priceTier.create({
            data: { productId: data.id, tier, price: newPrice, effectiveFrom: now }
          });
        }
      }

      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "UPDATE",
          entityType: "Product",
          entityId: data.id,
          diff: { before: { name: before.name, sku: before.sku }, after: { name: data.name, sku: data.sku, prices: data.prices } }
        }
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    revalidatePath(`/products/${before.slug}`);
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to update product" };
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const admin = await requireAdmin();
  const parsed = productDeleteSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, error: "Invalid id" };

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id: parsed.data.id },
        data: { deletedAt: new Date(), isActive: false }
      });
      await tx.auditLog.create({
        data: {
          userId: admin.id,
          action: "DELETE",
          entityType: "Product",
          entityId: parsed.data.id,
          diff: { softDeletedAt: new Date().toISOString() }
        }
      });
    });

    revalidatePath("/admin/products");
    revalidatePath("/");
    return { ok: true };
  } catch (err) {
    console.error(err);
    return { ok: false, error: "Failed to delete product" };
  }
}

export async function redirectToProductsList() {
  redirect("/admin/products");
}
