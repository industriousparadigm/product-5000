"use client";

import { useState } from "react";
import type { Idea } from "@/db/schema";
import { IdeaForm } from "./IdeaForm";
import { DeleteIdeaButton } from "./DeleteIdeaButton";
import { StatusBadge, ConfidenceBadge, FunnelBadge } from "./Badges";

type IdeaRowProps = {
  idea: Idea;
  productId: string;
};

export function IdeaRow({ idea, productId }: IdeaRowProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const score =
    idea.impact && idea.ease ? (idea.impact * idea.ease).toString() : "-";

  return (
    <>
      <tr
        className="cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
        onKeyDown={(e) => e.key === "Enter" && setIsExpanded(!isExpanded)}
        tabIndex={0}
      >
        <td>
          <div className="font-medium text-text-primary">{idea.name}</div>
          <div className="text-xs text-text-muted mt-0.5 line-clamp-1">
            {idea.problem}
          </div>
        </td>
        <td>
          {idea.funnelStage ? (
            <FunnelBadge stage={idea.funnelStage} />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td>
          {idea.impact ? (
            <span className="font-mono text-neon-cyan">{idea.impact}</span>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td>
          {idea.ease ? (
            <span className="font-mono text-neon-green">{idea.ease}</span>
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td>
          <span
            className={`font-mono font-bold ${score !== "-" ? "text-neon-magenta" : "text-text-muted"}`}
          >
            {score}
          </span>
        </td>
        <td>
          {idea.confidenceBasis ? (
            <ConfidenceBadge basis={idea.confidenceBasis} />
          ) : (
            <span className="text-text-muted">-</span>
          )}
        </td>
        <td>
          <StatusBadge status={idea.status} />
        </td>
        <td onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <IdeaForm productId={productId} idea={idea} compact />
            <DeleteIdeaButton
              ideaId={idea.id}
              productId={productId}
              ideaName={idea.name}
              compact
            />
          </div>
        </td>
      </tr>

      {/* Expanded details */}
      {isExpanded && (
        <tr>
          <td colSpan={8} className="bg-bg-hover !p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                  Problem
                </h4>
                <p className="text-text-secondary text-sm">{idea.problem}</p>
              </div>

              {idea.smallestTest && (
                <div>
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                    Smallest Test
                  </h4>
                  <p className="text-text-secondary text-sm">
                    {idea.smallestTest}
                  </p>
                </div>
              )}

              {idea.evidence && (
                <div className="md:col-span-2">
                  <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-1">
                    Evidence
                  </h4>
                  <p className="text-text-secondary text-sm">{idea.evidence}</p>
                </div>
              )}

              <div className="text-xs text-text-muted">
                Created{" "}
                {new Date(idea.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                {idea.updatedAt !== idea.createdAt && (
                  <>
                    {" "}
                    · Updated{" "}
                    {new Date(idea.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
