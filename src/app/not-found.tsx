// src/app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container py-16 max-w-lg text-center">
      <h2 className="text-2xl font-semibold">Page not found</h2>
      <p className="mt-2 text-muted-foreground">The page you were looking for doesn’t exist.</p>
      <Button asChild className="mt-6">
        <Link href="/">Back to catalog</Link>
      </Button>
    </div>
  );
}
