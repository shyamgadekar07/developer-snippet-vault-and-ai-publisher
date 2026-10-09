export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="space-y-4">
        <div className="h-4 w-28 rounded bg-muted/60" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-muted" />
            <div className="h-4 w-96 max-w-full rounded bg-muted/50" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-10 w-32 rounded-lg bg-primary/20" />
            <div className="h-10 w-24 rounded-lg bg-muted" />
          </div>
        </div>
      </div>

      {/* Session Quick Info Banner Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="h-4 w-40 rounded bg-muted/60 mb-3" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="h-14 rounded-lg bg-muted/30" />
          <div className="h-14 rounded-lg bg-muted/30" />
          <div className="h-14 rounded-lg bg-muted/30" />
        </div>
      </div>

      {/* Search / Filters Skeleton */}
      <div className="rounded-xl border border-border/60 bg-card p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="md:col-span-2 h-10 rounded-md bg-muted/40" />
          <div className="h-10 rounded-md bg-muted/40" />
          <div className="h-10 rounded-md bg-muted/40" />
        </div>
      </div>

      {/* Snippet Card Grid Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="h-5 w-3/5 rounded bg-muted" />
                <div className="h-5 w-16 rounded bg-muted/60" />
              </div>
              <div className="h-24 rounded-lg bg-[#0a0e17]/80" />
              <div className="h-3 w-4/5 rounded bg-muted/40" />
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border/40">
              <div className="h-7 w-16 rounded bg-muted/40" />
              <div className="flex gap-1.5">
                <div className="h-7 w-7 rounded bg-muted/40" />
                <div className="h-7 w-7 rounded bg-muted/40" />
                <div className="h-7 w-7 rounded bg-muted/40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
