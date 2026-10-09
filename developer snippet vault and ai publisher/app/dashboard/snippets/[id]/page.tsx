import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { isValidUuid, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CodeViewer } from "@/components/snippets/code-viewer";
import { DeleteSnippetDialog } from "@/components/snippets/delete-snippet-dialog";
import { AiMetadataCard } from "@/components/snippets/ai-metadata-card";
import { getLanguageStyle } from "@/lib/constants/languages";
import { Snippet } from "@/types/snippet";

interface SnippetDetailPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: SnippetDetailPageProps) {
  return {
    title: `Snippet Details | Developer Snippet Vault`,
  };
}

export default async function SnippetDetailPage({
  params,
}: SnippetDetailPageProps) {
  const { id } = params;

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Security: Check UUID format before querying
  if (!isValidUuid(id)) {
    notFound();
  }

  // Security & RLS: Fetch only snippet belonging to authenticated user
  const { data, error } = await supabase
    .from("snippets")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) {
    notFound();
  }

  const snippet = data as Snippet;
  const langStyle = getLanguageStyle(snippet.language);
  const isUpdated =
    snippet.updated_at &&
    new Date(snippet.updated_at).getTime() -
      new Date(snippet.created_at).getTime() >
      1000;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Navigation & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Link href={`/dashboard/snippets/${snippet.id}/edit`}>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Snippet</span>
            </Button>
          </Link>

          <DeleteSnippetDialog
            snippetId={snippet.id}
            snippetTitle={snippet.title}
            redirectToDashboard={true}
          />
        </div>
      </div>

      {/* Snippet Header Information Card */}
      <div className="rounded-xl border border-border/80 bg-card p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground break-words">
            {snippet.title}
          </h1>

          <Badge
            variant="outline"
            className={`text-xs font-mono px-3 py-1 self-start sm:self-auto ${langStyle.bg} ${langStyle.text} ${langStyle.border}`}
          >
            {snippet.language}
          </Badge>
        </div>

        {/* Timestamps */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground border-t border-border/60 pt-4">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Created {formatDate(snippet.created_at)}</span>
          </div>

          {isUpdated && (
            <div className="flex items-center gap-1.5 text-muted-foreground/90">
              <Clock className="h-3.5 w-3.5" />
              <span>Updated {formatDate(snippet.updated_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* AI Metadata & Regeneration Card */}
      <AiMetadataCard
        snippetId={snippet.id}
        initialTags={snippet.tags}
        initialSummary={snippet.summary}
      />

      {/* Full Code Presentation */}
      <CodeViewer
        code={snippet.code_content}
        language={snippet.language}
        fileName={`${snippet.title.toLowerCase().replace(/[^a-z0-9]/g, "_")}.${getExtension(snippet.language)}`}
      />
    </div>
  );
}


function getExtension(language: string): string {
  const map: Record<string, string> = {
    JavaScript: "js",
    TypeScript: "ts",
    Python: "py",
    Java: "java",
    C: "c",
    "C++": "cpp",
    "C#": "cs",
    HTML: "html",
    CSS: "css",
    SQL: "sql",
    JSON: "json",
    Bash: "sh",
    PHP: "php",
    Go: "go",
    Rust: "rs",
    Other: "txt",
  };
  return map[language] || "txt";
}
