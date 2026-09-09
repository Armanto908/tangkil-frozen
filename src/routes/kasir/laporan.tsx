import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/format";
import { expectedCash, formatWhen, payLabel, salesOnDay } from "@/lib/pos";
import { usePos, usePosHydrated } from "@/lib/pos-store";

export const Route = createFileRoute("/kasir/laporan")({
  component: LaporanPage,
});

function LaporanPage() {
  const hydrated = usePosHydrated();
  const sales = usePos((s) => s.sales);
  const shift = usePos((s) => s.shift);
  const closeShift = usePos((s) => s.closeShift);
  const [closing, setClosing] = useState("");

  const today = useMemo(() => (hydrated ? salesOnDay(sales, new Date()) : []), [hydrated, sales]);
  const omzet = today.reduce((n, s) => n + s.total, 0);
  const count = today.length;
  const byMethod = useMemo(() => {
    const map = { tunai: 0, qris: 0, transfer: 0 };
    for (const s of today) map[s.method] += s.total;
    return (["tunai", "qris", "transfer"] as const).map((id) => ({
      name: payLabel(id),
      total: map[id],
    }));
  }, [today]);
  const top = useMemo(() => {
    const map = new Map<string, { name: string; qty: number; total: number }>();
    for (const s of today) {
      for (const item of s.items) {
        const cur = map.get(item.name) ?? { name: item.name, qty: 0, total: 0 };
        cur.qty += item.qty;
        cur.total += item.unitPrice * item.qty;
        map.set(item.name, cur);
      }
    }
    return [...map.values()].sort((a, b) => b.total - a.total).slice(0, 6);
  }, [today]);

  const shiftOpen = hydrated && shift && !shift.closedAt;
  const expected = expectedCash(today, shiftOpen ? shift : null);

  if (!hydrated) return <div className="flex-1 bg-bg" />;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Hari ini</p>
      <h1 className="mt-1 font-display text-4xl font-semibold">Laporan kasir</h1>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        <Stat label="Omzet" value={formatRupiah(omzet)} />
        <Stat label="Transaksi" value={String(count)} />
        <Stat label="Rata-rata" value={count ? formatRupiah(Math.round(omzet / count)) : "—"} />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-display text-xl font-semibold">Metode bayar</h2>
          {omzet === 0 ? (
            <p className="mt-6 text-sm text-muted">Belum ada penjualan hari ini.</p>
          ) : (
            <div className="mt-4 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byMethod}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--color-subtle)" />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    stroke="var(--color-subtle)"
                    tickFormatter={(v: number) => `${Math.round(v / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(v) => formatRupiah(Number(v ?? 0))}
                    contentStyle={{
                      borderRadius: 12,
                      borderColor: "var(--color-border)",
                      background: "var(--color-surface)",
                    }}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>

        <section className="rounded-xl border border-border bg-surface p-4">
          <h2 className="font-display text-xl font-semibold">Produk terlaris</h2>
          {top.length === 0 ? (
            <p className="mt-6 text-sm text-muted">Belum ada item terjual.</p>
          ) : (
            <ol className="mt-4 space-y-3">
              {top.map((row, i) => (
                <li key={row.name} className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="min-w-0 truncate">
                    <span className="mr-2 text-muted tabular-nums">{i + 1}.</span>
                    {row.name}
                    <span className="text-muted"> · {row.qty}x</span>
                  </span>
                  <span className="shrink-0 font-medium tabular-nums">{formatRupiah(row.total)}</span>
                </li>
              ))}
            </ol>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-xl border border-border bg-surface p-4 sm:p-5">
        <h2 className="font-display text-xl font-semibold">Tutup shift</h2>
        {shiftOpen && shift ? (
          <>
            <p className="mt-1 text-sm text-muted">
              Dibuka {formatWhen(shift.openedAt)} · modal {formatRupiah(shift.openingCash)}
            </p>
            <p className="mt-3 text-sm">
              Perkiraan tunai di laci{" "}
              <span className="font-medium tabular-nums">{formatRupiah(expected)}</span>
              <span className="text-muted"> (modal + penjualan tunai hari ini)</span>
            </p>
            <Label htmlFor="tutup" className="mt-4 block">
              Hitung tunai aktual (Rp)
            </Label>
            <Input
              id="tutup"
              inputMode="numeric"
              value={closing}
              onChange={(e) => setClosing(e.target.value.replace(/\D/g, ""))}
              className="mt-1.5 max-w-xs tabular-nums"
              placeholder={String(expected)}
            />
            <Button
              className="mt-4"
              variant="ink"
              onClick={() => {
                closeShift(Number(closing) || expected);
                toast.success("Shift ditutup");
                setClosing("");
              }}
            >
              Tutup shift
            </Button>
          </>
        ) : shift?.closedAt ? (
          <p className="mt-2 text-sm text-muted">
            Shift terakhir ditutup {formatWhen(shift.closedAt)}
            {shift.closingCash != null ? ` · laci ${formatRupiah(shift.closingCash)}` : ""}. Buka
            lagi dari menu Kasir.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted">Belum ada shift. Buka dari menu Kasir.</p>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-5">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted">{label}</p>
      <p className="mt-2 font-display text-3xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
