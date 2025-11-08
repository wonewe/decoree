export function EventCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl bg-white p-6 shadow">
      <div className="flex items-center justify-between text-sm">
        <div className="h-4 w-32 rounded bg-slate-200" />
        <div className="h-4 w-20 rounded bg-slate-200" />
      </div>
      <div className="mt-4 space-y-3">
        <div className="h-6 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-4/5 rounded bg-slate-200" />
      </div>
      <div className="mt-6 h-4 w-24 rounded bg-slate-200" />
      <div className="mt-3 h-4 w-32 rounded bg-slate-200" />
    </div>
  );
}
