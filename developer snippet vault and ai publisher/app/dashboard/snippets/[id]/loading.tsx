export default function SnippetDetailLoading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6 animate-pulse">
      {/* Top Navigation & Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="h-4 w-32 rounded bg-muted/60" />
        <div className="flex items-center gap-2">
          <div className="h-9 w-28 rounded-md bg-muted/50" />
          <div className="h-9 w-28 rounded-md bg-muted/40" />
        </div>
      </div>

      {/* Snippet Header Information Card Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="h-8 w-2/3 rounded-lg bg-muted" />
          <div className="h-6 w-20 rounded bg-muted/60" />
        </div>
        <div className="border-t border-border/60 pt-4 flex gap-6">
          <div className="h-4 w-36 rounded bg-muted/40" />
          <div className="h-4 w-36 rounded bg-muted/40" />
        </div>
      </div>

      {/* AI Insights Card Skeleton */}
      <div className="rounded-xl border border-border/80 bg-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-5 w-32 rounded bg-muted" />
          <div className="h-8 w-28 rounded bg-muted/40" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-muted/50" />
          <div className="h-12 rounded-lg bg-muted/30" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="h-4 w-16 rounded bg-muted/50" />
          <div className="flex gap-2">
            <div className="h-6 w-16 rounded bg-muted/40" />
            <div className="h-6 w-20 rounded bg-muted/40" />
            <div className="h-6 w-14 rounded bg-muted/40" />
          </div>
        </div>
      </div>

      {/* Code Viewer Skeleton */}
      <div className="rounded-xl border border-border/80 bg-[#0a0e17] p-6 space-y-3">
        <div className="h-4 w-40 rounded bg-muted/40 mb-4" />
        <div className="h-4 w-4/5 rounded bg-muted/20" />
        <div className="h-4 w-3/5 rounded bg-muted/20" />
        <div className="h-4 w-2/3 rounded bg-muted/20" />
        <div className="h-4 w-1/2 rounded bg-muted/20" />
      </div>
    </div>
  );
}
