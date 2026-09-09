import { Link } from "@tanstack/react-router";
import { MapPin, Phone } from "lucide-react";
import { LogoWordmark } from "@/components/logo";
import { categories } from "@/lib/catalog";
import { SITE, waLink } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto bg-ink text-ink-fg">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="[&_span]:text-ink-fg [&_.text-muted]:text-ink-muted [&_.text-fg]:text-ink-fg">
            <LogoWordmark />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-muted">
            {SITE.tagline}. Sertifikasi halal, kemasan vakum, suhu terjaga sampai depan rumah.
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Kategori
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link
                  to="/kategori/$slug"
                  params={{ slug: c.id }}
                  className="text-ink-fg/90 hover:text-ink-fg"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Belanja
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            <li>
              <Link to="/produk" className="hover:text-ink-fg">
                Semua produk
              </Link>
            </li>
            <li>
              <Link to="/paket" className="hover:text-ink-fg">
                Paket bundling
              </Link>
            </li>
            <li>
              <Link to="/langganan" className="hover:text-ink-fg">
                Langganan box
              </Link>
            </li>
            <li>
              <Link to="/kalkulator" className="hover:text-ink-fg">
                Kalkulator porsi
              </Link>
            </li>
            <li>
              <Link to="/tentang" className="hover:text-ink-fg">
                Tentang toko
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Toko
          </p>
          <ul className="mt-4 space-y-3 text-sm text-ink-muted">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0" />
              <span>{SITE.address}</span>
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0" />
              <a href={waLink()} className="text-ink-fg hover:underline">
                {SITE.wa}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-ink-muted sm:flex-row sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Tangkil Frozen. Kedungwuni, Pekalongan.</p>
          <p>Daging beku halal · Cold chain · Guest checkout</p>
        </div>
      </div>
    </footer>
  );
}
