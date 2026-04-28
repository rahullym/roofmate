// src/app/error.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container py-16 max-w-lg text-center">
      <h2 className="text-2xl font-semibold">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">We hit an unexpected error loading this page.</p>
      {error.digest ? (
        <p className="mt-2 text-xs text-muted-foreground">
          Reference: <code className="font-mono">{error.digest}</code>
        </p>
      ) : null}
      <p className="mt-4 text-xs text-muted-foreground">
        If this is the deployed app, hit{" "}
        <a href="/api/debug" className="underline font-medium">
          /api/debug
        </a>{" "}
        to inspect environment + database connectivity.
      </p>
      <div className="mt-6 flex justify-center gap-2">
        <Button onClick={() => reset()}>Try again</Button>
        <Button asChild variant="outline">
          <a href="/">Go home</a>
        </Button>
      </div>
    </div>
  );
}
