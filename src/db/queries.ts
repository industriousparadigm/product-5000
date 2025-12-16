import { eq, desc, asc, and, sql } from "drizzle-orm";
import { db } from "./index";
import { products, ideas, type Product, type Idea } from "./schema";

// Product queries

export async function getProductsByUser(userId: string): Promise<Product[]> {
  return db.query.products.findMany({
    where: eq(products.userId, userId),
    orderBy: desc(products.updatedAt),
  });
}

export async function getProductById(
  productId: string,
  userId: string
): Promise<Product | undefined> {
  return db.query.products.findFirst({
    where: and(eq(products.id, productId), eq(products.userId, userId)),
  });
}

export async function createProduct(
  name: string,
  description: string | null,
  userId: string
): Promise<Product> {
  const [product] = await db
    .insert(products)
    .values({ name, description, userId })
    .returning();
  return product;
}

export async function updateProduct(
  productId: string,
  userId: string,
  data: { name?: string; description?: string | null }
): Promise<Product | undefined> {
  const [product] = await db
    .update(products)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(products.id, productId), eq(products.userId, userId)))
    .returning();
  return product;
}

export async function deleteProduct(
  productId: string,
  userId: string
): Promise<boolean> {
  const result = await db
    .delete(products)
    .where(and(eq(products.id, productId), eq(products.userId, userId)));
  return result.rowCount !== null && result.rowCount > 0;
}

// Idea queries

export type IdeaSortField =
  | "impact"
  | "ease"
  | "impactEase"
  | "confidenceBasis"
  | "status"
  | "funnelStage"
  | "createdAt";

export type IdeaFilters = {
  status?: string;
  funnelStage?: string;
  confidenceBasis?: string;
};

export async function getIdeasByProduct(
  productId: string,
  sortField: IdeaSortField = "createdAt",
  sortDirection: "asc" | "desc" = "desc",
  filters: IdeaFilters = {}
): Promise<Idea[]> {
  const conditions = [eq(ideas.productId, productId)];

  if (filters.status) {
    conditions.push(eq(ideas.status, filters.status));
  }
  if (filters.funnelStage) {
    conditions.push(eq(ideas.funnelStage, filters.funnelStage));
  }
  if (filters.confidenceBasis) {
    conditions.push(eq(ideas.confidenceBasis, filters.confidenceBasis));
  }

  const sortFn = sortDirection === "asc" ? asc : desc;

  // Handle special case for impact x ease sorting
  if (sortField === "impactEase") {
    return db.query.ideas.findMany({
      where: and(...conditions),
      orderBy: sql`COALESCE(${ideas.impact}, 0) * COALESCE(${ideas.ease}, 0) ${sortDirection === "desc" ? sql`DESC` : sql`ASC`}`,
    });
  }

  const orderByField = {
    impact: ideas.impact,
    ease: ideas.ease,
    confidenceBasis: ideas.confidenceBasis,
    status: ideas.status,
    funnelStage: ideas.funnelStage,
    createdAt: ideas.createdAt,
  }[sortField];

  return db.query.ideas.findMany({
    where: and(...conditions),
    orderBy: sortFn(orderByField),
  });
}

export async function getIdeaById(ideaId: string): Promise<Idea | undefined> {
  return db.query.ideas.findFirst({
    where: eq(ideas.id, ideaId),
  });
}

export async function createIdea(
  data: Omit<Idea, "id" | "createdAt" | "updatedAt">
): Promise<Idea> {
  const [idea] = await db.insert(ideas).values(data).returning();
  return idea;
}

export async function updateIdea(
  ideaId: string,
  data: Partial<Omit<Idea, "id" | "productId" | "createdAt" | "updatedAt">>
): Promise<Idea | undefined> {
  const [idea] = await db
    .update(ideas)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(ideas.id, ideaId))
    .returning();
  return idea;
}

export async function deleteIdea(ideaId: string): Promise<boolean> {
  const result = await db.delete(ideas).where(eq(ideas.id, ideaId));
  return result.rowCount !== null && result.rowCount > 0;
}

// Dashboard queries

export async function getIdeaCountsByStatus(
  productId: string
): Promise<{ status: string; count: number }[]> {
  const result = await db
    .select({
      status: ideas.status,
      count: sql<number>`count(*)::int`,
    })
    .from(ideas)
    .where(eq(ideas.productId, productId))
    .groupBy(ideas.status);

  return result;
}

export async function getIdeaCountsByFunnelStage(
  productId: string
): Promise<{ funnelStage: string | null; count: number }[]> {
  const result = await db
    .select({
      funnelStage: ideas.funnelStage,
      count: sql<number>`count(*)::int`,
    })
    .from(ideas)
    .where(eq(ideas.productId, productId))
    .groupBy(ideas.funnelStage);

  return result;
}

export async function getTopIdeasByImpactEase(
  productId: string,
  limit: number = 5
): Promise<Idea[]> {
  return db.query.ideas.findMany({
    where: eq(ideas.productId, productId),
    orderBy: sql`COALESCE(${ideas.impact}, 0) * COALESCE(${ideas.ease}, 0) DESC`,
    limit,
  });
}
