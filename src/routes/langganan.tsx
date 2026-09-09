import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { subscriptions } from "@/lib/catalog";
import { formatRupiah } from "@/lib/format";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/langganan")({
  component: LanggananPage,
});

function LanggananPage() {
  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src="/images/bundle-monthly.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-ink/70" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
            Subscription box
          </p>
          <h1 className="mt-3 max-w-xl font-display text-4xl font-semibold text-ink-fg sm:text-5xl">
            Daging datang rutin, harga lebih rapi.
          </h1>
          <p className="mt-4 max-w-lg text-ink-muted">
            Isi rotasi tiap periode. Jeda, ganti isi, atau berhenti kapan saja lewat WhatsApp — tanpa kontrak.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-5 px-4 py-14 sm:px-6 md:grid-cols-3">
        {subscriptions.map((plan) => (
          <article
            key={plan.id}
            className="flex flex-col rounded-2xl bg-surface p-6 shadow-[var(--shadow-border)]"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
              {plan.cadence}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">{plan.name}</h2>
            <p className="mt-2 text-sm text-muted">{plan.blurb}</p>
            <p className="mt-4 font-display text-4xl font-semibold tabular-nums text-primary">
              {formatRupiah(plan.price)}
            </p>
            <p className="text-sm text-subtle line-through">{formatRupiah(plan.originalPrice)}</p>
            <p className="mt-1 text-sm text-muted">{plan.weightLabel} per pengiriman</p>
            <ul className="mt-5 flex-1 space-y-2 text-sm">
              {plan.contents.map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-success" />
                  {line}
                </li>
              ))}
            </ul>
            <Button asChild className="mt-6 w-full" variant={plan.id === "bulanan" ? "default" : "outline"}>
              <a
                href={waLink(
                  `Halo, saya ingin berlangganan ${plan.name} (${plan.cadence}) seharga ${formatRupiah(plan.price)}. Mohon info jadwal kirim pertama.`,
                )}
                target="_blank"
                rel="noreferrer"
              >
                Mulai via WhatsApp
              </a>
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
