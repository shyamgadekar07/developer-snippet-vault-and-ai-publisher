export const SUPPORTED_LANGUAGES = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "C",
  "C++",
  "C#",
  "HTML",
  "CSS",
  "SQL",
  "JSON",
  "Bash",
  "PHP",
  "Go",
  "Rust",
  "Other",
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_STYLES: Record<
  string,
  { label: string; bg: string; text: string; border: string }
> = {
  JavaScript: {
    label: "JavaScript",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    border: "border-amber-500/30",
  },
  TypeScript: {
    label: "TypeScript",
    bg: "bg-blue-500/10",
    text: "text-blue-400",
    border: "border-blue-500/30",
  },
  Python: {
    label: "Python",
    bg: "bg-sky-500/10",
    text: "text-sky-400",
    border: "border-sky-500/30",
  },
  Java: {
    label: "Java",
    bg: "bg-orange-500/10",
    text: "text-orange-400",
    border: "border-orange-500/30",
  },
  C: {
    label: "C",
    bg: "bg-slate-500/10",
    text: "text-slate-300",
    border: "border-slate-500/30",
  },
  "C++": {
    label: "C++",
    bg: "bg-indigo-500/10",
    text: "text-indigo-400",
    border: "border-indigo-500/30",
  },
  "C#": {
    label: "C#",
    bg: "bg-purple-500/10",
    text: "text-purple-400",
    border: "border-purple-500/30",
  },
  HTML: {
    label: "HTML",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    border: "border-rose-500/30",
  },
  CSS: {
    label: "CSS",
    bg: "bg-cyan-500/10",
    text: "text-cyan-400",
    border: "border-cyan-500/30",
  },
  SQL: {
    label: "SQL",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
  },
  JSON: {
    label: "JSON",
    bg: "bg-yellow-500/10",
    text: "text-yellow-400",
    border: "border-yellow-500/30",
  },
  Bash: {
    label: "Bash",
    bg: "bg-emerald-600/10",
    text: "text-emerald-300",
    border: "border-emerald-600/30",
  },
  PHP: {
    label: "PHP",
    bg: "bg-violet-500/10",
    text: "text-violet-400",
    border: "border-violet-500/30",
  },
  Go: {
    label: "Go",
    bg: "bg-teal-500/10",
    text: "text-teal-400",
    border: "border-teal-500/30",
  },
  Rust: {
    label: "Rust",
    bg: "bg-amber-600/10",
    text: "text-amber-500",
    border: "border-amber-600/30",
  },
  Other: {
    label: "Other",
    bg: "bg-zinc-500/10",
    text: "text-zinc-400",
    border: "border-zinc-500/30",
  },
};

export function getLanguageStyle(language: string) {
  return (
    LANGUAGE_STYLES[language] || {
      label: language || "Other",
      bg: "bg-primary/10",
      text: "text-primary",
      border: "border-primary/25",
    }
  );
}
