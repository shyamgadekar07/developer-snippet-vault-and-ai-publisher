import Link from "next/link";
import { ArrowLeft, Home, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg border-border/80 bg-card p-8 text-center shadow-xl">
        <CardContent className="space-y-6 pt-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <FileQuestion className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-semibold text-primary uppercase tracking-widest">
              404 Error
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Page Not Found
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Go to Dashboard</span>
              </Button>
            </Link>
            <Link href="/" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto gap-2">
                <Home className="h-4 w-4" />
                <span>Return Home</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
