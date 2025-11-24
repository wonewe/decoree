import { ReactNode } from "react";

type TrendEmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function TrendEmptyState({ title, description, action }: TrendEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-8 text-center">
      <h3 className="text-xl font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-3 text-sm text-[var(--ink-muted)]">{description}</p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
}
