"use client";

import { useState, useTransition } from "react";
import { createIdea, updateIdea } from "@/actions/ideas";
import {
  funnelStages,
  confidenceBases,
  ideaStatuses,
  type Idea,
} from "@/db/schema";
import { Plus, X, Edit2 } from "lucide-react";

type IdeaFormProps = {
  productId: string;
  idea?: Idea;
  compact?: boolean;
};

export function IdeaForm({ productId, idea, compact }: IdeaFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isEditing = !!idea;

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      if (isEditing) {
        await updateIdea(idea.id, productId, formData);
      } else {
        await createIdea(productId, formData);
      }
      setIsOpen(false);
    });
  };

  return (
    <>
      {compact ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="p-1.5 text-text-muted hover:text-neon-cyan transition-colors"
          title="Edit idea"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="btn btn-primary"
        >
          <Plus className="w-4 h-4" />
          New Idea
        </button>
      )}

      {isOpen && (
        <>
          <div
            className="modal-backdrop"
            onClick={() => setIsOpen(false)}
            onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)}
          />
          <div className="modal p-6 max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-text-primary">
                {isEditing ? "Edit Idea" : "New Idea"}
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
              {/* Required fields */}
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
                  defaultValue={idea?.name}
                  required
                  autoFocus
                  className="input"
                  placeholder="Short, memorable name for this idea"
                />
              </div>

              <div>
                <label
                  htmlFor="problem"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Problem *
                </label>
                <textarea
                  id="problem"
                  name="problem"
                  defaultValue={idea?.problem}
                  required
                  rows={2}
                  className="input resize-none"
                  placeholder="What problem does this solve?"
                />
              </div>

              {/* Optional fields in a grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <label
                    htmlFor="funnelStage"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Funnel Stage
                  </label>
                  <select
                    id="funnelStage"
                    name="funnelStage"
                    defaultValue={idea?.funnelStage || ""}
                    className="input select"
                  >
                    <option value="">Select...</option>
                    {funnelStages.map((stage) => (
                      <option key={stage} value={stage}>
                        {stage}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="impact"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Impact (1-10)
                  </label>
                  <input
                    type="number"
                    id="impact"
                    name="impact"
                    min={1}
                    max={10}
                    defaultValue={idea?.impact || ""}
                    className="input"
                    placeholder="1-10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="ease"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Ease (1-10)
                  </label>
                  <input
                    type="number"
                    id="ease"
                    name="ease"
                    min={1}
                    max={10}
                    defaultValue={idea?.ease || ""}
                    className="input"
                    placeholder="1-10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="confidenceBasis"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Confidence
                  </label>
                  <select
                    id="confidenceBasis"
                    name="confidenceBasis"
                    defaultValue={idea?.confidenceBasis || ""}
                    className="input select"
                  >
                    <option value="">Select...</option>
                    {confidenceBases.map((basis) => (
                      <option key={basis} value={basis}>
                        {basis}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    name="status"
                    defaultValue={idea?.status || "Parked"}
                    className="input select"
                  >
                    {ideaStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="smallestTest"
                    className="block text-sm font-medium text-text-secondary mb-1"
                  >
                    Smallest Test
                  </label>
                  <input
                    type="text"
                    id="smallestTest"
                    name="smallestTest"
                    defaultValue={idea?.smallestTest || ""}
                    className="input"
                    placeholder="What's the cheapest way to validate?"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="evidence"
                  className="block text-sm font-medium text-text-secondary mb-1"
                >
                  Evidence
                </label>
                <textarea
                  id="evidence"
                  name="evidence"
                  defaultValue={idea?.evidence || ""}
                  rows={2}
                  className="input resize-none"
                  placeholder="Notes on what you've learned..."
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
                      : "Create Idea"}
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}
