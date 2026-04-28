// src/lib/auth.ts
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Role, type User } from "@prisma/client";
import { STATIC_ADMIN } from "@/lib/static-data";

const SESSION_COOKIE = "roofmate_session";
const SESSION_VALUE = "static-admin";

export type SessionUser = Pick<User, "id" | "email" | "name" | "role" | "allowedTier">;

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const value = cookies().get(SESSION_COOKIE)?.value;
  if (value !== SESSION_VALUE) return null;
  return STATIC_ADMIN;
});

export async function requireAdmin(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== Role.ADMIN) redirect("/?error=forbidden");
  return user;
}

export async function requireSession(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
