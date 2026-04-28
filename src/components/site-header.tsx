// src/components/site-header.tsx
import Link from "next/link";
import { Building2, ShieldCheck, LogIn, LogOut } from "lucide-react";
import { Role } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export async function SiteHeader() {
  const user = await getSessionUser();
  const isAdmin = user?.role === Role.ADMIN;

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-top">
      <div className="container flex h-14 sm:h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Building2 className="h-5 w-5 text-primary" aria-hidden />
          <span className="text-base sm:text-lg">RoofMate</span>
          <Badge variant="outline" className="ml-1 hidden sm:inline-flex">
            Catalog
          </Badge>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAdmin ? (
            <Button asChild variant="ghost" size="sm" className="px-2 sm:px-3">
              <Link href="/admin" className="flex items-center gap-1" aria-label="Admin">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                <span className="hidden sm:inline">Admin</span>
              </Link>
            </Button>
          ) : null}
          <ThemeToggle />
          {user ? (
            <form action="/auth/sign-out" method="post">
              <Button variant="outline" size="sm" type="submit" className="px-2 sm:px-3" aria-label="Sign out">
                <LogOut className="h-4 w-4 sm:hidden" aria-hidden />
                <span className="hidden sm:inline">Sign out</span>
              </Button>
            </form>
          ) : (
            <Button asChild variant="default" size="sm" className="px-2 sm:px-3">
              <Link href="/login" aria-label="Sign in">
                <LogIn className="h-4 w-4 sm:hidden" aria-hidden />
                <span className="hidden sm:inline">Sign in</span>
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
