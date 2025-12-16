# Product 5000

A product ideas management app for solo PMs. Built through AI-human collaboration, optimized for readability and editability by AI agents.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables (copy from .env.example)
cp .env.example .env.local
# Then fill in DATABASE_URL, GITHUB_ID, GITHUB_SECRET, NEXTAUTH_SECRET

# Run database migrations
npm run db:push

# Start development server
npm run dev
```

## Where Things Live

```
/src
  /app                 # Next.js App Router pages and layouts
    /api               # API routes (NextAuth, etc.)
    /(auth)            # Protected routes (products, ideas)
    /page.tsx          # Landing page (public)
  /components          # Reusable React components
  /db                  # Database layer
    /schema.ts         # Drizzle schema definitions
    /queries.ts        # Reusable database queries
    /index.ts          # Database client export
  /lib                 # Utilities and helpers
    /auth.ts           # NextAuth configuration
    /validations.ts    # Zod schemas
/docs                  # Project documentation
  /ARCHITECTURE.md     # System design
  /SCHEMA.md           # Data model
  /DECISIONS.md        # Decision log
  /PITFALLS.md         # Things that broke
  /PRODUCT.md          # Product definition
  /AI_GUIDE.md         # Instructions for AI agents
```

## Key Commands

```bash
npm run dev           # Start dev server
npm run build         # Production build
npm run lint          # Run Biome linter
npm run format        # Format code with Biome
npm run db:push       # Push schema to database
npm run db:studio     # Open Drizzle Studio
```

## Self-Reminder

I document as I build. I consult /docs before making decisions. I update docs when I learn something.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS 4
- **Database:** NeonDB Postgres via Drizzle ORM
- **Auth:** NextAuth.js with GitHub provider
- **Validation:** Zod

## Design Philosophy

Cyberpunk / neon aesthetic with dark backgrounds and neon accents (cyan, magenta, electric green). Glow effects on hover/focus. Fast, keyboard navigable, no clutter.
