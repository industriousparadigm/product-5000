"use client";

import { useState, useTransition } from "react";
import { createProduct, updateProduct } from "@/actions/products";
import { Plus, X } from "lucide-react";
import type { Product } from "@/db/schema";

type ProductFormProps = {
  product?: Product;
  onSuccess?: () => void;
};

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditing = !!product;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (isEditing) {
        await updateProduct(product.id, formData);
        onSuccess?.();
      } else {
        await createProduct(formData);
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className={isEditing ? "btn btn-secondary" : "btn btn-primary"}
      >
        {isEditing ? (
          "Edit"
        ) : (
          <>
            <Plus className="w-4 h-4" />
            New Product
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          />
          <div className="modal p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                {isEditing ? "Edit Product" : "New Product"}
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form action={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={product?.name}
                  required
                  autoFocus
                  className="input"
                  placeholder="My Awesome Product"
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  defaultValue={product?.description || ""}
                  rows={3}
                  className="input resize-none"
                  placeholder="What is this product about?"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="btn btn-primary flex-1"
                >
                  {isPending
                    ? "Saving..."
                    : isEditing
                      ? "Save Changes"
                      : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
