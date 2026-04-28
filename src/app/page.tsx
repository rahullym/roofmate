// src/app/page.tsx
import { Suspense } from "react";
import { getSessionUser } from "@/lib/auth";
import { getCatalog } from "@/server/data/catalog";
import { CategoryNav } from "@/components/category-nav";
import { ProductList } from "@/components/product-list";
import { SearchBar } from "@/components/search-bar";
import { Skeleton } from "@/components/ui/skeleton";

type SearchParams = { q?: string };

export const dynamic = "force-dynamic";

export default async function CatalogPage({ searchParams }: { searchParams: SearchParams }) {
  const user = await getSessionUser();

  return (
    <div className="container py-4 sm:py-8 space-y-4 sm:space-y-6">
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">Product catalog</h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {user
            ? `Signed in as ${user.email} — MRP, B2B, and B2C prices.`
            : "Showing MRP, B2B, and B2C prices."}
        </p>
      </header>

      <div className="sticky top-14 sm:top-16 z-30 -mx-3 sm:mx-0 px-3 sm:px-0 py-2 sm:py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:bg-transparent sm:backdrop-blur-none space-y-2 sm:space-y-3">
        <SearchBar />
        <Suspense fallback={<Skeleton className="h-9 w-full" />}>
            <CategoryNav />
        </Suspense>
      </div>

      <Suspense
        fallback={
          <div className="rounded-lg border divide-y">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-none" />
            ))}
          </div>
        }
      >
        <CatalogResults q={searchParams.q} />
      </Suspense>
    </div>
  );
}

async function CatalogResults({ q }: { q?: string }) {
  const products = await getCatalog({ q });
  return <ProductList products={products} />;
}
