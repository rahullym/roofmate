// src/components/product-list.tsx
import type { CatalogProduct } from "@/types";
import { ProductRow } from "@/components/product-row";
import { EmptyState } from "@/components/empty-state";

export function ProductList({ products }: { products: CatalogProduct[] }) {
  if (products.length === 0) {
    return (
      <EmptyState
        title="No products match your filters"
        description="Try clearing the search or switching categories."
        ctaHref="/"
        ctaLabel="View all products"
      />
    );
  }

  return (
    <div className="rounded-lg border bg-card overflow-hidden">
      <div className="hidden sm:grid sm:grid-cols-[40px_minmax(0,2fr)_minmax(0,1fr)_5rem_5rem_5rem] gap-4 px-4 py-2 border-b bg-muted/40 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">
        <span aria-hidden />
        <span>Product</span>
        <span>Category</span>
        <span className="text-right">MRP</span>
        <span className="text-right">B2B</span>
        <span className="text-right">B2C</span>
      </div>
      <ul className="divide-y">
        {products.map((p) => (
          <li key={p.id}>
            <ProductRow product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
}
