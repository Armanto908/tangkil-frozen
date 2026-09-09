import { createFileRoute, Link } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QtyControl } from "@/components/qty-control";
import { cartCount, cartSubtotal, useCart } from "@/lib/cart-store";
import { formatRupiah, formatWeight } from "@/lib/format";
import { quoteShipping } from "@/lib/shipping";
import { useHydrated } from "@/lib/use-hydrated";

export const Route = createFileRoute("/keranjang")({
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const hydrated = useHydrated();
  const subtotal = cartSubtotal(items);
  const quote = quoteShipping("Kedungwuni", subtotal);

  if (!hydrated) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center text-muted">Memuat keranjang…</div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-semibold">Keranjang kosong</h1>
        <p className="mt-3 text-muted">
          Belum ada daging di keranjang. Mulai dari katalog atau paket hemat.
        </p>
        <Button asChild className="mt-8">
          <Link to="/produk">Belanja sekarang</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div>
        <h1 className="font-display text-4xl font-semibold">Keranjang</h1>
        <p className="mt-1 text-sm text-muted">{cartCount(items)} item</p>
        <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)]">
          {items.map((item) => (
            <li key={item.key} className="flex gap-4 p-4">
              <img
                src={item.image}
                alt=""
                className="size-24 shrink-0 rounded-lg object-cover"
              />
              <div className="min-w-0 flex-1">
                <Link
                  to="/produk/$slug"
                  params={{ slug: item.productSlug }}
                  className="font-display text-xl font-semibold leading-snug hover:text-primary"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {formatWeight(item.weightGrams)} · {item.packingLabel}
                </p>
                <p className="mt-1 text-sm font-medium tabular-nums">
                  {formatRupiah(item.unitPrice)}
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <QtyControl
                    value={item.qty}
                    onChange={(n) => setQty(item.key, n)}
                    min={0}
                  />
                  <button
                    type="button"
                    onClick={() => remove(item.key)}
                    className="inline-flex size-11 items-center justify-center rounded-md text-muted hover:bg-primary-soft hover:text-primary"
                    aria-label="Hapus"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
              <p className="hidden text-sm font-semibold tabular-nums sm:block">
                {formatRupiah(item.unitPrice * item.qty)}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <aside className="h-fit rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]">
        <h2 className="font-display text-2xl font-semibold">Ringkasan</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatRupiah(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Ongkir Pekalongan*</dt>
            <dd className="tabular-nums">
              {quote.fee === 0 ? "Gratis" : formatRupiah(quote.fee)}
            </dd>
          </div>
        </dl>
        <p className="mt-3 text-xs text-subtle">
          *Estimasi GoSend/Grab sameday. Kota lain dihitung di checkout.
        </p>
        <p className="mt-4 flex justify-between font-semibold">
          <span>Estimasi total</span>
          <span className="tabular-nums text-primary">{formatRupiah(subtotal + quote.fee)}</span>
        </p>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link to="/checkout">Lanjut checkout</Link>
        </Button>
        <Button asChild variant="ghost" className="mt-2 w-full">
          <Link to="/produk">Tambah produk lain</Link>
        </Button>
      </aside>
    </div>
  );
}
