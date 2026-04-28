// src/app/category/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8 space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-10 w-full max-w-md" />
      <Skeleton className="h-9 w-full" />
      <div className="rounded-lg border divide-y">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-14 rounded-none" />
        ))}
      </div>
    </div>
  );
}
