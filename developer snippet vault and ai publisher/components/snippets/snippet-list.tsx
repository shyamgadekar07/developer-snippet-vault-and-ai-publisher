"use client";

import Link from "next/link";
import { FolderLock, Plus, SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SnippetCard } from "./snippet-card";
import { Snippet } from "@/types/snippet";

interface SnippetListProps {
  snippets: Snippet[];
  totalUserSnippetCount: number;
  hasFilters: boolean;
}

export function SnippetList({
  snippets,
  totalUserSnippetCount,
  hasFilters,
}: SnippetListProps) {
  // Scenario 1: User has no snippets at all in the vault
  if (totalUserSnippetCount === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 sm:p-14 text-center space-y-5 bg-card/40">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
          <FolderLock className="h-8 w-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">
            No snippets found
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create your first developer snippet to get started with your personal vault and AI insights.
          </p>
        </div>
        <div>
          <Link href="/dashboard/snippets/new">
            <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
              <Plus className="h-4 w-4" />
              <span>Create Your First Snippet</span>
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Scenario 2: User has snippets, but current search/filter returned 0 results
  if (snippets.length === 0 && hasFilters) {
    return (
      <div className="rounded-xl border border-border/80 p-8 sm:p-12 text-center space-y-4 bg-card/30">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-muted/60 text-muted-foreground">
          <SearchX className="h-6 w-6" />
        </div>
        <div className="max-w-md mx-auto space-y-1.5">
          <h3 className="text-base font-semibold text-foreground">
            No matching snippets found
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
            No snippets matched your search query or language filter. Try searching for different keywords or reset your filters.
          </p>
        </div>
        <div>
          <Link href="/dashboard">
            <Button variant="outline" size="sm">
              Reset Filters
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Scenario 3: Display matching snippet cards
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
        <span>
          Showing {snippets.length} of {totalUserSnippetCount}{" "}
          {totalUserSnippetCount === 1 ? "snippet" : "snippets"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
}
