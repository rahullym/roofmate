// src/app/admin/error.tsx
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-lg border p-6 text-center">
      <h2 className="font-semibold text-lg">An admin action failed</h2>
      <p className="mt-1 text-sm text-muted-foreground">{error.message}</p>
      <Button onClick={reset} className="mt-4">
        Retry
      </Button>
    </div>
  );
}
