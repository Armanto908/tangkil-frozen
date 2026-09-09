import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ProductCard } from "@/components/product-card";
import { categories, products, type CategoryId } from "@/lib/catalog";
import { cn } from "@/lib/utils";

type Search = { q?: string };

export const Route = createFileRoute("/produk/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
  }),
  component: ProdukIndex,
});

function ProdukIndex() {
  const { q } = Route.useSearch();
  const [cat, setCat] = useState<CategoryId | "all">("all");

  const list = useMemo(() => {
    const query = (q ?? "").trim().toLowerCase();
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Katalog</p>
      <h1 className="mt-2 font-display text-4xl font-semibold">Semua produk</h1>
      <p className="mt-2 max-w-xl text-muted">
        Pilih kategori, berat, dan jenis vakum di halaman produk. Guest checkout — tanpa buat akun.
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
        <FilterChip active={cat === "all"} onClick={() => setCat("all")}>
          Semua
        </FilterChip>
        {categories.map((c) => (
          <FilterChip key={c.id} active={cat === c.id} onClick={() => setCat(c.id)}>
            {c.name}
          </FilterChip>
        ))}
      </div>

      {q ? (
        <p className="mt-4 text-sm text-muted">
          Hasil untuk “{q}” · {list.length} produk
        </p>
      ) : (
        <p className="mt-4 text-sm text-muted">{list.length} produk</p>
      )}

      {list.length === 0 ? (
        <p className="mt-10 rounded-xl bg-surface p-8 text-center text-muted shadow-[var(--shadow-border)]">
          Tidak ada produk yang cocok. Coba kata kunci lain.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
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
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-11 shrink-0 rounded-full px-4 text-sm font-medium",
        active ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-[var(--shadow-border)]",
      )}
    >
      {children}
    </button>
  );
}
