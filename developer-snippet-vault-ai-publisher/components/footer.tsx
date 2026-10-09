import Link from "next/link";
import { Code2, Terminal } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/40 text-muted-foreground text-sm">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 text-primary">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-semibold text-foreground text-base">
                Developer Snippet Vault
              </span>
            </div>
            <p className="text-muted-foreground text-sm max-w-sm">
              Store, organize, and understand your code snippets with AI-powered summaries and tags. Built for modern software engineers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs tracking-wider uppercase">
              Product
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#features" className="hover:text-foreground transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-foreground transition-colors">
                  Sign In
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 text-xs tracking-wider uppercase">
              Architecture
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-1.5">
                <Terminal className="h-3.5 w-3.5 text-primary" />
                <span>Next.js 14 App Router</span>
              </li>
              <li>Tailwind CSS &amp; TypeScript</li>
              <li>Supabase PostgreSQL &amp; Gemini AI</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/50 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Developer Snippet Vault &amp; AI Publisher. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-primary/80">Production Ready</p>
        </div>
      </div>
    </footer>
  );
}
