"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { regenerateSnippetAiAction } from "@/lib/actions/snippets";

interface AiMetadataCardProps {
  snippetId: string;
  initialTags?: string[];
  initialSummary?: string | null;
}

export function AiMetadataCard({
  snippetId,
  initialTags = [],
  initialSummary = null,
}: AiMetadataCardProps) {
  const router = useRouter();
  const [tags, setTags] = useState<string[]>(initialTags);
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleRegenerate = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const res = await regenerateSnippetAiAction(snippetId);

      if (!res.success || !res.data) {
        setMessage({
          type: "error",
          text: res.error || "Failed to regenerate AI metadata. Please try again.",
        });
        return;
      }

      setTags(res.data.tags);
      setSummary(res.data.summary);
      setMessage({
        type: "success",
        text: "AI metadata regenerated successfully!",
      });
      router.refresh();
    } catch {
      setMessage({
        type: "error",
        text: "An unexpected error occurred while regenerating AI metadata.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-border/80 bg-card shadow-sm">
      <CardHeader className="p-5 pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Insights</span>
            <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
              Gemini Flash
            </Badge>
          </CardTitle>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={loading}
            onClick={handleRegenerate}
            className="gap-2 text-xs self-start sm:self-auto border-border hover:border-primary/50 transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                <span>Regenerating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Regenerate AI</span>
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-2 space-y-4">
        {/* Feedback Messages */}
        {message && (
          <div
            role={message.type === "error" ? "alert" : "status"}
            className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs animate-in fade-in ${
              message.type === "success"
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-destructive/40 bg-destructive/10 text-destructive"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            )}
            <span className="leading-snug">{message.text}</span>
          </div>
        )}

        {/* AI Summary Section */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Summary
          </h3>
          {summary ? (
            <div className="rounded-lg border border-border/50 bg-[#0a0e17] p-3.5 text-sm text-foreground/90 leading-relaxed font-sans">
              {summary}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              AI summary not available.
            </p>
          )}
        </div>

        {/* AI Tags Section */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            AI Tags
          </h3>
          {tags && tags.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="px-2.5 py-1 text-xs font-mono font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground italic">
              No AI tags available.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
