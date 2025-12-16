"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import type { Idea } from "@/db/schema";
import {
  funnelStages,
  confidenceBases,
  ideaStatuses,
  type FunnelStage,
  type ConfidenceBasis,
  type IdeaStatus,
} from "@/db/schema";
import type { IdeaSortField, IdeaFilters } from "@/db/queries";
import { ChevronUp, ChevronDown, Filter, X, Lightbulb } from "lucide-react";
import { IdeaRow } from "./IdeaRow";

type IdeasTableProps = {
  ideas: Idea[];
  productId: string;
  currentSort: IdeaSortField;
  currentDirection: "asc" | "desc";
  currentFilters: IdeaFilters;
};

export function IdeasTable({
  ideas,
  productId,
  currentSort,
  currentDirection,
  currentFilters,
}: IdeasTableProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParams = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleSort = (field: IdeaSortField) => {
    if (currentSort === field) {
      updateParams({ dir: currentDirection === "asc" ? "desc" : "asc" });
    } else {
      updateParams({ sort: field, dir: "desc" });
    }
  };

  const handleFilter = (key: keyof IdeaFilters, value: string) => {
    updateParams({ [key]: value || undefined });
  };

  const clearFilters = () => {
    updateParams({
      status: undefined,
      funnelStage: undefined,
      confidenceBasis: undefined,
    });
  };

  const hasActiveFilters =
    currentFilters.status ||
    currentFilters.funnelStage ||
    currentFilters.confidenceBasis;

  const SortHeader = ({
    field,
    children,
  }: {
    field: IdeaSortField;
    children: React.ReactNode;
  }) => (
    <th
      className="sortable"
      onClick={() => handleSort(field)}
      onKeyDown={(e) => e.key === "Enter" && handleSort(field)}
      tabIndex={0}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {currentSort === field &&
          (currentDirection === "asc" ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          ))}
      </span>
    </th>
  );

  return (
    <div>
      {/* Filters */}
      <div className="flex items-center gap-3 mb-4">
        <Filter className="w-4 h-4 text-text-muted" />

        <select
          value={currentFilters.status || ""}
          onChange={(e) => handleFilter("status", e.target.value)}
          className="input select w-36 text-sm py-1"
        >
          <option value="">All Status</option>
          {ideaStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={currentFilters.funnelStage || ""}
          onChange={(e) => handleFilter("funnelStage", e.target.value)}
          className="input select w-36 text-sm py-1"
        >
          <option value="">All Stages</option>
          {funnelStages.map((stage) => (
            <option key={stage} value={stage}>
              {stage}
            </option>
          ))}
        </select>

        <select
          value={currentFilters.confidenceBasis || ""}
          onChange={(e) => handleFilter("confidenceBasis", e.target.value)}
          className="input select w-40 text-sm py-1"
        >
          <option value="">All Confidence</option>
          {confidenceBases.map((basis) => (
            <option key={basis} value={basis}>
              {basis}
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="text-text-muted hover:text-neon-magenta transition-colors text-sm flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      {ideas.length === 0 ? (
        <div className="empty-state py-16 border border-border rounded-lg">
          <Lightbulb className="w-12 h-12 text-text-muted" />
          <h3 className="text-lg font-semibold mt-4">No ideas yet</h3>
          <p className="text-text-muted mt-2 max-w-sm">
            {hasActiveFilters
              ? "No ideas match your filters. Try adjusting or clearing them."
              : "Start by adding your first idea using the button above."}
          </p>
        </div>
      ) : (
        <div className="border border-border rounded-lg overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <SortHeader field="createdAt">Name</SortHeader>
                <SortHeader field="funnelStage">Stage</SortHeader>
                <SortHeader field="impact">Impact</SortHeader>
                <SortHeader field="ease">Ease</SortHeader>
                <SortHeader field="impactEase">Score</SortHeader>
                <SortHeader field="confidenceBasis">Confidence</SortHeader>
                <SortHeader field="status">Status</SortHeader>
                <th className="w-20">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ideas.map((idea) => (
                <IdeaRow key={idea.id} idea={idea} productId={productId} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
