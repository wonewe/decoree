type PhraseEmptyStateProps = {
  title: string;
  description: string;
};

export function PhraseEmptyState({ title, description }: PhraseEmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-center">
      <h3 className="text-lg font-semibold text-dancheongNavy">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
    </div>
  );
}
