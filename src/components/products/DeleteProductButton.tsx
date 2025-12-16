"use client";

import { useState, useTransition } from "react";
import { deleteProduct } from "@/actions/products";
import { Trash2, X } from "lucide-react";

type DeleteProductButtonProps = {
  productId: string;
  productName: string;
};

export function DeleteProductButton({
  productId,
  productName,
}: DeleteProductButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteProduct(productId);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="btn btn-danger"
      >
        <Trash2 className="w-4 h-4" />
        Delete
      </button>

      {isOpen && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          />
          <div className="modal p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-text-primary">
                Delete Product
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-text-secondary mb-6">
              Are you sure you want to delete{" "}
              <span className="text-neon-magenta font-medium">
                {productName}
              </span>
              ? This will permanently delete all associated ideas. This action
              cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="btn btn-danger flex-1"
              >
                {isPending ? "Deleting..." : "Delete Product"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
