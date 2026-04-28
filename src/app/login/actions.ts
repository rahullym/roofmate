// src/app/login/actions.ts
"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const SESSION_COOKIE = "roofmate_session";
const SESSION_VALUE = "static-admin";

const STATIC_USERNAME = "admin";
const STATIC_PASSWORD = "admin";

export type SignInState = { error: string | null };

export async function signInAction(_prev: SignInState, formData: FormData): Promise<SignInState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const nextRaw = String(formData.get("next") ?? "/");
  const next = nextRaw.startsWith("/") ? nextRaw : "/";

  if (username !== STATIC_USERNAME || password !== STATIC_PASSWORD) {
    return { error: "Wrong username or password" };
  }

  cookies().set(SESSION_COOKIE, SESSION_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  redirect(next);
}
