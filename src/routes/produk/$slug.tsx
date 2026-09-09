import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { BadgeCheck, Snowflake, Thermometer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QtyControl } from "@/components/qty-control";
import { ProductCard } from "@/components/product-card";
import { getProduct, getCategory, products } from "@/lib/catalog";
import { useCart } from "@/lib/cart-store";
import { formatRupiah, formatWeight } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/produk/$slug")({
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const product = getProduct(slug);

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Produk tidak ditemukan</h1>
        <Button asChild className="mt-6">
          <Link to="/produk">Kembali ke katalog</Link>
        </Button>
      </div>
    );
  }

  return <ProductDetail key={product.slug} product={product} />;
}

function ProductDetail({ product }: { product: (typeof products)[number] }) {
  const add = useCart((s) => s.add);
  const [weightIdx, setWeightIdx] = useState(0);
  const [packingId, setPackingId] = useState(product.packing[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [shot, setShot] = useState<"pack" | "cooked">("pack");

  const related = useMemo(
    () =>
      products
        .filter((p) => p.category === product.category && p.slug !== product.slug)
        .slice(0, 4),
    [product],
  );

  const packing = product.packing.find((p) => p.id === packingId) ?? product.packing[0];
  const weight = product.weights[Math.min(weightIdx, product.weights.length - 1)];

  const gallery = [
    { id: "pack" as const, src: product.image, label: "Kemasan vakum" },
    ...(product.cookedImage
      ? [{ id: "cooked" as const, src: product.cookedImage, label: "Siap saji" }]
      : []),
  ];

  const activeShot = gallery.find((g) => g.id === shot) ?? gallery[0];

  function addToCart() {
    add({
      productSlug: product.slug,
      weightGrams: weight.grams,
      packingId: packing.id,
      qty,
    });
    toast.success(`${product.name} masuk keranjang`);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
      <p className="text-sm text-muted">
        <Link to="/produk" className="hover:text-fg">
          Produk
        </Link>
        <span className="mx-2">/</span>
        <Link
          to="/kategori/$slug"
          params={{ slug: product.category }}
          className="hover:text-fg"
        >
          {getCategory(product.category)?.name ?? product.category}
        </Link>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <div className="overflow-hidden rounded-2xl bg-bg-warm">
            <img
              src={activeShot.src}
              alt={`${product.name} — ${activeShot.label}`}
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
          {gallery.length > 1 ? (
            <div className="mt-3 flex gap-2">
              {gallery.map((g) => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setShot(g.id)}
                  className={cn(
                    "overflow-hidden rounded-lg",
                    shot === g.id ? "ring-2 ring-primary" : "opacity-80",
                  )}
                >
                  <img src={g.src} alt={g.label} className="size-20 object-cover" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            {product.badges.map((b) => (
              <Badge key={b} tone={b.includes("Halal") ? "success" : "default"}>
                {b}
              </Badge>
            ))}
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold">{product.name}</h1>
          <p className="mt-2 text-muted">{product.tagline}</p>
          <p className="mt-4 text-sm leading-relaxed text-fg">{product.description}</p>

          {product.bundleContents ? (
            <ul className="mt-4 space-y-1 rounded-xl bg-bg-warm p-4 text-sm">
              {product.bundleContents.map((line) => (
                <li key={line}>· {line}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-medium">Berat bersih</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {product.weights.map((w, i) => (
                <button
                  key={w.grams}
                  type="button"
                  onClick={() => setWeightIdx(i)}
                  className={cn(
                    "min-h-11 rounded-md px-4 text-sm font-medium shadow-[var(--shadow-border)]",
                    i === weightIdx
                      ? "bg-primary text-primary-fg"
                      : "bg-surface text-fg hover:bg-primary-soft",
                  )}
                >
                  {formatWeight(w.grams)} · {formatRupiah(w.price)}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-sm font-medium">Kemasan vakum</p>
            <div className="mt-2 grid gap-2">
              {product.packing.map((p) => (
                <label
                  key={p.id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-3",
                    packing.id === p.id ? "border-primary bg-primary-soft" : "border-border bg-surface",
                  )}
                >
                  <input
                    type="radio"
                    name="packing"
                    className="mt-1 accent-primary"
                    checked={packing.id === p.id}
                    onChange={() => setPackingId(p.id)}
                  />
                  <span>
                    <span className="block text-sm font-medium">{p.label}</span>
                    {p.note ? <span className="text-xs text-muted">{p.note}</span> : null}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <QtyControl value={qty} onChange={setQty} />
            <div className="flex-1">
              <p className="text-xs text-muted">Subtotal</p>
              <p className="font-display text-3xl font-semibold tabular-nums text-primary">
                {formatRupiah(weight.price * qty)}
              </p>
              {weight.originalPrice ? (
                <p className="text-sm text-subtle line-through">
                  {formatRupiah(weight.originalPrice * qty)}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Button size="lg" className="flex-1" onClick={addToCart}>
              Tambah ke keranjang
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link to="/keranjang">Lihat keranjang</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-3">
        <InfoCard
          icon={<Thermometer className="size-5" />}
          title="Saran penyimpanan"
          body={product.storage}
        />
        <InfoCard
          icon={<Snowflake className="size-5" />}
          title="Saran penyajian"
          body={product.serving}
        />
        <InfoCard
          icon={<BadgeCheck className="size-5" />}
          title="Label & kedaluwarsa"
          body={`${product.expiryNote}${product.bpom ? ` Nomor BPOM: ${product.bpom}.` : " Produk segar vakum, bukan olahan pabrik ber-BPOM."}`}
        />
      </div>

      <section className="mt-10 rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Resep singkat</p>
        <h2 className="mt-2 font-display text-2xl font-semibold">{product.recipe.title}</h2>
        <ol className="mt-4 space-y-3 text-sm leading-relaxed">
          {product.recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary">
                {i + 1}
              </span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="font-display text-2xl font-semibold">Produk serupa</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function InfoCard({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-xl bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex size-10 items-center justify-center rounded-md bg-primary-soft text-primary">
        {icon}
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
