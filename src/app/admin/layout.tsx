// src/app/admin/layout.tsx
import Link from "next/link";
import { LayoutDashboard, Package, Tag } from "lucide-react";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();

  return (
    <div className="container py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
      <aside className="lg:sticky lg:top-20 lg:self-start">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Admin</p>
        <nav className="flex flex-col gap-1 text-sm">
          <Link href="/admin" className="rounded px-3 py-2 hover:bg-accent flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" aria-hidden /> Dashboard
          </Link>
          <Link href="/admin/products" className="rounded px-3 py-2 hover:bg-accent flex items-center gap-2">
            <Package className="h-4 w-4" aria-hidden /> Products
          </Link>
          <Link href="/admin/pricing" className="rounded px-3 py-2 hover:bg-accent flex items-center gap-2">
            <Tag className="h-4 w-4" aria-hidden /> Pricing
          </Link>
        </nav>
        <p className="mt-6 text-xs text-muted-foreground">Signed in as {admin.email}</p>
      </aside>
      <section>{children}</section>
    </div>
  );
}
