// src/components/admin/pricing-editor.tsx
"use client";

import * as React from "react";
import { Tier } from "@prisma/client";
import { ALL_TIERS, TIER_LABEL } from "@/lib/pricing";
import { updatePriceAction } from "@/server/actions/pricing";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { EmptyState } from "@/components/empty-state";

type Row = {
  id: string;
  name: string;
  sku: string;
  prices: Record<Tier, number>;
};

export function PricingEditor({ rows }: { rows: Row[] }) {
  const { toast } = useToast();
  const [data, setData] = React.useState(rows);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);

  if (data.length === 0) {
    return <EmptyState title="No products to price" description="Create a product first." ctaHref="/admin/products/new" ctaLabel="New product" />;
  }

  const onCommit = async (productId: string, tier: Tier, raw: string) => {
    const value = Number(raw);
    if (Number.isNaN(value) || value < 0) {
      toast({ title: "Invalid price", description: "Enter a non-negative number.", variant: "destructive" });
      return;
    }
    const original = rows.find((r) => r.id === productId)?.prices[tier];
    if (original === value) return;

    const key = `${productId}:${tier}`;
    setSavingKey(key);
    const result = await updatePriceAction({ productId, tier, price: value });
    setSavingKey(null);
    if (!result.ok) {
      toast({ title: "Save failed", description: result.error, variant: "destructive" });
      return;
    }
    setData((prev) => prev.map((r) => (r.id === productId ? { ...r, prices: { ...r.prices, [tier]: value } } : r)));
    toast({ title: "Price updated", description: `${TIER_LABEL[tier]} → ${value.toFixed(2)}` });
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            {ALL_TIERS.map((t) => (
              <TableHead key={t} className="text-right">
                {TIER_LABEL[t]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.sku}</div>
              </TableCell>
              {ALL_TIERS.map((t) => {
                const key = `${r.id}:${t}`;
                return (
                  <TableCell key={t} className="text-right">
                    <Input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={r.prices[t]}
                      aria-label={`${r.name} ${TIER_LABEL[t]} price`}
                      onBlur={(e) => onCommit(r.id, t, e.currentTarget.value)}
                      className={`text-right tabular-nums ${savingKey === key ? "opacity-50" : ""}`}
                    />
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
