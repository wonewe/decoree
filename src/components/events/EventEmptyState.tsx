type EventEmptyStateProps = {
  title: string;
  description: string;
};

export function EventEmptyState({ title, description }: EventEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--paper)] p-6 text-center">
      <h3 className="text-lg font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-muted)]">{description}</p>
    </div>
  );
}
