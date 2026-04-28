// src/app/products/[slug]/loading.tsx
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container py-8 max-w-5xl">
      <Skeleton className="h-4 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Skeleton className="aspect-[4/3] w-full" />
        <div className="space-y-3">
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-10 w-48" />
        </div>
      </div>
    </div>
  );
}
