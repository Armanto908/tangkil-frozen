import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PaidDialog, PayDialog } from "@/components/kasir/pay-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { categories, products, type CategoryId } from "@/lib/catalog";
import { formatRupiah, formatWeight } from "@/lib/format";
import { linesSubtotal } from "@/lib/pos";
import { usePos, usePosHydrated, type Sale } from "@/lib/pos-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/kasir/")({
  component: KasirPage,
});

function KasirPage() {
  const hydrated = usePosHydrated();
  const shift = usePos((s) => s.shift);
  const openShift = usePos((s) => s.openShift);
  const [cash, setCash] = useState("0");

  if (!hydrated) {
    return <div className="flex-1 bg-bg" />;
  }

  if (!shift || shift.closedAt) {
    return (
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Shift</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Buka kasir hari ini</h1>
        <p className="mt-2 text-sm text-muted">
          Isi modal tunai di laci, lalu mulai transaksi. Data tersimpan di perangkat ini.
        </p>
        <Label htmlFor="modal" className="mt-8">
          Modal tunai (Rp)
        </Label>
        <Input
          id="modal"
          inputMode="numeric"
          value={cash}
          onChange={(e) => setCash(e.target.value.replace(/\D/g, ""))}
          className="mt-1.5 tabular-nums"
        />
        <Button
          className="mt-5"
          size="lg"
          onClick={() => {
            openShift(Number(cash) || 0);
            toast.success("Shift dibuka");
          }}
        >
          Buka shift
        </Button>
      </div>
    );
  }

  return <PosFloor />;
}

function PosFloor() {
  const [cat, setCat] = useState<CategoryId | "all">("all");
  const [q, setQ] = useState("");
  const [payOpen, setPayOpen] = useState(false);
  const [paid, setPaid] = useState<Sale | null>(null);
  const [customOpen, setCustomOpen] = useState(false);
  const addProduct = usePos((s) => s.addProduct);

  const list = useMemo(() => {
    const query = q.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = cat === "all" || p.category === cat;
      const okQ =
        !query ||
        p.name.toLowerCase().includes(query) ||
        p.tagline.toLowerCase().includes(query);
      return okCat && okQ;
    });
  }, [cat, q]);

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:px-5">
          <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3">
            <Search className="size-4 text-subtle" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cari wagyu, iga, bakso…"
              className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-subtle"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
              Semua
            </FilterChip>
            {categories.map((c) => (
              <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
                {c.name}
              </FilterChip>
            ))}
            <FilterChip active={customOpen} onClick={() => setCustomOpen((v) => !v)}>
              Item lain
            </FilterChip>
          </div>
          {customOpen ? <CustomItemForm onDone={() => setCustomOpen(false)} /> : null}
        </div>

        <div className="grid grid-cols-2 gap-2 overflow-y-auto p-3 sm:grid-cols-3 sm:p-4 xl:grid-cols-4">
          {list.map((p) => (
            <article
              key={p.slug}
              className="flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-border"
            >
              <div className="relative aspect-[4/3] bg-bg-warm">
                <img
                  src={p.image}
                  alt=""
                  className="absolute inset-0 size-full object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 border-t border-border p-2.5">
                <h2 className="line-clamp-2 text-sm font-semibold leading-snug">{p.name}</h2>
                <div className="mt-auto flex flex-wrap gap-1.5">
                  {p.weights.map((w) => (
                    <button
                      key={w.grams}
                      type="button"
                      onClick={() => {
                        addProduct(p.slug, w.grams);
                        toast.success(`${p.name} ${formatWeight(w.grams)}`);
                      }}
                      className="min-h-10 flex-1 rounded-md bg-primary-soft px-2 py-1.5 text-left text-xs font-medium text-primary hover:bg-primary hover:text-primary-fg"
                    >
                      <span className="block">{formatWeight(w.grams)}</span>
                      <span className="tabular-nums">{formatRupiah(w.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <CartColumn onPay={() => setPayOpen(true)} />
      <PayDialog open={payOpen} onOpenChange={setPayOpen} onPaid={setPaid} />
      <PaidDialog sale={paid} onClose={() => setPaid(null)} />
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-10 shrink-0 rounded-full px-3.5 text-sm font-medium",
        active ? "bg-primary text-primary-fg" : "bg-surface text-muted ring-1 ring-border",
      )}
    >
      {children}
    </button>
  );
}

function CustomItemForm({ onDone }: { onDone: () => void }) {
  const addCustom = usePos((s) => s.addCustom);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  return (
    <form
      className="grid gap-2 rounded-lg border border-border bg-surface p-3 sm:grid-cols-[1fr_8rem_auto]"
      onSubmit={(e) => {
        e.preventDefault();
        const n = Number(price);
        if (!name.trim() || n <= 0) {
          toast.error("Isi nama dan harga.");
          return;
        }
        addCustom(name, n);
        toast.success(name.trim());
        setName("");
        setPrice("");
        onDone();
      }}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nama item, misal ice pack"
      />
      <Input
        inputMode="numeric"
        value={price}
        onChange={(e) => setPrice(e.target.value.replace(/\D/g, ""))}
        placeholder="Harga"
        className="tabular-nums"
      />
      <Button type="submit">Tambah</Button>
    </form>
  );
}

function CartColumn({ onPay }: { onPay: () => void }) {
  const lines = usePos((s) => s.lines);
  const setQty = usePos((s) => s.setQty);
  const remove = usePos((s) => s.remove);
  const clearCart = usePos((s) => s.clearCart);
  const subtotal = linesSubtotal(lines);

  return (
    <aside className="flex w-full flex-col border-t border-border bg-surface lg:w-96 lg:border-t-0 lg:border-l">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="font-display text-xl font-semibold">Pesanan</h2>
        {lines.length > 0 ? (
          <button
            type="button"
            onClick={() => clearCart()}
            className="text-xs font-medium text-muted hover:text-primary"
          >
            Kosongkan
          </button>
        ) : null}
      </div>
      <ul className="flex-1 overflow-y-auto px-3 py-2">
        {lines.length === 0 ? (
          <li className="px-1 py-10 text-center text-sm text-muted">
            Ketuk berat di kartu produk untuk menambah.
          </li>
        ) : (
          lines.map((line) => (
            <li key={line.key} className="flex gap-2 border-b border-border py-3">
              {line.image ? (
                <img
                  src={line.image}
                  alt=""
                  className="size-12 rounded-md object-cover"
                />
              ) : (
                <div className="size-12 rounded-md bg-bg-warm" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{line.name}</p>
                <p className="text-xs text-muted tabular-nums">
                  {line.weightGrams ? `${formatWeight(line.weightGrams)} · ` : ""}
                  {formatRupiah(line.unitPrice)}
                </p>
                <div className="mt-1.5 flex items-center gap-1">
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md border border-border"
                    onClick={() => setQty(line.key, line.qty - 1)}
                    aria-label="Kurangi"
                  >
                    <Minus className="size-3.5" />
                  </button>
                  <span className="min-w-6 text-center text-sm tabular-nums">{line.qty}</span>
                  <button
                    type="button"
                    className="flex size-9 items-center justify-center rounded-md border border-border"
                    onClick={() => setQty(line.key, line.qty + 1)}
                    aria-label="Tambah"
                  >
                    <Plus className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    className="ml-auto flex size-9 items-center justify-center rounded-md text-muted hover:bg-primary-soft hover:text-primary"
                    onClick={() => remove(line.key)}
                    aria-label="Hapus"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
      <div className="border-t border-border p-4">
        <div className="flex items-end justify-between">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="font-display text-3xl font-semibold tabular-nums">
            {formatRupiah(subtotal)}
          </span>
        </div>
        <Button className="mt-3 w-full" size="lg" disabled={lines.length === 0} onClick={onPay}>
          Bayar
        </Button>
      </div>
    </aside>
  );
}
