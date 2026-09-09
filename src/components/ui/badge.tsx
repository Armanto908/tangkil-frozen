import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "default",
  ...props
}: ComponentProps<"span"> & { tone?: "default" | "success" | "soft" | "ink" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "default" && "bg-primary-soft text-primary",
        tone === "success" && "bg-success-soft text-success",
        tone === "soft" && "bg-bg-warm text-muted",
        tone === "ink" && "bg-ink text-ink-fg",
        className,
      )}
      {...props}
    />
  );
}
