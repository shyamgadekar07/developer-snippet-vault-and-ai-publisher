"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log error safely without exposing confidential data
    console.error("[Application Error]", error.message);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-16 sm:px-6 lg:px-8">
      <Card className="w-full max-w-lg border-border/80 bg-card p-8 text-center shadow-xl">
        <CardContent className="space-y-6 pt-6">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/15 text-destructive border border-destructive/25">
            <AlertTriangle className="h-8 w-8" />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Something went wrong
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
              An unexpected error occurred while processing your request. Please try again or return home.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Button onClick={() => reset()} className="w-full sm:w-auto gap-2">
              <RotateCcw className="h-4 w-4" />
              <span>Try Again</span>
            </Button>
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
