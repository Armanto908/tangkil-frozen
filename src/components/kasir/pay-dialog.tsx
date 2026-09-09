import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatRupiah } from "@/lib/format";
import { cashSuggestions, linesSubtotal, PAY_METHODS, printSale, receiptText } from "@/lib/pos";
import { usePos, type PayMethod, type Sale } from "@/lib/pos-store";
import { waLink } from "@/lib/site";
import { cn } from "@/lib/utils";

export function PayDialog({
  open,
  onOpenChange,
  onPaid,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaid: (sale: Sale) => void;
}) {
  const lines = usePos((s) => s.lines);
  const checkout = usePos((s) => s.checkout);
  const subtotal = linesSubtotal(lines);
  const [method, setMethod] = useState<PayMethod>("tunai");
  const [discount, setDiscount] = useState("");
  const [cash, setCash] = useState("");
  const [name, setName] = useState("");
  const [wa, setWa] = useState("");
  const [note, setNote] = useState("");

  const disc = Math.min(Math.max(0, Number(discount) || 0), subtotal);
  const total = subtotal - disc;
  const received = method === "tunai" ? Number(cash) || 0 : total;
  const change = method === "tunai" ? Math.max(0, received - total) : 0;
  const canPay = total >= 0 && lines.length > 0 && (method !== "tunai" || received >= total);
  const suggestions = useMemo(() => cashSuggestions(total), [total]);

  function reset() {
    setMethod("tunai");
    setDiscount("");
    setCash("");
    setName("");
    setWa("");
    setNote("");
  }

  function pay() {
    if (!canPay) {
      toast.error("Uang diterima kurang dari total.");
      return;
    }
    const sale = checkout({
      method,
      discount: disc,
      cashReceived: method === "tunai" ? received : undefined,
      customerName: name,
      customerWa: wa,
      note,
    });
    if (!sale) return;
    reset();
    onOpenChange(false);
    onPaid(sale);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) reset();
        onOpenChange(v);
      }}
    >
      <DialogContent className="max-h-[90svh] overflow-y-auto">
        <DialogTitle>Bayar</DialogTitle>
        <DialogDescription>
          Subtotal {formatRupiah(subtotal)}
          {disc > 0 ? ` · diskon ${formatRupiah(disc)}` : ""}. Pilih cara bayar, lalu simpan struk.
        </DialogDescription>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {PAY_METHODS.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMethod(m.id)}
              className={cn(
                "rounded-lg border px-2 py-3 text-center transition-colors",
                method === m.id
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border bg-surface text-fg hover:bg-primary-soft",
              )}
            >
              <span className="block text-sm font-semibold">{m.label}</span>
              <span
                className={cn(
                  "mt-0.5 block text-xs",
                  method === m.id ? "text-primary-fg/80" : "text-muted",
                )}
              >
                {m.hint}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="diskon">Diskon (Rp)</Label>
            <Input
              id="diskon"
              inputMode="numeric"
              value={discount}
              onChange={(e) => setDiscount(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="mt-1.5 tabular-nums"
            />
          </div>
          <div>
            <Label>Total</Label>
            <p className="mt-1.5 flex h-11 items-center font-display text-2xl font-semibold tabular-nums">
              {formatRupiah(total)}
            </p>
          </div>
        </div>

        {method === "tunai" ? (
          <div className="mt-3">
            <Label htmlFor="tunai">Uang diterima</Label>
            <Input
              id="tunai"
              inputMode="numeric"
              value={cash}
              onChange={(e) => setCash(e.target.value.replace(/\D/g, ""))}
              placeholder={String(total)}
              className="mt-1.5 tabular-nums"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {suggestions.map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setCash(String(n))}
                  className="h-10 rounded-md border border-border bg-bg px-3 text-sm tabular-nums hover:bg-primary-soft"
                >
                  {formatRupiah(n)}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-muted">
              Kembalian{" "}
              <span className="font-medium text-success tabular-nums">{formatRupiah(change)}</span>
            </p>
          </div>
        ) : (
          <p className="mt-3 rounded-lg bg-bg-warm px-3 py-3 text-sm text-muted">
            {method === "qris"
              ? "Minta pelanggan scan QRIS toko sebesar total di atas. Tandai lunas setelah notifikasi masuk."
              : "Minta transfer sesuai total. Nomor rekening dikirim via WhatsApp admin."}
          </p>
        )}

        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="nama">Nama pelanggan</Label>
            <Input
              id="nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Opsional"
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="wa-cust">WhatsApp</Label>
            <Input
              id="wa-cust"
              inputMode="tel"
              value={wa}
              onChange={(e) => setWa(e.target.value)}
              placeholder="08…"
              className="mt-1.5"
            />
          </div>
        </div>
        <div className="mt-3">
          <Label htmlFor="catatan">Catatan</Label>
          <Input
            id="catatan"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Misal: ambil sendiri, es krim extra"
            className="mt-1.5"
          />
        </div>

        <Button className="mt-5 w-full" size="lg" disabled={!canPay} onClick={pay}>
          Simpan transaksi {formatRupiah(total)}
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export function PaidDialog({
  sale,
  onClose,
}: {
  sale: Sale | null;
  onClose: () => void;
}) {
  if (!sale) return null;
  const target = sale.customerWa?.replace(/\D/g, "") || undefined;
  const href = waLink(receiptText(sale));
  const customerHref = target
    ? `https://wa.me/${target.startsWith("62") ? target : `62${target.replace(/^0/, "")}`}?text=${encodeURIComponent(receiptText(sale))}`
    : href;

  return (
    <Dialog open={!!sale} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogTitle>Transaksi tersimpan</DialogTitle>
        <DialogDescription>
          {sale.id} · {formatRupiah(sale.total)} ·{" "}
          {sale.method === "tunai" ? `kembali ${formatRupiah(sale.change ?? 0)}` : sale.method.toUpperCase()}
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-2">
          <Button onClick={() => printSale(sale)}>Cetak struk</Button>
          <Button variant="wa" asChild>
            <a href={customerHref} target="_blank" rel="noreferrer">
              Kirim struk WhatsApp
            </a>
          </Button>
          <Button variant="outline" onClick={onClose}>
            Transaksi baru
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
