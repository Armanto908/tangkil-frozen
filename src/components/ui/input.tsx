import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-fg outline-none transition-[box-shadow,border-color] duration-150 placeholder:text-subtle focus-visible:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/20",
        className,
      )}
      {...props}
    />
  );
}
