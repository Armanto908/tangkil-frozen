import type { ReactNode } from "react";
import { useRouterState } from "@tanstack/react-router";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { KasirShell } from "@/components/kasir/kasir-shell";

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname.startsWith("/kasir")) {
    return <KasirShell>{children}</KasirShell>;
  }
  return (
    <div className="flex min-h-svh flex-col bg-bg text-fg">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
