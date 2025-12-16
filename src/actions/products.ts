"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import {
  createProduct as dbCreateProduct,
  updateProduct as dbUpdateProduct,
  deleteProduct as dbDeleteProduct,
} from "@/db/queries";
import { createProductSchema, updateProductSchema } from "@/lib/validations";

export async function createProduct(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
  };

  const validated = createProductSchema.parse(rawData);
  const product = await dbCreateProduct(
    validated.name,
    validated.description,
    session.user.id
  );

  revalidatePath("/products");
  redirect(`/products/${product.id}`);
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const rawData = {
    name: formData.get("name") as string | undefined,
    description: formData.has("description")
      ? (formData.get("description") as string) || null
      : undefined,
  };

  const validated = updateProductSchema.parse(rawData);
  await dbUpdateProduct(productId, session.user.id, validated);

  revalidatePath("/products");
  revalidatePath(`/products/${productId}`);
}

export async function deleteProduct(productId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await dbDeleteProduct(productId, session.user.id);

  revalidatePath("/products");
  redirect("/products");
}
