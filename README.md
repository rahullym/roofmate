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

## Deploy

1. Push to GitHub.
2. Import the repo into Vercel.
3. Set the env vars from `.env.example` in **Project Settings → Environment Variables**.
4. Add your prod URL to Supabase **Redirect URLs**.
5. The first build runs `prisma generate`. Run `pnpm db:push` against your prod database from your machine before the first deploy.

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
