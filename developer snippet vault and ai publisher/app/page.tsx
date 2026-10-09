import Link from "next/link";
import {
  Sparkles,
  Search,
  ShieldCheck,
  Tags,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-80">
        <div
          className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-tr from-primary/30 to-violet-500/20 opacity-40"
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary mb-6 animate-pulse">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Developer Knowledge Base</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-foreground">Developer Snippet </span>
            <span className="bg-gradient-to-r from-primary via-blue-400 to-indigo-400 bg-clip-text text-transparent">
              Vault
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed">
            Store, organize, and understand your code snippets with AI-powered
            summaries and tags.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2 shadow-lg shadow-primary/20">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Interactive Code Preview Card */}
          <div className="mt-14 mx-auto max-w-3xl rounded-xl border border-border/80 bg-card/90 shadow-2xl overflow-hidden backdrop-blur text-left">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-3">
              <div className="flex items-center space-x-2">
                <span className="h-3 w-3 rounded-full bg-red-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80 inline-block" />
                <span className="h-3 w-3 rounded-full bg-green-500/80 inline-block" />
                <span className="ml-2 font-mono text-xs text-muted-foreground">
                  debounce.ts
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] font-mono">
                  TypeScript
                </Badge>
              </div>
            </div>

            <div className="p-5 font-mono text-xs sm:text-sm overflow-x-auto leading-relaxed text-muted-foreground">
              <p className="text-blue-400">
                export function <span className="text-yellow-300">debounce</span>&lt;T extends (...args: any[]) =&gt; any&gt;(
              </p>
              <p className="pl-4 text-muted-foreground">
                fn: T, delay: number
              </p>
              <p className="text-blue-400">) &#123;</p>
              <p className="pl-4 text-muted-foreground">
                let timer: ReturnType&lt;typeof setTimeout&gt;;
              </p>
              <p className="pl-4 text-purple-400">
                return (...args: Parameters&lt;T&gt;) =&gt; &#123;
              </p>
              <p className="pl-8 text-muted-foreground">
                clearTimeout(timer);
              </p>
              <p className="pl-8 text-muted-foreground">
                timer = setTimeout(() =&gt; fn(...args), delay);
              </p>
              <p className="pl-4 text-purple-400">&#125;;</p>
              <p className="text-blue-400">&#125;</p>
            </div>

            {/* AI Summary and Tags Box */}
            <div className="border-t border-border/60 bg-primary/5 p-4 sm:p-5">
              <div className="flex items-center gap-2 text-primary font-medium text-xs sm:text-sm mb-2">
                <Sparkles className="h-4 w-4" />
                <span>Plain-English AI Summary</span>
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-normal">
                Limits the rate at which a function triggers by postponing execution until a specified delay has elapsed after the last call.
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5 items-center">
                <span className="text-[11px] text-muted-foreground mr-1">Generated Tags:</span>
                <Badge variant="default" className="text-[11px]">#optimization</Badge>
                <Badge variant="default" className="text-[11px]">#typescript</Badge>
                <Badge variant="default" className="text-[11px]">#utility</Badge>
                <Badge variant="default" className="text-[11px]">#async</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features" className="py-20 border-t border-border/40 bg-card/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Core Capabilities
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Engineered for developer clarity &amp; velocity
            </p>
            <p className="mt-4 text-base text-muted-foreground">
              Everything you need to catalog, understand, and reuse code snippets without digging through forgotten Git repositories or Slack threads.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {/* Feature 1: Secure Snippet Storage */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <CardTitle>Secure Snippet Storage</CardTitle>
                <CardDescription>
                  Keep your personal codebase, boilerplate, and tricky solutions safe and organized in a persistent, user-isolated vault.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Row-level security ensures your snippets remain private to you.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Syntax highlighting across 30+ programming languages.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>Cloud persistence ready for fast access anywhere, anytime.</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 2: AI-Powered Tags */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-11 w-11 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3">
                  <Tags className="h-6 w-6" />
                </div>
                <CardTitle>AI-Powered Tags</CardTitle>
                <CardDescription>
                  No more manual taxonomy headaches. Automatically categorize every piece of code with smart, contextual tags.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Detects frameworks, libraries, design patterns, and paradigms.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Consistent tag hierarchies that keep your snippet vault structured.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
                  <span>Customizable tags allowing manual overrides whenever needed.</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 3: Plain-English Summaries */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-11 w-11 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
                  <Sparkles className="h-6 w-6" />
                </div>
                <CardTitle>Plain-English Summaries</CardTitle>
                <CardDescription>
                  Transform dense regexes, tricky math, and complex algorithms into concise, understandable explanations.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Powered by Google Gemini for accurate, context-aware analysis.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Understand what code does in seconds without reading every line.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Ideal for onboarding, legacy review, and quick documentation.</span>
                </div>
              </CardContent>
            </Card>

            {/* Feature 4: Developer-Friendly Search */}
            <Card className="hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="h-11 w-11 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
                  <Search className="h-6 w-6" />
                </div>
                <CardTitle>Developer-Friendly Search</CardTitle>
                <CardDescription>
                  Find the exact snippet you need in seconds through tag filtering, title matching, and language queries.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Instant client-side and server-side filtering by language and tag.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>One-click copy to clipboard with formatting preserved.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Keyboard-friendly navigation for uninterrupted flow state.</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-primary">
              Simple Workflow
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-foreground">
              How Developer Snippet Vault Works
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative rounded-lg border border-border/60 bg-card p-6">
              <div className="text-3xl font-extrabold text-primary/30 mb-4 font-mono">01</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Paste or Create</h3>
              <p className="text-sm text-muted-foreground">
                Drop in your functions, SQL queries, regexes, or config files. Select the language or let the vault detect it.
              </p>
            </div>

            <div className="relative rounded-lg border border-border/60 bg-card p-6">
              <div className="text-3xl font-extrabold text-primary/30 mb-4 font-mono">02</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">AI Analyzes &amp; Enriches</h3>
              <p className="text-sm text-muted-foreground">
                Gemini automatically extracts semantic tags and writes a human-readable summary of what the code achieves.
              </p>
            </div>

            <div className="relative rounded-lg border border-border/60 bg-card p-6">
              <div className="text-3xl font-extrabold text-primary/30 mb-4 font-mono">03</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Retrieve Instantly</h3>
              <p className="text-sm text-muted-foreground">
                Filter by tags, search by concept, and copy to clipboard whenever you need that code in your project.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 border-t border-border/40 bg-gradient-to-b from-card/40 to-background">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
            Start organizing your code library today
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Join developers building their personal AI-assisted snippet vault.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <span>Get Started</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
