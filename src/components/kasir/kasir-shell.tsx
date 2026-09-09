import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, MonitorSmartphone, ReceiptText, Store } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { formatClock, formatLongDate } from "@/lib/pos";
import { usePos } from "@/lib/pos-store";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/kasir", label: "Kasir", icon: MonitorSmartphone },
  { to: "/kasir/riwayat", label: "Riwayat", icon: ReceiptText },
  { to: "/kasir/laporan", label: "Laporan", icon: BarChart3 },
] as const;

export function KasirShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const shift = usePos((s) => s.shift);
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(id);
  }, []);

  const shiftOpen = hydrated && shift && !shift.closedAt;

  return (
    <div className="flex min-h-svh flex-col bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/95 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-3 sm:px-5">
          <Link to="/kasir" className="flex items-center gap-2.5">
            <LogoMark className="size-8" />
            <span className="flex flex-col leading-none">
              <span className="font-display text-xl font-semibold tracking-tight">Kasir</span>
              <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.18em] text-muted sm:block">
                Tangkil Frozen
              </span>
            </span>
          </Link>

          <nav className="ml-2 hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active =
                item.to === "/kasir" ? pathname === "/kasir" : pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "inline-flex h-10 items-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary text-primary-fg"
                      : "text-muted hover:bg-primary-soft hover:text-fg",
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium tabular-nums">{formatClock(now)}</p>
              <p className="text-xs text-muted">{formatLongDate(now)}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium",
                shiftOpen ? "bg-success-soft text-success" : "bg-bg-warm text-muted",
              )}
            >
              {shiftOpen ? "Shift buka" : "Shift tutup"}
            </span>
            <Link
              to="/"
              className="inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-primary-soft hover:text-fg"
              aria-label="Kembali ke toko"
            >
              <Store className="size-4" />
            </Link>
          </div>
        </div>
        <nav className="flex border-t border-border md:hidden">
          {NAV.map((item) => {
            const active =
              item.to === "/kasir" ? pathname === "/kasir" : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex h-12 flex-1 items-center justify-center gap-2 text-sm font-medium",
                  active ? "bg-primary-soft text-primary" : "text-muted",
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
