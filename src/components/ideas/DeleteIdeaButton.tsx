"use client";

import { useState, useTransition } from "react";
import { deleteIdea } from "@/actions/ideas";
import { Trash2, X } from "lucide-react";

type DeleteIdeaButtonProps = {
  ideaId: string;
  productId: string;
  ideaName: string;
  compact?: boolean;
};

export function DeleteIdeaButton({
  ideaId,
  productId,
  ideaName,
  compact,
}: DeleteIdeaButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      await deleteIdea(ideaId, productId);
      setIsOpen(false);
    });
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1.5 text-text-muted hover:text-neon-magenta transition-colors"
          title="Delete idea"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn btn-danger"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      )}

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
                Delete Idea
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
              <span className="text-neon-magenta font-medium">{ideaName}</span>?
              This action cannot be undone.
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
                {isPending ? "Deleting..." : "Delete Idea"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
