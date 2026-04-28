// src/app/category/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCatalog } from "@/server/data/catalog";
import { CategoryNav } from "@/components/category-nav";
import { ProductList } from "@/components/product-list";
import { SearchBar } from "@/components/search-bar";

type Params = { slug: string };
type SearchParams = { q?: string };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Params }) {
  const cat = await prisma.category.findFirst({
    where: { slug: params.slug, deletedAt: null },
    select: { name: true, description: true }
  });
  if (!cat) return { title: "Category" };
  return { title: cat.name, description: cat.description ?? undefined };
}

export default async function CategoryPage({
  params,
  searchParams
}: {
  params: Params;
  searchParams: SearchParams;
}) {
  const category = await prisma.category.findFirst({
    where: { slug: params.slug, deletedAt: null },
    select: { id: true, name: true, slug: true, description: true }
  });
  if (!category) notFound();

  const products = await getCatalog({
    q: searchParams.q,
    categorySlug: params.slug
  });

  return (
    <div className="container py-4 sm:py-8 space-y-4 sm:space-y-6">
      <header className="space-y-1 sm:space-y-2">
        <h1 className="text-xl sm:text-3xl font-semibold tracking-tight">{category.name}</h1>
        {category.description ? (
          <p className="text-xs sm:text-sm text-muted-foreground">{category.description}</p>
        ) : null}
      </header>

      <div className="sticky top-14 sm:top-16 z-30 -mx-3 sm:mx-0 px-3 sm:px-0 py-2 sm:py-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 sm:bg-transparent sm:backdrop-blur-none space-y-2 sm:space-y-3">
        <SearchBar placeholder={`Search in ${category.name}...`} />
        <CategoryNav activeSlug={category.slug} />
      </div>

      <ProductList products={products} />
    </div>
  );
}
