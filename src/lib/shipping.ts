export type CourierId = "gosend" | "grab" | "paxel" | "jne";

export type Courier = {
  id: CourierId;
  name: string;
  kind: string;
  note: string;
};

export const couriers: Courier[] = [
  {
    id: "gosend",
    name: "GoSend Instant",
    kind: "Instan / sameday",
    note: "Tas pendingin, jemput toko. Area Pekalongan.",
  },
  {
    id: "grab",
    name: "GrabExpress Sameday",
    kind: "Sameday",
    note: "Kurir motor, ice pack dari toko.",
  },
  {
    id: "paxel",
    name: "Paxel Big",
    kind: "Same day / next day",
    note: "Layanan pendingin, kota besar Jawa.",
  },
  {
    id: "jne",
    name: "JNE YES + ice pack",
    kind: "1–2 hari",
    note: "Luar kota, dikemas styrofoam + ice gel.",
  },
];

export type ShippingQuote = {
  zone: string;
  eta: string;
  fee: number;
  freeOver?: number;
  available: CourierId[];
  coldNote: string;
};

const FREE_LOCAL = 300000;

export function quoteShipping(city: string, subtotal: number): ShippingQuote {
  const c = city.trim().toLowerCase();

  if (!c) {
    return {
      zone: "Isi kota tujuan",
      eta: "—",
      fee: 0,
      available: [],
      coldNote: "Produk dikirim beku. Pilih kurir instan agar tidak mencair.",
    };
  }

  if (
    /kedungwuni|pekalongan|buaran|wiradesa|tirto|wonopringgo|siwalan|karanganyar|doro|kesesi|sragi/.test(
      c,
    )
  ) {
    const fee = subtotal >= FREE_LOCAL ? 0 : 15000;
    return {
      zone: "Pekalongan & Kedungwuni",
      eta: "1–3 jam (sameday)",
      fee,
      freeOver: FREE_LOCAL,
      available: ["gosend", "grab"],
      coldNote: "GoSend / GrabExpress dengan ice pack. Gratis ongkir belanja di atas Rp 300.000.",
    };
  }

  if (/batang|pemalang|comal|kajen|petarukan|warungasem/.test(c)) {
    return {
      zone: "Sekitar Pekalongan",
      eta: "Hari yang sama, 3–6 jam",
      fee: 25000,
      available: ["grab", "paxel"],
      coldNote: "GrabExpress sameday atau Paxel. Packing styrofoam jika eta > 4 jam.",
    };
  }

  if (
    /semarang|tegal|brebes|purwokerto|magelang|solo|yogyakarta|yogyak|jogja|kendal|ungaran/.test(
      c,
    )
  ) {
    return {
      zone: "Jawa Tengah",
      eta: "Sameday / next day",
      fee: 35000,
      available: ["paxel", "jne"],
      coldNote: "Paxel Big recommended. Ice gel ganda + kardus berinsulasi.",
    };
  }

  if (
    /jakarta|bekasi|depok|tangerang|bandung|surabaya|malang|cirebon|bogor/.test(c)
  ) {
    return {
      zone: "Pulau Jawa",
      eta: "1–2 hari",
      fee: 45000,
      available: ["paxel", "jne"],
      coldNote: "Hanya kurir yang menerima frozen. Jangan pilih reguler tanpa ice pack.",
    };
  }

  return {
    zone: "Luar Jawa",
    eta: "2–4 hari",
    fee: 65000,
    available: ["jne"],
    coldNote:
      "Dikirim JNE YES + styrofoam + ice gel. Disarankan belanja ≥ 2 kg agar suhu lebih stabil.",
  };
}

export type PaymentId = "qris" | "bca" | "mandiri" | "va" | "gopay" | "ovo" | "dana";

export type PaymentMethod = {
  id: PaymentId;
  name: string;
  detail: string;
};

export const payments: PaymentMethod[] = [
  { id: "qris", name: "QRIS", detail: "QR dikirim admin di WhatsApp setelah pesanan" },
  { id: "bca", name: "Transfer BCA", detail: "Nomor rekening BCA dikonfirmasi admin" },
  { id: "mandiri", name: "Transfer Mandiri", detail: "Nomor rekening Mandiri dikonfirmasi admin" },
  { id: "va", name: "Virtual Account", detail: "VA BCA / Mandiri / BRI terbit setelah konfirmasi" },
  { id: "gopay", name: "GoPay", detail: "Bayar ke nomor toko 0852-2927-6242" },
  { id: "ovo", name: "OVO", detail: "Transfer OVO ke 0852-2927-6242" },
  { id: "dana", name: "DANA", detail: "Transfer DANA ke 0852-2927-6242" },
];
