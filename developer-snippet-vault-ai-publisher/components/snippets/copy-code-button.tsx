"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CopyCodeButtonProps {
  code: string;
  className?: string;
  variant?: "default" | "secondary" | "outline" | "ghost";
  size?: "default" | "sm" | "icon";
  showText?: boolean;
}

export function CopyCodeButton({
  code,
  className,
  variant = "outline",
  size = "sm",
  showText = true,
}: CopyCodeButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        // Fallback for non-secure / unsupported contexts
        const textarea = document.createElement("textarea");
        textarea.value = code;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      // Graceful error fallback
      console.error("Failed to copy code to clipboard");
    }
  };

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={cn(
        "transition-all duration-200",
        copied && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
        className
      )}
      title={copied ? "Code copied!" : "Copy code"}
      aria-label={copied ? "Code copied to clipboard" : "Copy code to clipboard"}
    >
      {copied ? (
        <>
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          {showText && <span className="ml-1.5 text-xs text-emerald-400 font-medium">Copied!</span>}
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          {showText && <span className="ml-1.5 text-xs font-medium">Copy Code</span>}
        </>
      )}
    </Button>
  );
}
