# Decision Log

Append-only log of architectural and design decisions.

---

## [2024-12-16] Use Server Actions over API Routes

**Context:** Need to handle data mutations (create/update/delete) for products and ideas.

**Options considered:**
1. Traditional API routes in /api
2. Server Actions (React 19 / Next.js 14+)
3. tRPC

**Decision:** Server Actions

**Why:**
- Native to Next.js App Router, zero additional dependencies
- Type-safe by default with TypeScript
- Simpler mental model - functions, not endpoints
- Better progressive enhancement (works without JS)
- Less boilerplate than API routes or tRPC

**Consequences:**
- All mutations go through server actions in /src/actions
- Validation happens server-side with Zod
- Use revalidatePath() for cache invalidation

---

## [2024-12-16] NeonDB with Drizzle ORM

**Context:** Need a database for product and idea storage.

**Options considered:**
1. Prisma + PlanetScale
2. Drizzle + NeonDB
3. Supabase
4. SQLite (local)

**Decision:** Drizzle + NeonDB

**Why:**
- Drizzle: Lightweight, SQL-like syntax, excellent TypeScript inference
- NeonDB: Serverless Postgres, generous free tier, instant branching
- Both optimized for edge/serverless environments
- Drizzle's schema-as-code is more explicit than Prisma's

**Consequences:**
- Schema defined in /src/db/schema.ts
- Migrations via drizzle-kit push (simple for solo dev)
- Connection pooling handled by Neon's serverless driver

---

## [2024-12-16] NextAuth with GitHub Provider Only

**Context:** Need authentication to protect user data.

**Options considered:**
1. NextAuth with multiple providers
2. Clerk
3. Auth0
4. Custom auth

**Decision:** NextAuth with GitHub only

**Why:**
- Target users (solo PMs) likely have GitHub accounts
- Single provider simplifies onboarding
- NextAuth is free and well-maintained
- Easy to add more providers later if needed

**Consequences:**
- Users must have GitHub account
- User ID in our system = GitHub user ID
- Session management handled by NextAuth

---

## [2024-12-16] Route Groups for Auth Protection

**Context:** Need to protect most routes while keeping landing page public.

**Options considered:**
1. Middleware checking every route
2. Route groups with layout-level auth
3. Per-page auth checks

**Decision:** Route groups with layout-level auth

**Why:**
- Clean separation: /(protected) vs public pages
- Single auth check in layout, not repeated per page
- Middleware can be added later for edge cases
- More explicit about which routes are protected

**Consequences:**
- All auth-required pages go in /(protected) group
- Landing page stays at root
- Protected layout handles redirect to sign-in

---

## [2024-12-16] Cyberpunk Design System

**Context:** Need a visual design direction.

**Options considered:**
1. Minimal/clean (shadcn/ui style)
2. Cyberpunk/neon
3. Corporate/professional

**Decision:** Cyberpunk/neon aesthetic

**Why:**
- Differentiated from typical SaaS tools
- Fun to build and use
- Dark mode by default (better for focus)
- Glow effects provide clear interaction feedback

**Consequences:**
- Dark background (#0a0a0f)
- Neon accents: cyan (#00fff2), magenta (#ff00ff), green (#39ff14)
- Glow effects via box-shadow and text-shadow
- Monospace font for data, sans-serif for UI
