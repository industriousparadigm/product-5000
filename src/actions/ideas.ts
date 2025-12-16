"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { getProductById } from "@/db/queries";
import {
  createIdea as dbCreateIdea,
  updateIdea as dbUpdateIdea,
  deleteIdea as dbDeleteIdea,
} from "@/db/queries";
import { createIdeaSchema, updateIdeaSchema } from "@/lib/validations";

// Helper to verify product ownership
async function verifyProductAccess(productId: string): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const product = await getProductById(productId, session.user.id);
  return !!product;
}

export async function createIdea(productId: string, formData: FormData) {
  const hasAccess = await verifyProductAccess(productId);
  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    problem: formData.get("problem") as string,
    funnelStage: (formData.get("funnelStage") as string) || null,
    impact: formData.get("impact")
      ? Number.parseInt(formData.get("impact") as string, 10)
      : null,
    ease: formData.get("ease")
      ? Number.parseInt(formData.get("ease") as string, 10)
      : null,
    confidenceBasis: (formData.get("confidenceBasis") as string) || null,
    smallestTest: (formData.get("smallestTest") as string) || null,
    status: (formData.get("status") as string) || "Parked",
    evidence: (formData.get("evidence") as string) || null,
  };

  const validated = createIdeaSchema.parse(rawData);
  await dbCreateIdea({
    ...validated,
    productId,
    funnelStage: validated.funnelStage ?? null,
    impact: validated.impact ?? null,
    ease: validated.ease ?? null,
    confidenceBasis: validated.confidenceBasis ?? null,
    smallestTest: validated.smallestTest ?? null,
    status: validated.status,
    evidence: validated.evidence ?? null,
  });

  revalidatePath(`/products/${productId}`);
}

export async function updateIdea(
  ideaId: string,
  productId: string,
  formData: FormData
) {
  const hasAccess = await verifyProductAccess(productId);
  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const rawData: Record<string, unknown> = {};

  // Only include fields that were submitted
  if (formData.has("name")) rawData.name = formData.get("name") as string;
  if (formData.has("problem"))
    rawData.problem = formData.get("problem") as string;
  if (formData.has("funnelStage"))
    rawData.funnelStage = (formData.get("funnelStage") as string) || null;
  if (formData.has("impact"))
    rawData.impact = formData.get("impact")
      ? Number.parseInt(formData.get("impact") as string, 10)
      : null;
  if (formData.has("ease"))
    rawData.ease = formData.get("ease")
      ? Number.parseInt(formData.get("ease") as string, 10)
      : null;
  if (formData.has("confidenceBasis"))
    rawData.confidenceBasis =
      (formData.get("confidenceBasis") as string) || null;
  if (formData.has("smallestTest"))
    rawData.smallestTest = (formData.get("smallestTest") as string) || null;
  if (formData.has("status"))
    rawData.status = formData.get("status") as string;
  if (formData.has("evidence"))
    rawData.evidence = (formData.get("evidence") as string) || null;

  const validated = updateIdeaSchema.parse(rawData);
  await dbUpdateIdea(ideaId, validated);

  revalidatePath(`/products/${productId}`);
}

export async function deleteIdea(ideaId: string, productId: string) {
  const hasAccess = await verifyProductAccess(productId);
  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  await dbDeleteIdea(ideaId);

  revalidatePath(`/products/${productId}`);
}

// Quick status update action for inline updates
export async function updateIdeaStatus(
  ideaId: string,
  productId: string,
  status: string
) {
  const hasAccess = await verifyProductAccess(productId);
  if (!hasAccess) {
    throw new Error("Unauthorized");
  }

  const validated = updateIdeaSchema.parse({ status });
  await dbUpdateIdea(ideaId, validated);

  revalidatePath(`/products/${productId}`);
}
