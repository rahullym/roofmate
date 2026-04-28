// src/components/category-nav.tsx
import Link from "next/link";
import { getCategories } from "@/lib/static-data";
import { cn } from "@/lib/utils";

export function CategoryNav({ activeSlug }: { activeSlug?: string }) {
  const categories = getCategories();

  return (
    <nav aria-label="Categories" className="-mx-3 sm:mx-0 px-3 sm:px-0 overflow-x-auto scroll-touch">
      <ul className="flex gap-2 pb-1 snap-x snap-mandatory">
        <li className="snap-start">
          <Link
            href="/"
            className={cn(
              "inline-flex items-center rounded-full border px-3 h-9 text-sm transition-colors whitespace-nowrap",
              !activeSlug
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent active:bg-accent"
            )}
          >
            All
          </Link>
        </li>
        {categories.map((c) => {
          const isActive = c.slug === activeSlug;
          return (
            <li key={c.id} className="snap-start">
              <Link
                href={`/category/${c.slug}`}
                className={cn(
                  "inline-flex items-center rounded-full border px-3 h-9 text-sm transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-accent active:bg-accent"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {c.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
