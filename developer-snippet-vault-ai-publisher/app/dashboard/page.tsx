import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  ArrowLeft,
  User,
  Mail,
  ShieldCheck,
  Code2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/server";
import { SnippetSearch } from "@/components/snippets/snippet-search";
import { SnippetList } from "@/components/snippets/snippet-list";
import { Snippet } from "@/types/snippet";

interface DashboardPageProps {
  searchParams?: {
    q?: string;
    language?: string;
    sort?: string;
  };
}

export const metadata = {
  title: "Dashboard | Developer Snippet Vault",
  description: "Manage, search, and organize your developer code snippets.",
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile from PostgreSQL profiles table
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single();

  const fullName =
    profile?.full_name ||
    (user.user_metadata?.full_name as string | undefined) ||
    "Developer";

  // Query parameters for search, filter, and sorting
  const q = searchParams?.q?.trim();
  const language = searchParams?.language;
  const sort = searchParams?.sort || "newest";

  // Count total snippets owned by this user (to determine if vault is completely empty)
  const { count: totalUserSnippetCount } = await supabase
    .from("snippets")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Build secure query for user snippets
  let query = supabase
    .from("snippets")
    .select("*")
    .eq("user_id", user.id); // Strict ownership boundary

  if (language && language !== "all") {
    query = query.eq("language", language);
  }

  if (q) {
    // Search both title and code_content
    query = query.or(`title.ilike.%${q}%,code_content.ilike.%${q}%`);
  }

  if (sort === "oldest") {
    query = query.order("created_at", { ascending: true });
  } else if (sort === "updated") {
    query = query.order("updated_at", { ascending: false });
  } else {
    // Default: newest first
    query = query.order("created_at", { ascending: false });
  }

  const { data: snippetsData, error: snippetsError } = await query;
  const snippets = (snippetsData as Snippet[]) || [];

  const hasFilters = Boolean(
    q || (language && language !== "all") || (sort && sort !== "newest")
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header / Welcome */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                Developer Snippet Vault
              </h1>
              <Badge variant="outline" className="border-emerald-500/40 text-emerald-400 bg-emerald-500/10 text-xs">
                Production Ready
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome, <span className="font-medium text-foreground">{fullName}</span> &bull; Manage your personal code snippets securely.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/dashboard/snippets/new">
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="h-4 w-4" />
                <span>New Snippet</span>
              </Button>
            </Link>
            <LogoutButton variant="outline" className="gap-2" />
          </div>
        </div>
      </div>

      {/* Authenticated Session Quick Info Banner */}
      <Card className="border-border/80 bg-card/60 backdrop-blur">
        <CardHeader className="py-3 px-5 border-b border-border/40">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-semibold flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <span>Session Isolation &amp; Security</span>
            </CardTitle>
            <span className="text-[11px] text-muted-foreground font-mono">
              RLS Enabled
            </span>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 text-xs">
          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-border/50">
            <User className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate">
              <span className="text-muted-foreground block text-[10px]">User</span>
              <span className="font-medium text-foreground truncate block">{fullName}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-border/50">
            <Mail className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate">
              <span className="text-muted-foreground block text-[10px]">Email</span>
              <span className="font-medium text-foreground truncate block">{user.email}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2 rounded-lg bg-muted/20 border border-border/50">
            <Code2 className="h-4 w-4 text-primary shrink-0" />
            <div className="truncate">
              <span className="text-muted-foreground block text-[10px]">Vault Total</span>
              <span className="font-medium text-foreground block">
                {totalUserSnippetCount ?? 0} {(totalUserSnippetCount === 1) ? "Snippet" : "Snippets"}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search, Filter & Sort Controls */}
      {(totalUserSnippetCount ?? 0) > 0 && (
        <div className="space-y-4">
          <SnippetSearch />
        </div>
      )}

      {/* Snippet Grid or Empty State */}
      <SnippetList
        snippets={snippets}
        totalUserSnippetCount={totalUserSnippetCount ?? 0}
        hasFilters={hasFilters}
      />

      {/* Roadmap Overview */}
      <div className="rounded-xl border border-border/60 bg-card p-6 mt-12">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-primary" />
          <span>Implementation Roadmap</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-border bg-muted/20">
            <span className="font-semibold text-foreground block mb-1">Phase 1 &amp; 2</span>
            <span className="text-muted-foreground">Foundation, Supabase PostgreSQL, Authentication &amp; RLS.</span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20">
            <span className="font-semibold text-foreground block mb-1">Phase 3</span>
            <span className="text-muted-foreground">Snippet Vault CRUD, search, language filter &amp; sorting.</span>
          </div>
          <div className="p-3 rounded-lg border border-border bg-muted/20">
            <span className="font-semibold text-foreground block mb-1">Phase 4</span>
            <span className="text-muted-foreground">Google Gemini AI tags &amp; single-sentence summaries.</span>
          </div>
          <div className="p-3 rounded-lg border border-emerald-500/40 bg-emerald-500/10">
            <span className="font-semibold text-emerald-400 block mb-1">Phase 5 (Active)</span>
            <span className="text-muted-foreground">Production polish, accessibility, loading states &amp; security review.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
