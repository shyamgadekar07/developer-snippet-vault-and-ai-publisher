import { CopyCodeButton } from "./copy-code-button";
import { getLanguageStyle } from "@/lib/constants/languages";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language: string;
  fileName?: string;
  showLineNumbers?: boolean;
  className?: string;
}

export function CodeViewer({
  code,
  language,
  fileName,
  showLineNumbers = true,
  className,
}: CodeViewerProps) {
  const lines = code.split("\n");
  const langStyle = getLanguageStyle(language);

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card/90 shadow-md overflow-hidden flex flex-col",
        className
      )}
    >
      {/* Code Header Bar */}
      <div className="flex items-center justify-between border-b border-border/80 bg-muted/40 px-4 py-2.5">
        <div className="flex items-center space-x-3">
          {/* Mac-style window dots */}
          <div className="flex items-center space-x-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 inline-block" />
            <span className="h-2.5 w-2.5 rounded-full bg-green-500/80 inline-block" />
          </div>

          {fileName && (
            <span className="font-mono text-xs text-muted-foreground font-medium">
              {fileName}
            </span>
          )}

          <Badge
            variant="outline"
            className={cn(
              "text-[11px] font-mono px-2 py-0.5",
              langStyle.bg,
              langStyle.text,
              langStyle.border
            )}
          >
            {language}
          </Badge>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
            {lines.length} {lines.length === 1 ? "line" : "lines"} &bull;{" "}
            {code.length} chars
          </span>
          <CopyCodeButton code={code} size="sm" />
        </div>
      </div>

      {/* Code Content Container */}
      <div className="relative overflow-x-auto bg-[#0a0e17] text-foreground p-4 text-xs sm:text-sm font-mono leading-relaxed">
        {showLineNumbers ? (
          <table className="w-full border-collapse">
            <tbody>
              {lines.map((line, idx) => (
                <tr key={idx} className="hover:bg-muted/15 transition-colors">
                  <td
                    className="select-none pr-4 text-right text-muted-foreground/40 text-xs align-top font-mono w-10 shrink-0"
                    aria-hidden="true"
                  >
                    {idx + 1}
                  </td>
                  <td className="whitespace-pre pl-2 text-foreground/90 font-mono">
                    {line || " "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <pre className="whitespace-pre font-mono text-foreground/90">
            <code>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
