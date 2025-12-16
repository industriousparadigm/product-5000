# Architecture

## High-Level Design

Product 5000 is a full-stack Next.js application using the App Router. It follows a simple, flat architecture optimized for solo PM use.

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js App Router                        │
│  ┌─────────────────┐  ┌─────────────────┐                   │
│  │  Landing Page   │  │ Protected Routes │                  │
│  │   (public)      │  │  (auth required) │                  │
│  └─────────────────┘  └─────────────────┘                   │
│            │                    │                            │
│            │                    ▼                            │
│            │          ┌─────────────────┐                   │
│            │          │  Server Actions │                   │
│            │          │  (mutations)    │                   │
│            │          └─────────────────┘                   │
│            │                    │                            │
│            ▼                    ▼                            │
│  ┌─────────────────────────────────────────┐                │
│  │           NextAuth.js                    │                │
│  │        (GitHub OAuth)                    │                │
│  └─────────────────────────────────────────┘                │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Drizzle ORM                               │
│              (type-safe queries)                             │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    NeonDB Postgres                           │
│                 (serverless database)                        │
└─────────────────────────────────────────────────────────────┘
```

## Folder Structure

```
/src
├── /app                      # Next.js App Router
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Landing page (public)
│   ├── /api
│   │   └── /auth/[...nextauth]  # NextAuth API route
│   └── /(protected)          # Route group for auth-required pages
│       ├── layout.tsx        # Auth check wrapper
│       ├── /products         # Products list and management
│       │   ├── page.tsx      # Products list
│       │   └── /[id]         # Single product
│       │       ├── page.tsx  # Product dashboard + ideas
│       │       └── /ideas    # Ideas management
│
├── /components               # Reusable UI components
│   ├── /ui                   # Base UI primitives
│   ├── /products             # Product-specific components
│   ├── /ideas                # Idea-specific components
│   └── /dashboard            # Dashboard components
│
├── /db                       # Database layer
│   ├── index.ts              # Database client
│   ├── schema.ts             # Drizzle schema
│   └── queries.ts            # Reusable queries
│
├── /lib                      # Utilities
│   ├── auth.ts               # NextAuth config
│   └── validations.ts        # Zod schemas
│
└── /actions                  # Server actions
    ├── products.ts           # Product mutations
    └── ideas.ts              # Idea mutations
```

## Data Flow

### Reading Data (Server Components)
```
Page Component (server)
  → db/queries.ts
  → Drizzle ORM
  → NeonDB
  → Data returned directly to component
```

### Mutating Data (Server Actions)
```
Client Component (form/button)
  → Server Action (/actions/*.ts)
  → Zod validation
  → db/queries.ts or direct Drizzle
  → NeonDB
  → revalidatePath() or redirect()
```

### Authentication Flow
```
User clicks "Sign in with GitHub"
  → NextAuth redirects to GitHub
  → GitHub authenticates
  → Callback to NextAuth
  → Session created
  → User redirected to /products
```

## Key Patterns

1. **Server Components by Default**: All pages are server components unless they need interactivity
2. **Client Components for Interactivity**: Forms, modals, and interactive elements use 'use client'
3. **Server Actions for Mutations**: No API routes for data changes, all through server actions
4. **Zod for Validation**: All user input validated with Zod before database operations
5. **Drizzle for Type Safety**: Full type inference from schema to queries
