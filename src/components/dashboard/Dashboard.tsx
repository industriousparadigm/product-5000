import type { Idea } from "@/db/schema";
import { funnelStages, ideaStatuses } from "@/db/schema";
import { StatusBadge, FunnelBadge } from "@/components/ideas/Badges";
import {
  BarChart3,
  Layers,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Beaker,
  ParkingCircle,
  Rocket,
} from "lucide-react";

type DashboardProps = {
  statusCounts: { status: string; count: number }[];
  funnelCounts: { funnelStage: string | null; count: number }[];
  topIdeas: Idea[];
};

export function Dashboard({
  statusCounts,
  funnelCounts,
  topIdeas,
}: DashboardProps) {
  // Convert counts to maps for easy lookup
  const statusMap = new Map(statusCounts.map((s) => [s.status, s.count]));
  const funnelMap = new Map(funnelCounts.map((f) => [f.funnelStage, f.count]));

  const totalIdeas = statusCounts.reduce((sum, s) => sum + s.count, 0);

  const statusConfig: Record<
    string,
    { icon: React.ReactNode; color: string }
  > = {
    Parked: {
      icon: <ParkingCircle className="w-4 h-4" />,
      color: "text-text-secondary",
    },
    Testing: {
      icon: <Beaker className="w-4 h-4" />,
      color: "text-neon-cyan",
    },
    Validated: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: "text-neon-green",
    },
    Shipped: {
      icon: <Rocket className="w-4 h-4" />,
      color: "text-neon-purple",
    },
    Killed: {
      icon: <XCircle className="w-4 h-4" />,
      color: "text-neon-magenta",
    },
  };

  if (totalIdeas === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Status Overview */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-4 h-4 text-neon-cyan" />
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            By Status
          </h3>
        </div>
        <div className="space-y-2">
          {ideaStatuses.map((status) => {
            const count = statusMap.get(status) || 0;
            const percentage = totalIdeas > 0 ? (count / totalIdeas) * 100 : 0;
            const config = statusConfig[status];

            return (
              <div key={status} className="flex items-center gap-3">
                <span className={config.color}>{config.icon}</span>
                <span className="text-sm text-text-secondary flex-1">
                  {status}
                </span>
                <span className="font-mono text-sm text-text-primary">
                  {count}
                </span>
                <div className="w-16 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      status === "Parked"
                        ? "bg-text-secondary"
                        : status === "Testing"
                          ? "bg-neon-cyan"
                          : status === "Validated"
                            ? "bg-neon-green"
                            : status === "Shipped"
                              ? "bg-neon-purple"
                              : "bg-neon-magenta"
                    }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Funnel Coverage */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="w-4 h-4 text-neon-magenta" />
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Funnel Coverage
          </h3>
        </div>
        <div className="space-y-2">
          {funnelStages.map((stage) => {
            const count = funnelMap.get(stage) || 0;
            const hasGap = count === 0;

            return (
              <div key={stage} className="flex items-center gap-3">
                <span className="font-mono text-xs text-neon-purple w-6">
                  {stage}
                </span>
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-bg-hover rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neon-purple rounded-full transition-all"
                      style={{
                        width: `${Math.min((count / Math.max(...funnelCounts.map((f) => f.count), 1)) * 100, 100)}%`,
                      }}
                    />
                  </div>
                  {hasGap && (
                    <span title="Gap in funnel coverage">
                      <AlertCircle className="w-3 h-3 text-neon-orange" />
                    </span>
                  )}
                </div>
                <span className="font-mono text-sm text-text-primary w-6 text-right">
                  {count}
                </span>
              </div>
            );
          })}
          {funnelMap.get(null) !== undefined && funnelMap.get(null)! > 0 && (
            <div className="flex items-center gap-3 pt-2 border-t border-border">
              <span className="font-mono text-xs text-text-muted w-6">--</span>
              <span className="text-xs text-text-muted flex-1">Unassigned</span>
              <span className="font-mono text-sm text-text-muted w-6 text-right">
                {funnelMap.get(null)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Top Ideas */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-neon-green" />
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wide">
            Top by Impact×Ease
          </h3>
        </div>
        {topIdeas.length === 0 ? (
          <p className="text-text-muted text-sm">
            Add impact and ease scores to see top ideas here.
          </p>
        ) : (
          <div className="space-y-3">
            {topIdeas.map((idea, index) => {
              const score =
                idea.impact && idea.ease ? idea.impact * idea.ease : 0;
              if (score === 0) return null;

              return (
                <div key={idea.id} className="flex items-start gap-3">
                  <span className="font-mono text-xs text-text-muted w-4">
                    {index + 1}.
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-text-primary truncate">
                      {idea.name}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusBadge status={idea.status} />
                      {idea.funnelStage && (
                        <FunnelBadge stage={idea.funnelStage} />
                      )}
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-neon-magenta">
                    {score}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
