// src/components/admin/product-form.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tier } from "@prisma/client";
import {
  productCreateSchema,
  productUpdateSchema,
  type ProductCreateInput,
  type ProductUpdateInput
} from "@/lib/validations";
import { createProductAction, updateProductAction } from "@/server/actions/products";
import { ALL_TIERS, TIER_LABEL } from "@/lib/pricing";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";

type CategoryOption = { id: string; name: string };

type CreateProps = {
  mode: "create";
  categories: CategoryOption[];
  defaultValues?: never;
};
type EditProps = {
  mode: "edit";
  categories: CategoryOption[];
  defaultValues: ProductUpdateInput;
};
type Props = CreateProps | EditProps;

export function ProductForm(props: Props) {
  const router = useRouter();
  const { toast } = useToast();
  const isEdit = props.mode === "edit";

  const form = useForm<ProductCreateInput | ProductUpdateInput>({
    resolver: zodResolver(isEdit ? productUpdateSchema : productCreateSchema),
    defaultValues: isEdit
      ? props.defaultValues
      : {
          name: "",
          sku: "",
          categoryId: props.categories[0]?.id ?? "",
          description: "",
          unit: "",
          imageUrl: "",
          isActive: true,
          prices: { MRP: 0, RETAIL: 0, B2B: 0, B2C: 0 }
        }
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = form;

  const categoryId = watch("categoryId");

  const onSubmit = async (values: ProductCreateInput | ProductUpdateInput) => {
    const result = isEdit
      ? await updateProductAction(values as ProductUpdateInput)
      : await createProductAction(values as ProductCreateInput);

    if (!result.ok) {
      toast({ title: "Save failed", description: result.error, variant: "destructive" });
      return;
    }
    toast({ title: isEdit ? "Product updated" : "Product created" });
    router.push("/admin/products");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name")} aria-invalid={errors.name ? "true" : "false"} />
          {errors.name ? <p className="text-xs text-destructive">{errors.name.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} aria-invalid={errors.sku ? "true" : "false"} />
          {errors.sku ? <p className="text-xs text-destructive">{errors.sku.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="categoryId">Category</Label>
          <Select value={categoryId} onValueChange={(v) => setValue("categoryId", v, { shouldValidate: true })}>
            <SelectTrigger id="categoryId">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {props.categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.categoryId ? <p className="text-xs text-destructive">{errors.categoryId.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="unit">Unit</Label>
          <Input id="unit" placeholder="per sq ft" {...register("unit")} />
          {errors.unit ? <p className="text-xs text-destructive">{errors.unit.message}</p> : null}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input id="imageUrl" type="url" placeholder="https://..." {...register("imageUrl")} />
          {errors.imageUrl ? <p className="text-xs text-destructive">{errors.imageUrl.message}</p> : null}
        </div>
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" rows={4} {...register("description")} />
        </div>
        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            type="checkbox"
            id="isActive"
            defaultChecked
            {...register("isActive")}
            className="h-4 w-4 rounded border-input"
          />
          <Label htmlFor="isActive">Active (visible in catalog)</Label>
        </div>
      </div>

      <fieldset className="space-y-3">
        <legend className="text-sm font-medium">Tier prices (INR)</legend>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {ALL_TIERS.map((tier) => {
            const key = `prices.${tier}` as const;
            return (
              <div key={tier} className="space-y-1.5">
                <Label htmlFor={key}>{TIER_LABEL[tier]}</Label>
                <Input
                  id={key}
                  type="number"
                  step="0.01"
                  min="0"
                  {...register(key as `prices.${Tier}`, { valueAsNumber: true })}
                />
              </div>
            );
          })}
        </div>
        {errors.prices && "message" in errors.prices ? (
          <p className="text-xs text-destructive">{errors.prices.message as string}</p>
        ) : null}
      </fieldset>

      <div className="flex items-center gap-2">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : isEdit ? "Save changes" : "Create product"}
        </Button>
        <Button type="button" variant="ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
