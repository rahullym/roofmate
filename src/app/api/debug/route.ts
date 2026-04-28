// src/app/api/debug/route.ts
// Temporary diagnostic endpoint for the deployed app.
// Reports env-var presence and runs a single DB query so failures surface here
// instead of being hidden behind the generic "server-side exception" page.
// REMOVE THIS FILE before exposing the app publicly.
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Diag = {
  env: Record<string, string>;
  database: { host: string; port: string; via: string };
  query: { ok: boolean; categories?: number; products?: number; error?: string };
  node_version: string;
};

function safeUrlInfo(raw: string | undefined): { host: string; port: string; via: string } {
  if (!raw) return { host: "(unset)", port: "(unset)", via: "n/a" };
  try {
    const u = new URL(raw);
    return {
      host: u.hostname,
      port: u.port || "(default)",
      via: u.searchParams.get("pgbouncer") === "true" ? "pooler" : "direct"
    };
  } catch (e) {
    return { host: "(unparseable)", port: "(unparseable)", via: e instanceof Error ? e.message : String(e) };
  }
}

export async function GET() {
  const diag: Diag = {
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
      DIRECT_URL: process.env.DIRECT_URL ? "set" : "MISSING",
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "(unset)",
      NODE_ENV: process.env.NODE_ENV ?? "(unset)",
      VERCEL_REGION: process.env.VERCEL_REGION ?? "(unset)"
    },
    database: safeUrlInfo(process.env.DATABASE_URL),
    query: { ok: false },
    node_version: process.version
  };

  try {
    const [categories, products] = await Promise.all([
      prisma.category.count(),
      prisma.product.count()
    ]);
    diag.query = { ok: true, categories, products };
  } catch (e) {
    diag.query = {
      ok: false,
      error: e instanceof Error ? `${e.name}: ${e.message}` : String(e)
    };
  }

  return NextResponse.json(diag, { status: 200 });
}
