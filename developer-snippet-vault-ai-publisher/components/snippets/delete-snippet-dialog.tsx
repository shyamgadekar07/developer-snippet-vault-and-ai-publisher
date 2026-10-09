"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteSnippetAction } from "@/lib/actions/snippets";

interface DeleteSnippetDialogProps {
  snippetId: string;
  snippetTitle: string;
  redirectToDashboard?: boolean;
  onDeleted?: () => void;
  trigger?: React.ReactNode;
}

export function DeleteSnippetDialog({
  snippetId,
  snippetTitle,
  redirectToDashboard = false,
  onDeleted,
  trigger,
}: DeleteSnippetDialogProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        setIsOpen(false);
        setError(null);
      }
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading]);

  const handleDelete = async () => {
    setError(null);
    setLoading(true);

    try {
      const result = await deleteSnippetAction(snippetId);
      if (!result.success) {
        setError(result.error || "Failed to delete snippet.");
        setLoading(false);
        return;
      }

      setIsOpen(false);
      setLoading(false);

      if (onDeleted) {
        onDeleted();
      }

      if (redirectToDashboard) {
        router.push("/dashboard");
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred while deleting.");
      setLoading(false);
    }
  };

  return (
    <>
      {trigger ? (
        <span onClick={() => setIsOpen(true)} className="cursor-pointer inline-flex">
          {trigger}
        </span>
      ) : (
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Delete Snippet</span>
        </Button>
      )}

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-dialog-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
        >
          {/* Backdrop click */}
          <div
            className="fixed inset-0"
            onClick={() => {
              if (!loading) {
                setIsOpen(false);
                setError(null);
              }
            }}
          />

          <div className="relative w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl text-left z-10 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/15 text-destructive border border-destructive/25">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <h3
                  id="delete-dialog-title"
                  className="text-lg font-semibold text-foreground tracking-tight"
                >
                  Delete this snippet?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold text-foreground break-all">
                &ldquo;{snippetTitle}&rdquo;
              </span>
              ? It will be removed from your vault immediately.
            </p>

            {error && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-xs text-destructive"
              >
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={loading}
                onClick={() => {
                  setIsOpen(false);
                  setError(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                disabled={loading}
                onClick={handleDelete}
                className="gap-1.5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
