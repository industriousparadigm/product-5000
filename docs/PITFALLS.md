# Pitfalls Log

Append-only log of things that broke or almost broke.

---

## [2024-12-16] NextAuth Drizzle Adapter Schema Requirements

**What happened:** TypeScript build failed with error about `sessionToken` not being a primary key in the sessions table.

**Why it happened:** The `@auth/drizzle-adapter` expects specific schema requirements:
- `sessions.sessionToken` must be the primary key (not a separate UUID id)
- `verification_tokens` needs a composite primary key of `(identifier, token)`

**How it was fixed:**
1. Changed sessions table to use `sessionToken` as primary key instead of UUID
2. Added composite primary key to verification_tokens table
3. Dropped old tables and re-pushed schema

**How to avoid:** When using NextAuth with Drizzle, check the adapter's documentation for exact schema requirements. The adapter has strict type constraints that won't accept alternative table structures.
