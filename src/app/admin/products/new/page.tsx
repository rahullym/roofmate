// src/app/admin/products/new/page.tsx
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export const metadata = { title: "Admin · New product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    where: { deletedAt: null },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true }
  });

  return (
    <div className="space-y-6 max-w-2xl">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">New product</h1>
        <p className="text-sm text-muted-foreground">Create a product and set all four tier prices.</p>
      </header>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
