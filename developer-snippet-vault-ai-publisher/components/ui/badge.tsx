import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "outline" | "destructive" | "accent";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantStyles = {
    default:
      "border-transparent bg-primary/15 text-primary border border-primary/20",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground",
    outline:
      "border-border text-foreground",
    destructive:
      "border-transparent bg-destructive/20 text-destructive-foreground border border-destructive/30",
    accent:
      "border-transparent bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
