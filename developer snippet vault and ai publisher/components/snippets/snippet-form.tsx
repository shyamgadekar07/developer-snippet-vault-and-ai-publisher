"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft, Code } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SUPPORTED_LANGUAGES } from "@/lib/constants/languages";
import { createSnippetAction, updateSnippetAction } from "@/lib/actions/snippets";
import { Snippet } from "@/types/snippet";

interface SnippetFormProps {
  initialData?: Snippet;
  mode: "create" | "edit";
}

export function SnippetForm({ initialData, mode }: SnippetFormProps) {
  const router = useRouter();

  const [title, setTitle] = useState(initialData?.title || "");
  const [language, setLanguage] = useState(initialData?.language || "JavaScript");
  const [codeContent, setCodeContent] = useState(initialData?.code_content || "");

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    title?: string;
    codeContent?: string;
    language?: string;
  }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Tab key handler for code indentation in textarea
  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      // Insert 2 spaces
      const updatedCode =
        codeContent.substring(0, start) + "  " + codeContent.substring(end);
      setCodeContent(updatedCode);

      // Restore cursor position after state update
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  const validate = () => {
    const errors: { title?: string; codeContent?: string; language?: string } = {};

    if (!title.trim()) {
      errors.title = "Snippet title is required.";
    } else if (title.trim().length > 120) {
      errors.title = "Title cannot exceed 120 characters.";
    }

    if (!language) {
      errors.language = "Please select a programming language.";
    }

    if (!codeContent.trim()) {
      errors.codeContent = "Code content cannot be empty.";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      if (mode === "create") {
        const result = await createSnippetAction({
          title,
          language,
          code_content: codeContent,
        });

        if (!result.success || !result.data) {
          setErrorMessage(result.error || "Failed to create snippet.");
          setLoading(false);
          return;
        }

        setSuccessMessage("Snippet saved successfully! Redirecting...");
        setTimeout(() => {
          router.push(`/dashboard/snippets/${result.data?.id}`);
          router.refresh();
        }, 500);
      } else {
        if (!initialData?.id) {
          setErrorMessage("Snippet ID missing for edit.");
          setLoading(false);
          return;
        }

        const result = await updateSnippetAction(initialData.id, {
          title,
          language,
          code_content: codeContent,
        });

        if (!result.success || !result.data) {
          setErrorMessage(result.error || "Failed to update snippet.");
          setLoading(false);
          return;
        }

        setSuccessMessage("Changes saved successfully! Redirecting...");
        setTimeout(() => {
          router.push(`/dashboard/snippets/${initialData.id}`);
          router.refresh();
        }, 500);
      }
    } catch {
      setErrorMessage("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const linesCount = codeContent.split("\n").length;
  const charsCount = codeContent.length;

  const cancelHref =
    mode === "edit" && initialData?.id
      ? `/dashboard/snippets/${initialData.id}`
      : "/dashboard";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href={cancelHref}
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        {mode === "edit" ? "Back to Snippet" : "Back to Dashboard"}
      </Link>

      <Card className="border-border/80 shadow-xl bg-card">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary shrink-0">
              <Code className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold tracking-tight text-foreground">
                {mode === "create" ? "Create New Snippet" : "Edit Snippet"}
              </CardTitle>
              <CardDescription>
                {mode === "create"
                  ? "Store a reusable code snippet securely in your personal vault."
                  : "Update the snippet title, language, or code contents."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Error Banner */}
            {errorMessage && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-destructive/50 bg-destructive/10 p-3.5 text-xs sm:text-sm text-destructive animate-in fade-in"
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
            )}

            {/* Success Banner */}
            {successMessage && (
              <div
                role="status"
                className="flex items-start gap-2.5 rounded-lg border border-emerald-500/50 bg-emerald-500/10 p-3.5 text-xs sm:text-sm text-emerald-400 animate-in fade-in"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMessage}</span>
              </div>
            )}

            {/* Title & Language Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Title input */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="snippet-title"
                    className="text-xs font-medium text-foreground"
                  >
                    Title <span className="text-destructive">*</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    {title.length}/120
                  </span>
                </div>
                <input
                  id="snippet-title"
                  type="text"
                  maxLength={120}
                  required
                  disabled={loading}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (fieldErrors.title) {
                      setFieldErrors((prev) => ({ ...prev, title: undefined }));
                    }
                  }}
                  placeholder="e.g., JavaScript Array Filter or Binary Search"
                  className="w-full h-10 rounded-md border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50"
                />
                {fieldErrors.title && (
                  <p className="text-xs text-destructive">{fieldErrors.title}</p>
                )}
              </div>

              {/* Language Select */}
              <div className="space-y-1.5">
                <label
                  htmlFor="snippet-language"
                  className="text-xs font-medium text-foreground"
                >
                  Language <span className="text-destructive">*</span>
                </label>
                <div className="relative">
                  <select
                    id="snippet-language"
                    required
                    disabled={loading}
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      if (fieldErrors.language) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          language: undefined,
                        }));
                      }
                    }}
                    className="w-full h-10 appearance-none rounded-md border border-border bg-card px-3 pr-8 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {SUPPORTED_LANGUAGES.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>
                {fieldErrors.language && (
                  <p className="text-xs text-destructive">
                    {fieldErrors.language}
                  </p>
                )}
              </div>
            </div>

            {/* Code Content Editor Area */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="snippet-code"
                  className="text-xs font-medium text-foreground"
                >
                  Code Content <span className="text-destructive">*</span>
                </label>
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground font-mono">
                  <span>Press Tab to indent (2 spaces)</span>
                  <span>&bull;</span>
                  <span>
                    {linesCount} {linesCount === 1 ? "line" : "lines"}, {charsCount} chars
                  </span>
                </div>
              </div>

              <div className="relative rounded-lg border border-border bg-[#0a0e17] overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent">
                <textarea
                  id="snippet-code"
                  rows={14}
                  required
                  disabled={loading}
                  value={codeContent}
                  onChange={(e) => {
                    setCodeContent(e.target.value);
                    if (fieldErrors.codeContent) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        codeContent: undefined,
                      }));
                    }
                  }}
                  onKeyDown={handleCodeKeyDown}
                  placeholder={`// Paste or write your ${language} code here...\nfunction example() {\n  return "Hello, Vault!";\n}`}
                  className="w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-foreground/90 placeholder:text-muted-foreground/50 resize-y focus:outline-none leading-relaxed"
                  spellCheck={false}
                />
              </div>

              {fieldErrors.codeContent && (
                <p className="text-xs text-destructive">
                  {fieldErrors.codeContent}
                </p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-between border-t border-border/60 pt-5">
            <Link href={cancelHref}>
              <Button type="button" variant="outline" disabled={loading}>
                Cancel
              </Button>
            </Link>

            <Button type="submit" disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>
                    {mode === "create" ? "Saving Snippet..." : "Saving Changes..."}
                  </span>
                </>
              ) : (
                <span>
                  {mode === "create" ? "Save Snippet" : "Save Changes"}
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
