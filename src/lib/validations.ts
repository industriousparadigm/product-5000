import { z } from "zod";
import { funnelStages, confidenceBases, ideaStatuses } from "@/db/schema";

// Product validations

export const createProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  description: z.string().max(500, "Description too long").nullable(),
});

export const updateProductSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long").optional(),
  description: z.string().max(500, "Description too long").nullable().optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;

// Idea validations

export const createIdeaSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  problem: z.string().min(1, "Problem is required").max(1000, "Problem too long"),
  funnelStage: z.enum(funnelStages).nullable().optional(),
  impact: z.number().int().min(1).max(10).nullable().optional(),
  ease: z.number().int().min(1).max(10).nullable().optional(),
  confidenceBasis: z.enum(confidenceBases).nullable().optional(),
  smallestTest: z.string().max(500, "Smallest test too long").nullable().optional(),
  status: z.enum(ideaStatuses).default("Parked"),
  evidence: z.string().max(2000, "Evidence too long").nullable().optional(),
});

export const updateIdeaSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long").optional(),
  problem: z.string().min(1, "Problem is required").max(1000, "Problem too long").optional(),
  funnelStage: z.enum(funnelStages).nullable().optional(),
  impact: z.number().int().min(1).max(10).nullable().optional(),
  ease: z.number().int().min(1).max(10).nullable().optional(),
  confidenceBasis: z.enum(confidenceBases).nullable().optional(),
  smallestTest: z.string().max(500, "Smallest test too long").nullable().optional(),
  status: z.enum(ideaStatuses).optional(),
  evidence: z.string().max(2000, "Evidence too long").nullable().optional(),
});

export type CreateIdeaInput = z.infer<typeof createIdeaSchema>;
export type UpdateIdeaInput = z.infer<typeof updateIdeaSchema>;

// Query params validation

export const ideaFiltersSchema = z.object({
  status: z.enum(ideaStatuses).optional(),
  funnelStage: z.enum(funnelStages).optional(),
  confidenceBasis: z.enum(confidenceBases).optional(),
  sortField: z
    .enum([
      "impact",
      "ease",
      "impactEase",
      "confidenceBasis",
      "status",
      "funnelStage",
      "createdAt",
    ])
    .default("createdAt"),
  sortDirection: z.enum(["asc", "desc"]).default("desc"),
});

export type IdeaFiltersInput = z.infer<typeof ideaFiltersSchema>;
