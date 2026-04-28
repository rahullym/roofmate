# RoofMate Catalog

Internal product catalog for a roofing company. One source of truth for products and four pricing tiers (MRP / Retail / B2B / B2C). Customers see only their contracted tier; sales and admin see them all.

Built with **Next.js 14 App Router**, **TypeScript (strict)**, **Tailwind + shadcn/ui**, **Prisma + Supabase Postgres**, and **Supabase Auth** (magic link).

---

## Quick start

### 1. Clone and install

```bash
git clone <repo-url> roofmate
cd roofmate
pnpm install
```

### 2. Provision Supabase

1. Create a project at <https://supabase.com>.
2. In **Project Settings → Database**, copy:
   - the **Pooled** connection string → `DATABASE_URL`
   - the **Direct** connection string → `DIRECT_URL`
3. In **Project Settings → API**, copy:
   - **URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (server-only)
4. In **Authentication → URL Configuration**, add `http://localhost:3000/auth/callback` to **Redirect URLs** (and your prod URL when you deploy).

### 3. Configure env

```bash
cp .env.example .env
# fill in the values from step 2
```

### 4. Migrate and seed

```bash
pnpm db:push      # creates the schema in Supabase
pnpm db:seed      # 3 categories, 9 products, 4 tier prices each, 4 demo users
```

### 5. Run

```bash
pnpm dev
# open http://localhost:3000
```

To use the **admin UI**, sign in with the email you registered for the demo `ADMIN` user (`admin@roofmate.test`) — or, more practically, sign in with your own email, then in the Supabase SQL editor run:

```sql
update "User" set role = 'ADMIN', "allowedTier" = 'MRP' where email = 'you@example.com';
```

---

## Scripts

| command            | what it does                                      |
| ------------------ | ------------------------------------------------- |
| `pnpm dev`         | Next.js dev server                                |
| `pnpm build`       | Generates Prisma client and builds for production |
| `pnpm start`       | Runs the built app                                |
| `pnpm typecheck`   | `tsc --noEmit`                                    |
| `pnpm lint`        | Next/ESLint                                       |
| `pnpm db:push`     | Push schema to Supabase                           |
| `pnpm db:migrate`  | Create + apply a migration                        |
| `pnpm db:seed`     | Run the seed script                               |
| `pnpm db:studio`   | Open Prisma Studio                                |

---

## How tier visibility works

- Each `User` has a `role` (ADMIN / SALES / DEALER / CUSTOMER) and an `allowedTier` (MRP / RETAIL / B2B / B2C).
- `ADMIN` and `SALES` can switch tiers via the URL `?tier=B2B` and the in-page `<TierToggle />`.
- All other roles see only their `allowedTier`. The `?tier=` param is ignored for them server-side in `resolveVisibleTier`.
- Anonymous visitors see no prices at all.

The single rule that enforces this lives in [src/lib/pricing.ts](src/lib/pricing.ts) (`resolveVisibleTier`). Every catalog query, the product detail page, and the public `/api/products` endpoint route through it.

---

## Pricing history

`PriceTier` is an append-only table. Editing a price never updates the existing row — it inserts a new row with `effectiveFrom = now`. Read paths always pick the most recent row per `(productId, tier)`. This gives you a free price-history audit log.

---

## Deploy to Vercel

### 1. Get your Supabase pooled connection string

Vercel runs each request in a short-lived serverless function. Direct Postgres connections (port 5432) will exhaust Supabase's connection limit within minutes. **Always use the pooled connection (port 6543) for `DATABASE_URL`.**

Supabase Dashboard → **Project Settings → Database → Connection string**:
- Copy the **Transaction** mode URL (port 6543) → this is your `DATABASE_URL`. Append `?pgbouncer=true&connection_limit=1` if not already present.
- Copy the **Direct** URL (port 5432) → this is your `DIRECT_URL` (used by Prisma migrations only).

### 2. Push schema to your prod DB *before* the first deploy

```bash
DATABASE_URL="<direct-url>" DIRECT_URL="<direct-url>" pnpm db:push
DATABASE_URL="<direct-url>" pnpm db:seed   # optional — creates the ADMIN seed user the static login resolves to
```

The static `admin/admin` login resolves to the first `ADMIN` row in the `User` table. Without seeding (or manually inserting an ADMIN user), sign-in succeeds but `/admin` will redirect because there is no admin user to resolve to.

### 3. Import into Vercel

1. **New Project** → import `rahullym/roofmate`.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: leave default (`pnpm build`, which runs `prisma generate && next build`).
4. Set **Environment Variables**:

   | Variable | Value |
   | --- | --- |
   | `DATABASE_URL` | Pooled connection (port 6543) |
   | `DIRECT_URL` | Direct connection (port 5432) |
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref>.supabase.co` (currently unused but kept for re-introducing Supabase auth) |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_*` (same) |
   | `NEXT_PUBLIC_APP_URL` | The Vercel URL once you have it (e.g. `https://roofmate.vercel.app`) |

5. **Deploy**.

### 4. Why `binaryTargets` is set in `prisma/schema.prisma`

Vercel's runtime is Linux + OpenSSL 3.0.x. Without `binaryTargets = ["native", "rhel-openssl-3.0.x"]`, the deployed function fails with `Could not find Prisma engine for runtime "rhel-openssl-3.0.x"`. The `native` target keeps local dev (macOS) working.

### 5. Production hardening before public launch

The current `admin/admin` login is a **demo credential, not real auth**. Before exposing this beyond a private deploy:
- Replace [src/app/login/actions.ts](src/app/login/actions.ts) with proper auth (Supabase Auth, NextAuth, Clerk — the cookie + middleware seam is already in place).
- Or at minimum, change the static credentials and read them from env vars.

---

## Code conventions

- **No `any`**. ESLint enforces it.
- **Server Components by default**. `'use client'` only when state, effects, or browser APIs are needed.
- **Forms** use React Hook Form + Zod, posting to **Server Actions** in `src/server/actions/`.
- **Validation** is shared between client and server (the same Zod schemas in [src/lib/validations.ts](src/lib/validations.ts)).
- **File naming**: `kebab-case.tsx` for files, `PascalCase` for components, `camelCase` for functions.

---

## Next steps (Phase 2 — stubbed, not built)

- **PDF quote generation**: server action that renders a Product + tier set to a PDF (suggest `@react-pdf/renderer`); store in Supabase Storage; expose a `/api/quotes/[id].pdf` route handler.
- **CSV bulk import**: an admin upload form that streams a CSV (`papaparse` on the client), validates each row with `productCreateSchema`, and runs `createProductAction` in batches with a progress toast.
- **Inventory tracking**: add an `Inventory` model with `productId`, `warehouseId`, `quantityOnHand`; surface low-stock badges on product cards; nightly cron via Vercel Cron Jobs.
