import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cartSubtotal, useCart, type CartItem } from "@/lib/cart-store";
import { formatRupiah, formatWeight } from "@/lib/format";
import {
  couriers,
  payments,
  quoteShipping,
  type CourierId,
  type PaymentId,
} from "@/lib/shipping";
import { SITE, waLink } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

type Form = {
  name: string;
  wa: string;
  address: string;
  city: string;
  notes: string;
};

function CheckoutPage() {
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const hydrated = useHydrated();
  const [form, setForm] = useState<Form>({
    name: "",
    wa: "",
    address: "",
    city: "Kedungwuni",
    notes: "",
  });
  const [courierId, setCourierId] = useState<CourierId>("gosend");
  const [paymentId, setPaymentId] = useState<PaymentId>("qris");
  const [order, setOrder] = useState<null | {
    id: string;
    items: CartItem[];
    total: number;
    message: string;
  }>(null);

  const subtotal = cartSubtotal(items);
  const quote = useMemo(() => quoteShipping(form.city, subtotal), [form.city, subtotal]);
  const available = couriers.filter((c) => quote.available.includes(c.id));
  const courier =
    available.find((c) => c.id === courierId) ?? available[0] ?? couriers[0];
  const payment = payments.find((p) => p.id === paymentId) ?? payments[0];
  const total = subtotal + quote.fee;

  function field<K extends keyof Form>(key: K) {
    return {
      value: form[key],
      onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [key]: e.target.value })),
    };
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    if (items.length === 0) return;
    const id = `TF-${Date.now().toString().slice(-6)}`;
    const lines = items
      .map(
        (i) =>
          `• ${i.name} ${formatWeight(i.weightGrams)} / ${i.packingLabel} × ${i.qty} = ${formatRupiah(i.unitPrice * i.qty)}`,
      )
      .join("\n");
    const message = [
      `Halo Tangkil Frozen, saya ingin pesan (tanpa akun).`,
      `No. pesanan: ${id}`,
      ``,
      lines,
      ``,
      `Subtotal: ${formatRupiah(subtotal)}`,
      `Ongkir (${quote.zone} · ${courier.name}): ${quote.fee === 0 ? "Gratis" : formatRupiah(quote.fee)}`,
      `Total: ${formatRupiah(total)}`,
      `Bayar: ${payment.name}`,
      ``,
      `Nama: ${form.name}`,
      `WhatsApp: ${form.wa}`,
      `Alamat: ${form.address}`,
      `Kota: ${form.city}`,
      form.notes ? `Catatan: ${form.notes}` : "",
      ``,
      `Mohon konfirmasi stok & pembayaran.`,
    ]
      .filter(Boolean)
      .join("\n");

    const snapshot = { id, items: [...items], total, message };
    try {
      const prev = JSON.parse(localStorage.getItem("tangkil-orders") ?? "[]") as unknown[];
      localStorage.setItem("tangkil-orders", JSON.stringify([snapshot, ...prev].slice(0, 10)));
    } catch {
      /* ignore quota */
    }
    clear();
    setOrder(snapshot);
  }

  if (!hydrated && !order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-muted">Memuat checkout…</div>
    );
  }

  if (order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-success">
          Pesanan tercatat
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold">Kirim ke WhatsApp admin</h1>
        <p className="mt-3 text-muted">
          Nomor {order.id}. Total {formatRupiah(order.total)}. Tombol di bawah membuka chat dengan
          rincian pesanan — admin konfirmasi pembayaran & jadwal kurir.
        </p>
        <Button asChild size="lg" variant="wa" className="mt-8 w-full">
          <a href={waLink(order.message)} target="_blank" rel="noreferrer">
            Konfirmasi via WhatsApp
          </a>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link to="/produk">Belanja lagi</Link>
        </Button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Keranjang masih kosong</h1>
        <Button asChild className="mt-6">
          <Link to="/produk">Pilih daging dulu</Link>
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.1fr_0.9fr]"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
          Guest checkout
        </p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Isi data pengiriman</h1>
        <p className="mt-2 text-sm text-muted">
          Tidak perlu buat akun. Cukup nama, alamat, dan WhatsApp.
        </p>

        <div className="mt-8 space-y-4 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          <Field label="Nama lengkap">
            <Input required placeholder="Nama penerima" {...field("name")} />
          </Field>
          <Field label="Nomor WhatsApp">
            <Input required type="tel" placeholder="08…" {...field("wa")} />
          </Field>
          <Field label="Alamat lengkap">
            <Textarea required placeholder="Jalan, RT/RW, patokan" {...field("address")} />
          </Field>
          <Field label="Kota / kecamatan">
            <Input required placeholder="Kedungwuni, Pekalongan" {...field("city")} />
          </Field>
          <Field label="Catatan (opsional)">
            <Textarea placeholder="Jam terima, cabai tidak pedas, dll." {...field("notes")} />
          </Field>
        </div>

        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          <h2 className="font-display text-2xl font-semibold">Kurir frozen</h2>
          <p className="mt-1 text-sm text-muted">
            {quote.zone} · {quote.eta}. {quote.coldNote}
          </p>
          <div className="mt-4 grid gap-2">
            {(available.length ? available : couriers).map((c) => (
              <label
                key={c.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-3",
                  courier.id === c.id ? "border-primary bg-primary-soft" : "border-border",
                )}
              >
                <input
                  type="radio"
                  name="courier"
                  className="mt-1 accent-primary"
                  checked={courier.id === c.id}
                  onChange={() => setCourierId(c.id)}
                />
                <span>
                  <span className="block text-sm font-medium">{c.name}</span>
                  <span className="text-xs text-muted">
                    {c.kind} · {c.note}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6 rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-6">
          <h2 className="font-display text-2xl font-semibold">Pembayaran</h2>
          <p className="mt-1 text-sm text-muted">
            QRIS, transfer, VA, atau e-wallet. Verifikasi cepat via WhatsApp.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            {payments.map((p) => (
              <label
                key={p.id}
                className={cn(
                  "flex cursor-pointer gap-3 rounded-lg border p-3",
                  paymentId === p.id ? "border-primary bg-primary-soft" : "border-border",
                )}
              >
                <input
                  type="radio"
                  name="pay"
                  className="mt-1 accent-primary"
                  checked={paymentId === p.id}
                  onChange={() => setPaymentId(p.id)}
                />
                <span>
                  <span className="block text-sm font-medium">{p.name}</span>
                  <span className="text-xs text-muted">{p.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl font-semibold">Pesanan</h2>
        <ul className="mt-4 space-y-3">
          {items.map((i) => (
            <li key={i.key} className="flex gap-3 text-sm">
              <img src={i.image} alt="" className="size-14 rounded-md object-cover" />
              <span className="flex-1">
                {i.name}
                <span className="block text-xs text-muted">
                  {formatWeight(i.weightGrams)} · {i.packingLabel} × {i.qty}
                </span>
              </span>
              <span className="tabular-nums">{formatRupiah(i.unitPrice * i.qty)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ongkir</dt>
            <dd className="tabular-nums">{quote.fee === 0 ? "Gratis" : formatRupiah(quote.fee)}</dd>
          </div>
          <div className="flex justify-between text-base font-semibold">
            <dt>Total</dt>
            <dd className="tabular-nums text-primary">{formatRupiah(total)}</dd>
          </div>
        </dl>
        <Button type="submit" size="lg" className="mt-6 w-full">
          Buat pesanan
        </Button>
        <p className="mt-3 text-center text-xs text-subtle">
          Setelah ini Anda diarahkan ke WhatsApp {SITE.wa} untuk konfirmasi.
        </p>
      </aside>
    </form>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
