// src/components/admin/product-table.tsx
"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { deleteProductAction } from "@/server/actions/products";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  slug: string;
  category: string;
  isActive: boolean;
  mrp: number | null;
  retail: number | null;
  b2b: number | null;
  b2c: number | null;
};

export function ProductTable({ rows }: { rows: Row[] }) {
  const router = useRouter();
  const { toast } = useToast();
  const [pendingId, startTransition] = React.useReducer((_: string | null, next: string | null) => next, null);

  if (rows.length === 0) {
    return <EmptyState title="No products yet" description="Create your first catalog product." ctaHref="/admin/products/new" ctaLabel="New product" />;
  }

  const onDelete = (id: string) => {
    if (!window.confirm("Soft-delete this product? It can be restored from the database.")) return;
    startTransition(id);
    deleteProductAction(id).then((res) => {
      startTransition(null);
      if (!res.ok) {
        toast({ title: "Delete failed", description: res.error, variant: "destructive" });
        return;
      }
      toast({ title: "Product deleted" });
      router.refresh();
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">MRP</TableHead>
            <TableHead className="text-right">Retail</TableHead>
            <TableHead className="text-right">B2B</TableHead>
            <TableHead className="text-right">B2C</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[120px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((r) => (
            <TableRow key={r.id}>
              <TableCell>
                <div className="font-medium">{r.name}</div>
                <div className="text-xs text-muted-foreground">{r.sku}</div>
              </TableCell>
              <TableCell>{r.category}</TableCell>
              <TableCell className="text-right tabular-nums">{r.mrp != null ? formatCurrency(r.mrp) : "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{r.retail != null ? formatCurrency(r.retail) : "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{r.b2b != null ? formatCurrency(r.b2b) : "—"}</TableCell>
              <TableCell className="text-right tabular-nums">{r.b2c != null ? formatCurrency(r.b2c) : "—"}</TableCell>
              <TableCell>
                <Badge variant={r.isActive ? "default" : "outline"}>{r.isActive ? "Active" : "Hidden"}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button asChild variant="ghost" size="icon" aria-label={`Edit ${r.name}`}>
                    <Link href={`/admin/products/${r.id}/edit`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${r.name}`}
                    disabled={pendingId === r.id}
                    onClick={() => onDelete(r.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
