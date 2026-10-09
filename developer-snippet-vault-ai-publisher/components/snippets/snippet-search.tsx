"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect, useCallback } from "react";
import { Search, X, Filter, ArrowUpDown } from "lucide-react";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { Button } from "@/components/ui/button";

export function SnippetSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQ = searchParams.get("q") || "";
  const currentLanguage = searchParams.get("language") || "all";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchTerm, setSearchTerm] = useState(currentQ);

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === "all" || (key === "sort" && value === "newest")) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      startTransition(() => {
        const queryString = params.toString();
        router.push(`${pathname}${queryString ? `?${queryString}` : ""}`);
      });
    },
    [pathname, router, searchParams]
  );

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(currentQ);
  }, [currentQ]);

  // Debounced update for search term
  useEffect(() => {
    const handler = setTimeout(() => {
      if (searchTerm !== currentQ) {
        updateParams({ q: searchTerm || undefined });
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, currentQ, updateParams]);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ language: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateParams({ sort: e.target.value });
  };

  const handleClear = () => {
    setSearchTerm("");
    startTransition(() => {
      router.push(pathname);
    });
  };

  const hasActiveFilters = Boolean(
    currentQ ||
      (currentLanguage && currentLanguage !== "all") ||
      (currentSort && currentSort !== "newest")
  );

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
      {/* Search Input */}
      <div className="relative flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search snippets by title or code..."
          className="w-full h-10 rounded-md border border-border bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground hover:text-foreground"
            aria-label="Clear search text"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Language Filter Dropdown */}
      <div className="relative min-w-[150px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <Filter className="h-3.5 w-3.5" />
        </div>
        <select
          value={currentLanguage}
          onChange={handleLanguageChange}
          aria-label="Filter by programming language"
          className="w-full h-10 appearance-none rounded-md border border-border bg-card pl-9 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
        >
          <option value="all">All Languages</option>
          {SUPPORTED_LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Sort Dropdown */}
      <div className="relative min-w-[160px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
          <ArrowUpDown className="h-3.5 w-3.5" />
        </div>
        <select
          value={currentSort}
          onChange={handleSortChange}
          aria-label="Sort snippets"
          className="w-full h-10 appearance-none rounded-md border border-border bg-card pl-9 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="updated">Recently updated</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
          <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
            <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
          </svg>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-xs text-muted-foreground hover:text-foreground h-10"
        >
          Reset Filters
        </Button>
      )}

      {/* Subtle Pending Indicator */}
      {isPending && (
        <span className="text-[11px] text-muted-foreground animate-pulse hidden md:inline">
          Filtering...
        </span>
      )}
    </div>
  );
}
