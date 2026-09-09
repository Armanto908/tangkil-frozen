import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { formatRupiah } from "@/lib/format";
import { formatWhen, payLabel, salesOnDay } from "@/lib/pos";
import { usePos, usePosHydrated } from "@/lib/pos-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kasir/riwayat")({
  component: RiwayatPage,
});

function RiwayatPage() {
  const hydrated = usePosHydrated();
  const sales = usePos((s) => s.sales);
  const [scope, setScope] = useState<"hari" | "semua">("hari");

  const list = useMemo(() => {
    if (!hydrated) return [];
    return scope === "hari" ? salesOnDay(sales, new Date()) : sales;
  }, [hydrated, sales, scope]);

  if (!hydrated) return <div className="flex-1 bg-bg" />;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Kasir</p>
          <h1 className="mt-1 font-display text-4xl font-semibold">Riwayat</h1>
        </div>
        <div className="flex rounded-full bg-surface p-1 ring-1 ring-border">
          {(["hari", "semua"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={cn(
                "h-9 rounded-full px-4 text-sm font-medium",
                scope === s ? "bg-primary text-primary-fg" : "text-muted",
              )}
            >
              {s === "hari" ? "Hari ini" : "Semua"}
            </button>
          ))}
        </div>
      </div>

      {list.length === 0 ? (
        <p className="mt-12 text-sm text-muted">Belum ada transaksi pada filter ini.</p>
      ) : (
        <ul className="mt-8 divide-y divide-border rounded-xl border border-border bg-surface">
          {list.map((sale) => (
            <li key={sale.id}>
              <Link
                to="/kasir/struk/$id"
                params={{ id: sale.id }}
                className="flex items-center gap-3 px-4 py-4 hover:bg-primary-soft/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-medium tabular-nums">{sale.id}</p>
                  <p className="text-sm text-muted">
                    {formatWhen(sale.createdAt)}
                    {sale.customerName ? ` · ${sale.customerName}` : ""}
                    {sale.voided ? " · dibatalkan" : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={cn(
                      "font-medium tabular-nums",
                      sale.voided && "text-muted line-through",
                    )}
                  >
                    {formatRupiah(sale.total)}
                  </p>
                  <p className="text-xs text-muted">{payLabel(sale.method)}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
