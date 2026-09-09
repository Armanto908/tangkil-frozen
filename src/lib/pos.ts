import { format, isSameDay, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { SITE } from "@/lib/site";
import { formatRupiah, formatWeight } from "@/lib/format";
import type { PayMethod, PosLine, Sale, Shift } from "@/lib/pos-store";

export const PAY_METHODS: { id: PayMethod; label: string; hint: string }[] = [
  { id: "tunai", label: "Tunai", hint: "Hitung kembalian" },
  { id: "qris", label: "QRIS", hint: "Scan di kasir" },
  { id: "transfer", label: "Transfer", hint: "Bank / e-wallet" },
];

export function payLabel(method: PayMethod) {
  return PAY_METHODS.find((m) => m.id === method)?.label ?? method;
}

export function lineTotal(line: PosLine) {
  return line.unitPrice * line.qty;
}

export function linesSubtotal(lines: PosLine[]) {
  return lines.reduce((n, l) => n + lineTotal(l), 0);
}

export function salesOnDay(sales: Sale[], day: Date) {
  return sales.filter((s) => !s.voided && isSameDay(parseISO(s.createdAt), day));
}

export function formatWhen(iso: string) {
  return format(parseISO(iso), "d MMM yyyy · HH.mm", { locale: localeId });
}

export function formatClock(date: Date) {
  return format(date, "HH.mm");
}

export function formatLongDate(date: Date) {
  return format(date, "EEEE, d MMMM yyyy", { locale: localeId });
}

export function cashSuggestions(total: number) {
  const out = new Set<number>([total]);
  for (const step of [10000, 20000, 50000, 100000]) {
    const up = Math.ceil(total / step) * step;
    if (up >= total) out.add(up);
  }
  for (const n of [20000, 50000, 100000, 150000, 200000]) {
    if (n >= total) out.add(n);
  }
  return [...out].sort((a, b) => a - b).slice(0, 6);
}

export function expectedCash(sales: Sale[], shift: Shift | null) {
  const opening = shift?.openingCash ?? 0;
  const tunai = sales
    .filter((s) => !s.voided && s.method === "tunai")
    .reduce((n, s) => n + s.total, 0);
  return opening + tunai;
}

export function receiptText(sale: Sale) {
  const lines = [
    SITE.name.toUpperCase(),
    SITE.address,
    `WA ${SITE.wa}`,
    "------------------------------",
    sale.id,
    formatWhen(sale.createdAt),
    "------------------------------",
    ...sale.items.map((item) => {
      const w = item.weightGrams ? ` ${formatWeight(item.weightGrams)}` : "";
      return `${item.qty}x ${item.name}${w}\n   ${formatRupiah(lineTotal(item))}`;
    }),
    "------------------------------",
    `Subtotal  ${formatRupiah(sale.subtotal)}`,
  ];
  if (sale.discount > 0) lines.push(`Diskon    -${formatRupiah(sale.discount)}`);
  lines.push(`TOTAL     ${formatRupiah(sale.total)}`);
  lines.push(`Bayar     ${payLabel(sale.method)}`);
  if (sale.method === "tunai" && sale.cashReceived != null) {
    lines.push(`Diterima  ${formatRupiah(sale.cashReceived)}`);
    lines.push(`Kembali   ${formatRupiah(sale.change ?? 0)}`);
  }
  if (sale.customerName) lines.push(`Pelanggan ${sale.customerName}`);
  if (sale.note) lines.push(sale.note);
  lines.push("------------------------------");
  lines.push("Terima kasih. Simpan beku −18°C.");
  return lines.join("\n");
}

export function printSale(sale: Sale) {
  const html = `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8"/>
  <title>Struk ${sale.id}</title>
  <style>
    body { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; color: #1a1214; margin: 16px; }
    h1 { font-size: 14px; margin: 0 0 4px; }
    p, pre { margin: 0; white-space: pre-wrap; }
    .muted { color: #6e5e62; }
  </style>
</head>
<body>
  <h1>${SITE.name}</h1>
  <p class="muted">${SITE.address}</p>
  <pre>${receiptText(sale)}</pre>
  <script>window.onload = () => { window.print(); };</script>
</body>
</html>`;
  const w = window.open("", "struk", "width=380,height=640");
  if (!w) return;
  w.document.write(html);
  w.document.close();
  w.focus();
}
