import { Link } from "@tanstack/react-router";
import { lowestPrice, type Product } from "@/lib/catalog";
import { formatRupiah, formatWeight } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export function ProductCard({ product }: { product: Product }) {
  const price = lowestPrice(product);
  const fromWeight = product.weights[0];
  const sale = fromWeight?.originalPrice;

  return (
    <Link
      to="/produk/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-200 hover:shadow-[var(--shadow-lift)]"
    >
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-bg-warm">
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        {product.isBundle ? (
          <Badge tone="ink" className="absolute left-3 top-3 z-10">
            Paket hemat
          </Badge>
        ) : null}
      </div>
      <div className="relative z-10 flex flex-1 flex-col gap-2 border-t border-border bg-surface p-4">
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.16em] text-muted">
          {formatWeight(fromWeight.grams)}
        </p>
        <h3 className="font-display text-xl font-semibold leading-snug text-fg">
          {product.name}
        </h3>
        <p className="line-clamp-2 text-sm text-muted">{product.tagline}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            {sale ? (
              <p className="text-xs text-subtle line-through">{formatRupiah(sale)}</p>
            ) : null}
            <p className="text-sm font-semibold tabular-nums text-primary">
              {product.weights.length > 1 ? "Mulai " : ""}
              {formatRupiah(price)}
            </p>
          </div>
          <span className="text-sm font-medium text-primary">Lihat</span>
        </div>
      </div>
    </Link>
  );
}
