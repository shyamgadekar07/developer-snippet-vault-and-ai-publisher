"use client";

import Link from "next/link";
import { Calendar, Clock, Edit2, ExternalLink } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyCodeButton } from "./copy-code-button";
import { DeleteSnippetDialog } from "./delete-snippet-dialog";
import { getLanguageStyle } from "@/lib/constants/languages";
import { formatShortDate, cn } from "@/lib/utils";
import { Snippet } from "@/types/snippet";

interface SnippetCardProps {
  snippet: Snippet;
}

export function SnippetCard({ snippet }: SnippetCardProps) {
  const langStyle = getLanguageStyle(snippet.language);

  // Take first 4 lines for short preview
  const previewLines = snippet.code_content.split("\n").slice(0, 4).join("\n");
  const isMultiLine = snippet.code_content.split("\n").length > 4;

  const isUpdated =
    snippet.updated_at &&
    new Date(snippet.updated_at).getTime() -
      new Date(snippet.created_at).getTime() >
      1000;

  return (
    <Card className="flex flex-col justify-between border-border/80 hover:border-primary/40 bg-card/80 transition-all hover:shadow-lg group">
      <div>
        {/* Header */}
        <CardHeader className="p-5 pb-3">
          <div className="flex items-start justify-between gap-3">
            <Link
              href={`/dashboard/snippets/${snippet.id}`}
              className="text-base font-semibold text-foreground hover:text-primary transition-colors line-clamp-1 group-hover:underline underline-offset-4"
            >
              {snippet.title}
            </Link>

            <Badge
              variant="outline"
              className={cn(
                "text-[11px] font-mono shrink-0",
                langStyle.bg,
                langStyle.text,
                langStyle.border
              )}
            >
              {snippet.language}
            </Badge>
          </div>
        </CardHeader>

        {/* Code Preview */}
        <CardContent className="p-5 pt-0 pb-3">
          <div className="relative rounded-lg border border-border/60 bg-[#0a0e17] p-3 overflow-hidden">
            <pre className="font-mono text-xs text-foreground/80 whitespace-pre overflow-x-hidden leading-relaxed">
              <code>{previewLines}</code>
            </pre>
            {isMultiLine && (
              <div className="text-[10px] text-muted-foreground/60 font-mono mt-1 pt-1 border-t border-border/30">
                &hellip; and more lines
              </div>
            )}
          </div>

          {/* AI Summary Preview */}
          {snippet.summary && (
            <p className="mt-2.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {snippet.summary}
            </p>
          )}

          {/* AI Tags Preview */}
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {snippet.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-mono bg-muted/60 text-muted-foreground border border-border/50"
                >
                  {tag}
                </span>
              ))}
              {snippet.tags.length > 3 && (
                <span className="text-[10px] text-muted-foreground self-center">
                  +{snippet.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Timestamps */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Created {formatShortDate(snippet.created_at)}</span>
            </span>
            {isUpdated && (
              <span className="flex items-center gap-1 text-muted-foreground/80">
                <Clock className="h-3 w-3" />
                <span>Updated {formatShortDate(snippet.updated_at)}</span>
              </span>
            )}
          </div>
        </CardContent>
      </div>

      {/* Footer Actions */}
      <CardFooter className="p-5 pt-2 border-t border-border/40 flex items-center justify-between gap-2">
        <Link href={`/dashboard/snippets/${snippet.id}`}>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <ExternalLink className="h-3.5 w-3.5" />
            <span>View</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1.5">
          <CopyCodeButton
            code={snippet.code_content}
            size="sm"
            showText={false}
            className="h-8 w-8 p-0"
          />

          <Link href={`/dashboard/snippets/${snippet.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0"
              title="Edit snippet"
              aria-label="Edit snippet"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </Button>
          </Link>

          <DeleteSnippetDialog
            snippetId={snippet.id}
            snippetTitle={snippet.title}
            trigger={
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 text-destructive/80 hover:text-destructive hover:bg-destructive/10 border-border hover:border-destructive/30"
                title="Delete snippet"
                aria-label="Delete snippet"
              >
                <span className="sr-only">Delete</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </Button>
            }
          />
        </div>
      </CardFooter>
    </Card>
  );
}
