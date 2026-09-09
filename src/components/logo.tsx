import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      className={cn("size-9", className)}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" fill="currentColor" className="text-primary" />
      <path
        d="M20 8c-1.2 3.2-2 6.4-2 9.2 0 4.4 2.2 6.8 2 10.8-.2-4-2-6.4-2-10.8 0-2.8.8-6 2-9.2Zm0 0c1.2 3.2 2 6.4 2 9.2 0 4.4-2.2 6.8-2 10.8"
        fill="none"
        stroke="var(--color-primary-fg)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M12 18.5c4 1.2 8 1.8 8 1.8s4-.6 8-1.8"
        fill="none"
        stroke="var(--color-primary-fg)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M13.5 23c3.6.8 6.5 1.2 6.5 1.2s2.9-.4 6.5-1.2"
        fill="none"
        stroke="var(--color-primary-fg)"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.8"
      />
    </svg>
  );
}

export function LogoWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-semibold tracking-tight text-fg">
          Tangkil
        </span>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted">
          Frozen
        </span>
      </span>
    </span>
  );
}
