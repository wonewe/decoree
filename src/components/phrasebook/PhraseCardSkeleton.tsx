export function PhraseCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-20 rounded bg-slate-200" />
        <div className="h-4 w-16 rounded bg-slate-200" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-2/3 rounded bg-slate-200" />
        <div className="h-4 w-1/3 rounded bg-slate-200" />
      </div>
      <div className="h-4 w-full rounded bg-slate-200" />
      <div className="h-16 w-full rounded-xl bg-slate-100" />
    </div>
  );
}
