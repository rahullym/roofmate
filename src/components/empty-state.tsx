// src/components/empty-state.tsx
import Link from "next/link";
import { PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
  title: string;
  description?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function EmptyState({ title, description, ctaHref, ctaLabel }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 px-6 text-center">
      <PackageOpen className="h-10 w-10 text-muted-foreground mb-4" aria-hidden />
      <h3 className="text-lg font-semibold">{title}</h3>
      {description ? <p className="mt-1 text-sm text-muted-foreground max-w-md">{description}</p> : null}
      {ctaHref && ctaLabel ? (
        <Button asChild className="mt-4">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      ) : null}
    </div>
  );
}
