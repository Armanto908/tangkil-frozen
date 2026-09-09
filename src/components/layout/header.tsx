import type { FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { LogoWordmark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { cartCount, useCart } from "@/lib/cart-store";
import { SITE, waLink } from "@/lib/site";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/produk", label: "Produk" },
  { to: "/paket", label: "Paket" },
  { to: "/kalkulator", label: "Kalkulator porsi" },
  { to: "/langganan", label: "Langganan" },
  { to: "/tentang", label: "Toko" },
] as const;

export function Header() {
  const items = useCart((s) => s.items);
  const hydrated = useHydrated();
  const count = hydrated ? cartCount(items) : 0;
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function submitSearch(e: FormEvent) {
    e.preventDefault();
    const query = q.trim();
    void navigate({ to: "/produk", search: query ? { q: query } : {} });
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:h-[4.25rem] sm:px-6">
        <Link to="/" className="shrink-0" onClick={() => setOpen(false)}>
          <LogoWordmark />
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-primary-soft hover:text-fg"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <form
          onSubmit={submitSearch}
          className="ml-auto hidden max-w-xs flex-1 items-center gap-2 rounded-full border border-border bg-surface px-3 md:flex"
        >
          <Search className="size-4 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari daging, iga, bakso…"
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-subtle"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 md:ml-2">
          <a
            href={waLink(`Halo Tangkil Frozen, saya ingin bertanya stok daging.`)}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex"
          >
            <Button variant="ghost" size="sm" className="text-muted">
              WhatsApp
            </Button>
          </a>
          <Link
            to="/keranjang"
            className="relative inline-flex size-11 items-center justify-center rounded-md text-fg hover:bg-primary-soft"
            aria-label={`Keranjang, ${count} item`}
          >
            <ShoppingBag className="size-5" />
            {count > 0 ? (
              <span className="absolute right-1.5 top-1.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-semibold leading-4 text-primary-fg tabular-nums">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-md lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Tutup menu" : "Buka menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border bg-bg lg:hidden",
          open ? "block" : "hidden",
        )}
      >
        <form onSubmit={submitSearch} className="flex items-center gap-2 px-4 py-3">
          <Search className="size-4 text-subtle" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari produk…"
            className="h-11 flex-1 bg-transparent text-sm outline-none"
          />
        </form>
        <nav className="flex flex-col px-2 pb-4">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-3 text-base font-medium text-fg hover:bg-primary-soft"
            >
              {item.label}
            </Link>
          ))}
          <a
            href={waLink()}
            className="rounded-md px-3 py-3 text-base font-medium text-primary"
            target="_blank"
            rel="noreferrer"
          >
            Chat WhatsApp · {SITE.wa}
          </a>
        </nav>
      </div>
    </header>
  );
}
