// src/app/admin/page.tsx
import { CATEGORIES, PRODUCTS } from "@/lib/static-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin · Dashboard" };

export default function AdminDashboardPage() {
  const productCount = PRODUCTS.length;
  const categoryCount = CATEGORIES.length;
  const priceCount = PRODUCTS.reduce((acc, p) => acc + p.prices.length, 0);

  const stats = [
    { label: "Active products", value: productCount },
    { label: "Categories", value: categoryCount },
    { label: "Price rows", value: priceCount },
    { label: "Mode", value: "Static" }
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Catalog is served from baked-in static data. Edits are disabled in this build.
        </p>
      </header>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardHeader className="pb-2">
              <CardDescription>{s.label}</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{s.value}</CardTitle>
            </CardHeader>
            <CardContent />
          </Card>
        ))}
      </div>
    </div>
  );
}
