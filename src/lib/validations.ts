// src/lib/validations.ts
import { z } from "zod";
import { Tier } from "@prisma/client";

export const tierEnum = z.nativeEnum(Tier);

export const productCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(140),
  sku: z
    .string()
    .min(2)
    .max(40)
    .regex(/^[A-Z0-9-]+$/, "SKU must be uppercase letters, digits, or dashes"),
  categoryId: z.string().min(1, "Choose a category"),
  description: z.string().max(2000).optional().nullable(),
  unit: z.string().min(1, "Unit is required").max(40),
  imageUrl: z.string().url("Must be a valid URL").optional().nullable().or(z.literal("")),
  isActive: z.boolean().default(true),
  prices: z
    .object({
      MRP: z.coerce.number().nonnegative(),
      RETAIL: z.coerce.number().nonnegative(),
      B2B: z.coerce.number().nonnegative(),
      B2C: z.coerce.number().nonnegative()
    })
    .refine(
      (p) => p.B2C <= p.MRP && p.B2B <= p.MRP && p.RETAIL <= p.MRP,
      { message: "Tier prices cannot exceed MRP" }
    )
});

export type ProductCreateInput = z.infer<typeof productCreateSchema>;

export const productUpdateSchema = productCreateSchema.extend({
  id: z.string().min(1)
});

export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;

export const productDeleteSchema = z.object({ id: z.string().min(1) });

export const priceUpdateSchema = z.object({
  productId: z.string().min(1),
  tier: tierEnum,
  price: z.coerce.number().nonnegative()
});

export type PriceUpdateInput = z.infer<typeof priceUpdateSchema>;

export const productSearchSchema = z.object({
  q: z.string().trim().max(120).optional(),
  category: z.string().max(80).optional(),
  tier: tierEnum.optional()
});
