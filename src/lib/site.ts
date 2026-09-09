export const SITE = {
  name: "Tangkil Frozen",
  shortName: "Tangkil",
  tagline: "Daging beku premium, cold chain sampai rumah",
  description:
    "Toko daging beku halal di Kedungwuni, Pekalongan. Sapi, ayam, kambing, olahan, dan bumbu marinasi — dikemas vakum, suhu terjaga, kirim sameday.",
  address: "Jl. Raya Tangkil Tengah No.89, Kedungwuni, Pekalongan",
  city: "Kedungwuni, Pekalongan",
  mapsQuery: "Jl. Raya Tangkil Tengah No.89 Kedungwuni Pekalongan",
  wa: "085229276242",
  waIntl: "6285229276242",
  email: "halo@tangkilfrozen.id",
} as const;

export function waLink(text?: string) {
  const base = `https://wa.me/${SITE.waIntl}`;
  if (!text) return base;
  return `${base}?text=${encodeURIComponent(text)}`;
}
