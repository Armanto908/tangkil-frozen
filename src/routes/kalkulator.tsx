import { createFileRoute } from "@tanstack/react-router";
import { PortionCalculator } from "@/components/portion-calculator";

export const Route = createFileRoute("/kalkulator")({
  component: KalkulatorPage,
});

function KalkulatorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
      <PortionCalculator />
      <p className="mt-6 text-sm text-muted">
        Angka ini acuan dapur rumahan. Untuk hajatan di atas 50 orang, chat admin agar kami bantu takaran rendang dan kambing.
      </p>
    </div>
  );
}
