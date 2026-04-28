// src/server/actions/products.ts
"use server";

import { requireAdmin } from "@/lib/auth";
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

const DEMO_ERROR = "Demo deploy — products are read from static data and cannot be modified.";

export async function createProductAction(input: ProductCreateInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productCreateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  return { ok: false, error: DEMO_ERROR };
}

export async function updateProductAction(input: ProductUpdateInput): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Invalid input", fieldErrors: parsed.error.flatten().fieldErrors };
  }
  return { ok: false, error: DEMO_ERROR };
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  await requireAdmin();
  const parsed = productDeleteSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, error: "Invalid id" };
  return { ok: false, error: DEMO_ERROR };
}
