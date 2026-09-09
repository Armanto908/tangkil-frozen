import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import {
  BadgeCheck,
  Snowflake,
  Truck,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { PortionCalculator } from "@/components/portion-calculator";
import { categories, products, testimonials } from "@/lib/catalog";
import { SITE, waLink } from "@/lib/site";
import { formatRupiah } from "@/lib/format";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const featured = products.filter((p) => p.featured && !p.isBundle).slice(0, 8);
  const bundles = products.filter((p) => p.isBundle);

  return (
    <div>
      <section className="relative min-h-[34rem] overflow-hidden sm:min-h-[38rem]">
        <img
          src="/images/hero.jpg"
          alt="Irisan wagyu premium Tangkil Frozen"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/55 to-ink/20" />
        <div className="relative mx-auto flex min-h-[34rem] max-w-6xl flex-col justify-end px-4 py-16 sm:min-h-[38rem] sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
            Kedungwuni · Pekalongan · Halal
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl font-semibold text-ink-fg sm:text-6xl">
            Daging beku berkualitas, suhu terjaga sampai rumah.
          </h1>
          <p className="mt-4 max-w-lg text-base text-ink-muted sm:text-lg">
            Wagyu slice, rendang, iga, ayam, kambing, dan olahan vakum. Cold chain dari freezer toko sampai kurir instan.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/produk">Belanja sekarang</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-ink-fg hover:bg-white/20">
              <Link to="/kalkulator">Hitung porsi</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-px bg-border sm:grid-cols-3">
          <Value
            icon={<BadgeCheck className="size-5" />}
            title="100% Halal & higienis"
            body="Sertifikasi MUI / BPJPH. Dipotong, divakum, dan dibekukan di rantai dingin."
          />
          <Value
            icon={<Snowflake className="size-5" />}
            title="Suhu terjaga"
            body="Cold chain dari freezer toko, ice pack, sampai tangan pembeli."
          />
          <Value
            icon={<Truck className="size-5" />}
            title="Kirim cepat"
            body="GoSend & GrabExpress sameday area Pekalongan. Paxel untuk luar kota."
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Kategori
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Belanja sesuai menu
            </h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <Link to="/produk">
              Semua produk <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/kategori/$slug"
              params={{ slug: c.id }}
              className="group overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={c.image}
                  alt=""
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-3 sm:p-4">
                <p className="font-display text-lg font-semibold leading-snug">{c.name}</p>
                <p className="mt-1 hidden text-xs text-muted sm:block">{c.blurb}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-bg-warm/60">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Pilihan toko
              </p>
              <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Daging yang paling sering di-stok
              </h2>
            </div>
            <Button asChild variant="outline">
              <Link to="/produk">Lihat katalog</Link>
            </Button>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
              Paket hemat
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Bundling untuk BBQ dan stok bulanan
            </h2>
            <p className="mt-3 max-w-md text-muted">
              Isi sudah diracik. Lebih hemat dari beli satuan, dikirim dalam satu box ber-ice pack.
            </p>
          </div>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {bundles.map((b) => (
            <Link
              key={b.slug}
              to="/produk/$slug"
              params={{ slug: b.slug }}
              className="group grid overflow-hidden rounded-2xl bg-surface shadow-[var(--shadow-border)] sm:grid-cols-2"
            >
              <img
                src={b.image}
                alt={b.name}
                className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto"
              />
              <div className="flex flex-col p-5">
                <h3 className="font-display text-2xl font-semibold">{b.name}</h3>
                <p className="mt-2 text-sm text-muted">{b.tagline}</p>
                <ul className="mt-4 space-y-1 text-sm text-fg">
                  {b.bundleContents?.map((line) => (
                    <li key={line} className="flex gap-2">
                      <ShieldCheck className="mt-0.5 size-4 shrink-0 text-success" />
                      {line}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-5 font-semibold tabular-nums text-primary">
                  {formatRupiah(b.weights[0].price)}
                  {b.weights[0].originalPrice ? (
                    <span className="ml-2 text-sm font-normal text-subtle line-through">
                      {formatRupiah(b.weights[0].originalPrice)}
                    </span>
                  ) : null}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-surface">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <PortionCalculator compact />
          <div className="overflow-hidden rounded-2xl">
            <img
              src="/images/lifestyle-shabu.jpg"
              alt="Shabu-shabu rumahan dengan slice Tangkil"
              className="h-full min-h-72 w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-8 overflow-hidden rounded-2xl bg-primary text-primary-fg md:grid-cols-2">
          <img
            src="/images/bundle-monthly.jpg"
            alt="Kotak langganan stok bulanan"
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-fg/70">
              Subscription box
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
              Daging datang tiap minggu, harga langganan.
            </h2>
            <p className="mt-3 text-primary-fg/80">
              Pilih kotak mingguan, bulanan, atau BBQ. Bisa jeda kapan saja lewat WhatsApp.
            </p>
            <Button asChild variant="outline" className="mt-6 w-fit border-primary-fg/30 bg-transparent text-primary-fg hover:bg-white/10">
              <Link to="/langganan">Lihat paket langganan</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-bg-warm/50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
            Ulasan pelanggan
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            Masih beku saat sampai
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)]"
              >
                <img src={t.image} alt="" className="aspect-[4/3] w-full object-cover" />
                <figcaption className="p-5">
                  <Stars n={t.rating} />
                  <blockquote className="mt-3 text-sm leading-relaxed text-fg">
                    “{t.quote}”
                  </blockquote>
                  <p className="mt-4 text-sm font-medium">
                    {t.name}
                    <span className="font-normal text-muted"> · {t.area}</span>
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden">
        <img
          src="/images/delivery.jpg"
          alt="Tas pendingin Tangkil Frozen tiba di rumah"
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/75" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <h2 className="max-w-xl font-display text-3xl font-semibold text-ink-fg sm:text-5xl">
            Ambil di toko atau kirim instan.
          </h2>
          <p className="mt-4 max-w-md text-ink-muted">
            {SITE.address}. Chat admin untuk cek stok hari ini.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" variant="wa">
              <a href={waLink("Halo, saya mau cek stok dan ongkir sameday.")} target="_blank" rel="noreferrer">
                WhatsApp {SITE.wa}
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/10 text-ink-fg hover:bg-white/20">
              <Link to="/tentang">Jam & lokasi</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

function Value({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-4 bg-surface px-5 py-8 sm:px-8">
      <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-display text-xl font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted">{body}</p>
      </div>
    </div>
  );
}

function Stars({ n }: { n: number }) {
  return (
    <p className="text-xs font-medium tracking-widest text-primary" aria-label={`${n} dari 5`}>
      {"●".repeat(n)}
      <span className="text-border">{"●".repeat(5 - n)}</span>
    </p>
  );
}
