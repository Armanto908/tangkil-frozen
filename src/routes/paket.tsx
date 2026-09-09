import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { products } from "@/lib/catalog";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/paket")({
  component: PaketPage,
});

function PaketPage() {
  const bundles = products.filter((p) => p.isBundle);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Bundling</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Paket hemat</h1>
      <p className="mt-2 max-w-xl text-muted">
        Isi sudah diracik untuk BBQ weekend atau stok freezer sebulan. Lebih hemat dari beli satuan.
      </p>
      <div className="mt-10 grid gap-8">
        {bundles.map((b) => (
          <article
            key={b.slug}
            className="grid overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)] md:grid-cols-2"
          >
            <img src={b.image} alt={b.name} className="h-64 w-full object-cover md:h-full" />
            <div className="flex flex-col p-6 sm:p-8">
              <h2 className="font-display text-3xl font-semibold">{b.name}</h2>
              <p className="mt-2 text-muted">{b.description}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {b.bundleContents?.map((line) => (
                  <li key={line}>· {line}</li>
                ))}
              </ul>
              <p className="mt-6 font-display text-3xl font-semibold tabular-nums text-primary">
                {formatRupiah(b.weights[0].price)}
              </p>
              {b.weights[0].originalPrice ? (
                <p className="text-sm text-subtle line-through">
                  {formatRupiah(b.weights[0].originalPrice)}
                </p>
              ) : null}
              <Button asChild className="mt-6 w-fit">
                <Link to="/produk/$slug" params={{ slug: b.slug }}>
                  Pilih paket
                </Link>
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
