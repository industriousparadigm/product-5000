import {
  pgTable,
  text,
  timestamp,
  uuid,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";

// NextAuth required tables
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [primaryKey({ columns: [table.identifier, table.token] })]
);

// Application tables

export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [index("products_user_id_idx").on(table.userId)]
);

// Funnel stages L1-L7
export const funnelStages = [
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
] as const;
export type FunnelStage = (typeof funnelStages)[number];

// Confidence basis options
export const confidenceBases = [
  "Opinion",
  "Anecdote",
  "Data",
  "Validated",
] as const;
export type ConfidenceBasis = (typeof confidenceBases)[number];

// Idea status options
export const ideaStatuses = [
  "Parked",
  "Testing",
  "Validated",
  "Shipped",
  "Killed",
] as const;
export type IdeaStatus = (typeof ideaStatuses)[number];

export const ideas = pgTable(
  "ideas",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    problem: text("problem").notNull(),
    funnelStage: text("funnel_stage"),
    impact: integer("impact"),
    ease: integer("ease"),
    confidenceBasis: text("confidence_basis"),
    smallestTest: text("smallest_test"),
    status: text("status").default("Parked").notNull(),
    evidence: text("evidence"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    index("ideas_product_id_idx").on(table.productId),
    index("ideas_status_idx").on(table.status),
    index("ideas_funnel_stage_idx").on(table.funnelStage),
  ]
);

// Type exports for use in queries
export type User = typeof users.$inferSelect;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Idea = typeof ideas.$inferSelect;
export type NewIdea = typeof ideas.$inferInsert;
