// src/app/api/products/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { getCatalog } from "@/server/data/catalog";
import { productSearchSchema } from "@/lib/validations";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const parsed = productSearchSchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const products = await getCatalog({
    q: parsed.data.q,
    categorySlug: parsed.data.category
  });

  return NextResponse.json({ count: products.length, products }, { status: 200 });
}
