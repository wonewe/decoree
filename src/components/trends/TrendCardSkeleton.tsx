export function TrendCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-4 w-12 rounded bg-slate-200" />
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-6 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
      </div>
      <div className="mt-6 h-32 w-full rounded-2xl bg-slate-200" />
      <div className="mt-6 h-4 w-24 rounded bg-slate-200" />
    </div>
  );
}
