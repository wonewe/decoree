export function PopupCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-100">
            <div className="aspect-[4/3] w-full bg-slate-200" />
            <div className="flex flex-col gap-4 p-5">
                <div className="space-y-2">
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="h-6 w-3/4 rounded bg-slate-200" />
                    <div className="h-4 w-full rounded bg-slate-200" />
                </div>
                <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center justify-between">
                        <div className="h-3 w-1/2 rounded bg-slate-200" />
                        <div className="h-3 w-16 rounded bg-slate-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}
