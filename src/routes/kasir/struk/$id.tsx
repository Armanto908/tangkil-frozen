import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { formatRupiah, formatWeight } from "@/lib/format";
import { formatWhen, payLabel, printSale, receiptText } from "@/lib/pos";
import { usePos, usePosHydrated } from "@/lib/pos-store";
import { SITE, waLink } from "@/lib/site";
import { toast } from "sonner";

export const Route = createFileRoute("/kasir/struk/$id")({
  component: StrukPage,
});

function StrukPage() {
  const { id } = Route.useParams();
  const hydrated = usePosHydrated();
  const sales = usePos((s) => s.sales);
  const voidSale = usePos((s) => s.voidSale);
  const sale = hydrated ? sales.find((s) => s.id === id) : undefined;

  if (!hydrated) return <div className="flex-1 bg-bg" />;

  if (!sale) {
    return (
      <div className="mx-auto max-w-md px-4 py-16 text-center">
        <h1 className="font-display text-3xl font-semibold">Struk tidak ada</h1>
        <p className="mt-2 text-sm text-muted">Mungkin dari perangkat lain, atau sudah dihapus.</p>
        <Button className="mt-6" asChild>
          <Link to="/kasir/riwayat">Kembali ke riwayat</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Struk</p>
      <h1 className="mt-1 font-display text-3xl font-semibold tabular-nums">{sale.id}</h1>
      <p className="mt-1 text-sm text-muted">{formatWhen(sale.createdAt)}</p>
      {sale.voided ? (
        <p className="mt-3 text-sm font-medium text-primary">Transaksi ini dibatalkan.</p>
      ) : null}

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <p className="font-display text-xl font-semibold">{SITE.name}</p>
        <p className="mt-1 text-sm text-muted">{SITE.address}</p>
        <ul className="mt-4 divide-y divide-border text-sm">
          {sale.items.map((item) => (
            <li key={item.key} className="flex justify-between gap-3 py-2">
              <span>
                {item.qty}x {item.name}
                {item.weightGrams ? ` (${formatWeight(item.weightGrams)})` : ""}
              </span>
              <span className="tabular-nums">{formatRupiah(item.unitPrice * item.qty)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-3 space-y-1 border-t border-border pt-3 text-sm">
          <Row label="Subtotal" value={formatRupiah(sale.subtotal)} />
          {sale.discount > 0 ? (
            <Row label="Diskon" value={`-${formatRupiah(sale.discount)}`} />
          ) : null}
          <Row label="Total" value={formatRupiah(sale.total)} strong />
          <Row label="Bayar" value={payLabel(sale.method)} />
          {sale.method === "tunai" && sale.cashReceived != null ? (
            <>
              <Row label="Diterima" value={formatRupiah(sale.cashReceived)} />
              <Row label="Kembali" value={formatRupiah(sale.change ?? 0)} />
            </>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <Button onClick={() => printSale(sale)}>Cetak</Button>
        <Button variant="wa" asChild>
          <a href={waLink(receiptText(sale))} target="_blank" rel="noreferrer">
            WhatsApp
          </a>
        </Button>
        {!sale.voided ? (
          <Button
            variant="outline"
            onClick={() => {
              voidSale(sale.id);
              toast.success("Transaksi dibatalkan");
            }}
          >
            Batalkan transaksi
          </Button>
        ) : null}
        <Button variant="ghost" asChild>
          <Link to="/kasir/riwayat">Riwayat</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted">{label}</span>
      <span className={strong ? "font-semibold tabular-nums" : "tabular-nums"}>{value}</span>
    </div>
  );
}
