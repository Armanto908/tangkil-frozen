export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatWeight(grams: number) {
  if (grams >= 1000 && grams % 1000 === 0) return `${grams / 1000} kg`;
  if (grams >= 1000) return `${(grams / 1000).toFixed(1)} kg`;
  return `${grams} gram`;
}

export function formatPhoneDisplay(phone: string) {
  return phone.replace(/(\d{4})(\d{4})(\d+)/, "$1-$2-$3");
}
