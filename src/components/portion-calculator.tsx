import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { getProduct } from "@/lib/catalog";
import { formatRupiah, formatWeight } from "@/lib/format";
import { eventKinds, eventProductMap, recommendGrams, type EventKind } from "@/lib/portion";
import { cn } from "@/lib/utils";

export function PortionCalculator({ compact = false }: { compact?: boolean }) {
  const [kind, setKind] = useState<EventKind>("bbq");
  const [people, setPeople] = useState(8);

  const rec = useMemo(() => recommendGrams(kind, people), [kind, people]);
  const suggestions = eventProductMap[kind]
    .map((slug) => getProduct(slug))
    .filter((p) => p != null);

  return (
    <div
      className={cn(
        "rounded-2xl bg-surface p-5 shadow-[var(--shadow-border)] sm:p-7",
        compact && "p-4 sm:p-5",
      )}
    >
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Kalkulator porsi
      </p>
      <h2 className={cn("mt-2 font-display font-semibold text-fg", compact ? "text-2xl" : "text-3xl")}>
        Berapa kg daging yang perlu dibeli?
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted">
        Masukkan jumlah orang dan jenis acara. Kami hitung kebutuhan daging lalu sarankan produk yang pas.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {eventKinds.map((e) => (
          <button
            key={e.id}
            type="button"
            onClick={() => setKind(e.id)}
            className={cn(
              "h-11 rounded-full px-4 text-sm font-medium transition-colors",
              kind === e.id
                ? "bg-primary text-primary-fg"
                : "bg-bg-warm text-fg hover:bg-primary-soft",
            )}
          >
            {e.label}
          </button>
        ))}
      </div>

      <label className="mt-6 block">
        <span className="text-sm font-medium">Jumlah orang: {people}</span>
        <input
          type="range"
          min={2}
          max={80}
          value={people}
          onChange={(e) => setPeople(Number(e.target.value))}
          className="mt-3 w-full accent-primary"
        />
        <span className="mt-1 flex justify-between text-xs text-subtle">
          <span>2</span>
          <span>80</span>
        </span>
      </label>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Per orang" value={formatWeight(rec.perPerson)} />
        <Stat label="Total daging" value={`${rec.kg} kg`} accent />
        <Stat label="Acara" value={rec.label} />
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-sm font-medium">Rekomendasi produk</p>
        {suggestions.map((p) => (
          <Link
            key={p.slug}
            to="/produk/$slug"
            params={{ slug: p.slug }}
            className="flex items-center gap-3 rounded-lg p-2 hover:bg-bg-warm"
          >
            <img
              src={p.image}
              alt=""
              className="size-14 rounded-md object-cover"
            />
            <span className="flex-1 text-sm font-medium">{p.name}</span>
            <span className="text-sm tabular-nums text-muted">
              {formatRupiah(p.weights[0].price)}
            </span>
          </Link>
        ))}
      </div>

      {!compact ? (
        <Button asChild className="mt-6">
          <Link to="/produk">Lihat semua produk</Link>
        </Button>
      ) : null}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className={cn("rounded-xl bg-bg-warm px-4 py-3", accent && "bg-primary text-primary-fg")}>
      <p className={cn("text-xs", accent ? "text-primary-fg/80" : "text-muted")}>{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold tabular-nums">{value}</p>
    </div>
  );
}
