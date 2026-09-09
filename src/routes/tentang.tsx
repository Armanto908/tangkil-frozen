import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, Phone, Snowflake, BadgeCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SITE, waLink } from "@/lib/site";

export const Route = createFileRoute("/tentang")({
  component: TentangPage,
});

function TentangPage() {
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`;

  return (
    <div>
      <section className="relative h-64 overflow-hidden sm:h-80">
        <img src="/images/family-table.jpg" alt="" className="size-full object-cover" />
        <div className="absolute inset-0 bg-ink/55" />
        <div className="absolute inset-0 mx-auto flex max-w-6xl items-end px-4 pb-10 sm:px-6">
          <h1 className="font-display text-4xl font-semibold text-ink-fg sm:text-5xl">
            Toko daging beku di Tangkil Tengah
          </h1>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-2">
        <div>
          <p className="text-sm leading-relaxed text-fg">
            Tangkil Frozen melayani keluarga di Kedungwuni dan Pekalongan yang ingin stok daging
            halal tanpa antre di pasar. Semua potongan divakum, dibekukan, dan dikirim dengan ice
            pack — bukan daging cair yang dikemas ulang.
          </p>
          <ul className="mt-8 space-y-5">
            <li className="flex gap-3">
              <BadgeCheck className="mt-0.5 size-5 text-primary" />
              <span>
                <strong className="font-medium">Halal MUI / BPJPH.</strong>
                <span className="block text-sm text-muted">
                  Olahan (sosis, bakso, nugget, patty) ber-nomor BPOM di kemasan.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Snowflake className="mt-0.5 size-5 text-primary" />
              <span>
                <strong className="font-medium">Cold chain.</strong>
                <span className="block text-sm text-muted">
                  Freezer toko −18°C, packing styrofoam + ice gel untuk luar kota.
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <Truck className="mt-0.5 size-5 text-primary" />
              <span>
                <strong className="font-medium">Kurir instan.</strong>
                <span className="block text-sm text-muted">
                  GoSend, GrabExpress, Paxel. Estimasi ongkir di halaman checkout.
                </span>
              </span>
            </li>
          </ul>
        </div>
        <div className="rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)] sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Kunjungi</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Alamat toko</h2>
          <p className="mt-4 flex gap-2 text-sm">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            {SITE.address}
          </p>
          <p className="mt-3 flex gap-2 text-sm">
            <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
            {SITE.wa}
          </p>
          <p className="mt-4 text-sm text-muted">
            Ambil sendiri atau titip kurir instan. Chat dulu untuk pastikan stok slice dan iga.
          </p>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button asChild variant="wa">
              <a href={waLink("Halo, saya mau tanya stok dan jam ambil di toko.")} target="_blank" rel="noreferrer">
                WhatsApp admin
              </a>
            </Button>
            <Button asChild variant="outline">
              <a href={maps} target="_blank" rel="noreferrer">
                Buka peta
              </a>
            </Button>
            <Button asChild variant="soft">
              <Link to="/kasir">Buka kasir toko</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
