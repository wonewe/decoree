type EventEmptyStateProps = {
  title: string;
  description: string;
};

export function EventEmptyState({ title, description }: EventEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <h3 className="text-lg font-semibold text-dancheongNavy">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
