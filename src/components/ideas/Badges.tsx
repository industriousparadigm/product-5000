type StatusBadgeProps = {
  status: string;
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const className = {
    Parked: "badge badge-parked",
    Testing: "badge badge-testing",
    Validated: "badge badge-validated",
    Shipped: "badge badge-shipped",
    Killed: "badge badge-killed",
  }[status] || "badge badge-parked";

  return <span className={className}>{status}</span>;
}

type ConfidenceBadgeProps = {
  basis: string;
};

export function ConfidenceBadge({ basis }: ConfidenceBadgeProps) {
  const className = {
    Opinion: "badge badge-opinion",
    Anecdote: "badge badge-anecdote",
    Data: "badge badge-data",
    Validated: "badge badge-validated-conf",
  }[basis] || "badge badge-opinion";

  return <span className={className}>{basis}</span>;
}

type FunnelBadgeProps = {
  stage: string;
};

export function FunnelBadge({ stage }: FunnelBadgeProps) {
  return <span className="badge badge-funnel">{stage}</span>;
}
