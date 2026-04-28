// src/app/admin/page.tsx
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = { title: "Admin · Dashboard" };

export default async function AdminDashboardPage() {
  const [productCount, categoryCount, priceCount, auditCount] = await Promise.all([
    prisma.product.count({ where: { deletedAt: null } }),
    prisma.category.count({ where: { deletedAt: null } }),
    prisma.priceTier.count(),
    prisma.auditLog.count()
  ]);

  const stats = [
    { label: "Active products", value: productCount },
    { label: "Categories", value: categoryCount },
    { label: "Price rows", value: priceCount },
    { label: "Audit log entries", value: auditCount }
  ];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Catalog health at a glance.</p>
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
