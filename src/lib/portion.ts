export type EventKind = "harian" | "shabu" | "bbq" | "hajatan" | "rendang";

export const eventKinds: { id: EventKind; label: string; gramsPerPerson: number; hint: string }[] =
  [
    { id: "harian", label: "Masak harian", gramsPerPerson: 150, hint: "Lauk keluarga, 1 menu" },
    { id: "shabu", label: "Shabu / suki", gramsPerPerson: 200, hint: "Irisan tipis + kuah" },
    { id: "bbq", label: "BBQ / bakar", gramsPerPerson: 280, hint: "Grill, lapar lebih besar" },
    { id: "hajatan", label: "Hajatan / tasyakuran", gramsPerPerson: 180, hint: "Banyak lauk pendamping" },
    { id: "rendang", label: "Rendang pesta", gramsPerPerson: 200, hint: "Susut saat dimasak lama" },
  ];

export function recommendGrams(kind: EventKind, people: number) {
  const spec = eventKinds.find((e) => e.id === kind) ?? eventKinds[0];
  const grams = spec.gramsPerPerson * Math.max(1, people);
  const kg = Math.ceil((grams / 1000) * 10) / 10;
  return { grams, kg, perPerson: spec.gramsPerPerson, label: spec.label };
}

export const eventProductMap: Record<EventKind, string[]> = {
  harian: ["ayam-fillet", "sapi-semur", "bakso-sapi", "ayam-paha"],
  shabu: ["sapi-shabu", "wagyu-slice", "bumbu-yakiniku"],
  bbq: ["paket-bbq-weekend", "sapi-iga", "sosis-sapi", "burger-patty", "bumbu-bbq"],
  hajatan: ["paket-stok-bulanan", "sapi-rendang", "kambing-kubus", "ayam-utuh"],
  rendang: ["sapi-rendang", "bumbu-rendang", "sapi-semur"],
};
