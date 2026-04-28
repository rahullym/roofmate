// src/app/auth/sign-out/route.ts
import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  cookies().delete("roofmate_session");
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/`, { status: 303 });
}
