export type CategoryId = "sapi" | "ayam" | "kambing" | "olahan" | "bumbu";

export type PackingOption = {
  id: string;
  label: string;
  note?: string;
};

export type WeightOption = {
  grams: number;
  price: number;
  originalPrice?: number;
};

export type Product = {
  slug: string;
  name: string;
  category: CategoryId;
  tagline: string;
  description: string;
  image: string;
  cookedImage?: string;
  weights: WeightOption[];
  packing: PackingOption[];
  storage: string;
  serving: string;
  recipe: { title: string; steps: string[] };
  badges: string[];
  bpom?: string;
  expiryNote: string;
  featured?: boolean;
  isBundle?: boolean;
  bundleContents?: string[];
};

export type Category = {
  id: CategoryId;
  name: string;
  blurb: string;
  image: string;
};

const PACK_BEEF: PackingOption[] = [
  { id: "vakum-utuh", label: "Vakum utuh", note: "1 pack utuh sesuai berat" },
  { id: "bagi-2", label: "Dibagi 2 vakum", note: "Praktis untuk 2 kali masak" },
  { id: "potong-kecil", label: "Potong kecil", note: "Siap untuk sup / tumis" },
];

const PACK_SLICE: PackingOption[] = [
  { id: "vakum-utuh", label: "Vakum utuh", note: "Slice utuh dalam 1 pack" },
  { id: "bagi-2", label: "Dibagi 2 vakum", note: "Porsi lebih kecil" },
];

const PACK_READY: PackingOption[] = [
  { id: "vakum-utuh", label: "Vakum utuh", note: "Kemasan pabrik / vakum toko" },
];

export const categories: Category[] = [
  {
    id: "sapi",
    name: "Daging Sapi",
    blurb: "Slice shabu, rendang, semur, iga, dan tenderloin.",
    image: "/images/wagyu.jpg",
  },
  {
    id: "ayam",
    name: "Ayam & Unggas",
    blurb: "Fillet dada, paha, dan ayam utuh vakum.",
    image: "/images/fillet-ayam.jpg",
  },
  {
    id: "kambing",
    name: "Kambing & Domba",
    blurb: "Slice sate dan kubus gulai, tanpa bau menyengat.",
    image: "/images/kambing-slice.jpg",
  },
  {
    id: "olahan",
    name: "Olahan Daging",
    blurb: "Sosis, bakso, nugget, dan burger patty.",
    image: "/images/sosis.jpg",
  },
  {
    id: "bumbu",
    name: "Bumbu Marinasi",
    blurb: "Rendang, BBQ, dan yakiniku siap masak.",
    image: "/images/bumbu-set.jpg",
  },
];

export const products: Product[] = [
  {
    slug: "wagyu-slice",
    name: "Wagyu Slice Premium",
    category: "sapi",
    tagline: "Marbeling tebal, meleleh di lidah",
    description:
      "Irisan tipis daging sapi bermarbel tinggi, dikemas vakum dalam rantai dingin. Cocok untuk yakiniku, shabu-shabu, atau sukiyaki tanpa perlu mengiris sendiri.",
    image: "/images/wagyu.jpg",
    cookedImage: "/images/cooked-yakiniku.jpg",
    weights: [
      { grams: 250, price: 89000 },
      { grams: 500, price: 169000, originalPrice: 178000 },
    ],
    packing: PACK_SLICE,
    storage: "Simpan di freezer −18°C. Setelah dibuka, masak dalam 24 jam atau bekukan kembali dalam vakum. Jangan di-refreeze jika sudah mencair penuh.",
    serving: "Cocok untuk yakiniku, suki, atau shabu. 250 gram cukup untuk 2 porsi lauk.",
    recipe: {
      title: "Yakiniku rumahan 10 menit",
      steps: [
        "Cairkan pack di kulkas semalaman, atau rendam tertutup di air dingin 20 menit.",
        "Panaskan wajan besi hingga sangat panas, oles tipis minyak wijen.",
        "Panggang slice 20–30 detik per sisi, sapu saus yakiniku, sajikan dengan daun bawang.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Cold chain"],
    expiryNote: "Baik digunakan 6 bulan sejak pengemasan jika tetap beku.",
    featured: true,
  },
  {
    slug: "sapi-shabu",
    name: "Sapi Slice Shabu-Shabu",
    category: "sapi",
    tagline: "Tipis merata, cepat matang di kuah",
    description:
      "Daging sapi irisan mesin ketebalan shabu, warna merah segar, lemak tipis di tepi. Siap celup steamboat tanpa potong ulang.",
    image: "/images/shabu.jpg",
    cookedImage: "/images/lifestyle-shabu.jpg",
    weights: [
      { grams: 250, price: 38000 },
      { grams: 500, price: 72000 },
      { grams: 1000, price: 138000, originalPrice: 144000 },
    ],
    packing: PACK_SLICE,
    storage: "Bekukan di freezer. Untuk steamboat, cairkan di kulkas 4–6 jam agar slice tidak pecah.",
    serving: "200 gram per orang untuk shabu-shabu. Pasangkan dengan sawi, jamur, dan bihun.",
    recipe: {
      title: "Kuah shabu rumahan",
      steps: [
        "Rebus kaldu ayam, jahe, dan daun bawang 15 menit.",
        "Celup slice 5–8 detik hingga berubah warna.",
        "Saus celup: kecap, wijen, irisan cabai, dan air jeruk nipis.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Cold chain"],
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "sapi-rendang",
    name: "Daging Rendang",
    category: "sapi",
    tagline: "Kubus seragam, empuk setelah dimasak lama",
    description:
      "Potongan daging sapi bagian has dalam / sandung lamur, dikubus 3–4 cm untuk rendang, kalio, atau semur Padang. Lemak cukup agar bumbu meresap.",
    image: "/images/rendang.jpg",
    cookedImage: "/images/cooked-rendang.jpg",
    weights: [
      { grams: 500, price: 58000 },
      { grams: 1000, price: 110000, originalPrice: 116000 },
    ],
    packing: PACK_BEEF,
    storage: "Simpan beku. Cairkan di kulkas semalaman sebelum ditumis bumbu.",
    serving: "500 gram untuk 4–5 porsi rendang. 1 kg untuk hajatan kecil 8–10 porsi.",
    recipe: {
      title: "Rendang santan kental",
      steps: [
        "Tumis bumbu rendang Tangkil hingga harum, masukkan daging beku yang sudah dicairkan.",
        "Tuang santan, masak api kecil 2–3 jam hingga kering dan berwarna gelap.",
        "Koreksi garam di akhir. Diamkan semalaman — makin sedap keesokan hari.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Cold chain"],
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "sapi-semur",
    name: "Daging Semur",
    category: "sapi",
    tagline: "Potongan sedang, cepat empuk",
    description:
      "Daging sapi potong dadu sedang khusus semur, tongseng, atau tumis kecap. Serat lebih lembut dari rendang, matang lebih cepat.",
    image: "/images/semur.jpg",
    cookedImage: "/images/family-table.jpg",
    weights: [
      { grams: 500, price: 54000 },
      { grams: 1000, price: 102000 },
    ],
    packing: PACK_BEEF,
    storage: "Bekukan. Cairkan di kulkas, jangan di suhu ruang lebih dari 1 jam.",
    serving: "Cocok untuk semur kentang, tongseng, atau tumis buncis. 150 gram per porsi.",
    recipe: {
      title: "Semur kentang 40 menit",
      steps: [
        "Tumis bawang, pala, dan kecap manis.",
        "Masukkan daging, aduk hingga berubah warna, tuang air secukupnya.",
        "Tambah kentang, masak hingga empuk dan kuah mengental.",
      ],
    },
    badges: ["Halal MUI", "Vakum"],
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
  },
  {
    slug: "sapi-iga",
    name: "Iga Sapi / Short Ribs",
    category: "sapi",
    tagline: "Tulang berdaging, kuah kaldu kaya",
    description:
      "Iga sapi berdaging, dipotong per tulang, vakum. Siap untuk sop iga, iga bakar, atau konro. Marbling di sela tulang membuat kuah gurih.",
    image: "/images/iga.jpg",
    cookedImage: "/images/cooked-bbq.jpg",
    weights: [
      { grams: 500, price: 72000 },
      { grams: 1000, price: 138000 },
    ],
    packing: [
      { id: "vakum-utuh", label: "Vakum utuh", note: "Potongan per tulang" },
      { id: "bagi-2", label: "Dibagi 2 vakum", note: "Mudah diambil bertahap" },
    ],
    storage: "Simpan freezer. Rebus dari beku diperbolehkan untuk sop — tambah 15 menit waktu masak.",
    serving: "500 gram untuk sop 3–4 orang. 1 kg untuk iga bakar rombongan.",
    recipe: {
      title: "Sop iga bening",
      steps: [
        "Rebus iga, buang air pertama. Rebus ulang dengan pala, cengkeh, dan daun bawang.",
        "Masak 1,5–2 jam hingga daging lepas tulang.",
        "Sajikan dengan kentang, wortel, seledri, dan sambal kecap.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Cold chain"],
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "sapi-tenderloin",
    name: "Tenderloin Sapi",
    category: "sapi",
    tagline: "Has dalam, steak rumahan",
    description:
      "Has dalam (tenderloin) utuh, vakum. Lembut, rendah serat, ideal untuk steak, medallion, atau roast pendek.",
    image: "/images/tenderloin.jpg",
    cookedImage: "/images/cooked-yakiniku.jpg",
    weights: [
      { grams: 500, price: 95000 },
      { grams: 1000, price: 185000 },
    ],
    packing: [
      { id: "vakum-utuh", label: "Vakum utuh", note: "Satu muscle utuh" },
      { id: "steak-2cm", label: "Dipotong steak 2 cm", note: "Siap pan-sear" },
      { id: "medallion", label: "Medallion", note: "Potongan bulat porsi" },
    ],
    storage: "Bekukan. Cairkan lambat di kulkas 12 jam sebelum dimasak agar merata.",
    serving: "200–250 gram per porsi steak. 500 gram untuk 2 orang.",
    recipe: {
      title: "Steak lada hitam",
      steps: [
        "Keringkan permukaan, garam kasar, lada hitam.",
        "Sear wajan 2 menit per sisi untuk medium-rare pada irisan 2 cm.",
        "Istirahatkan 5 menit, saus lada hitam di wajan yang sama.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Pilihan chef"],
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
  },
  {
    slug: "ayam-fillet",
    name: "Fillet Dada Ayam",
    category: "ayam",
    tagline: "Tanpa tulang, tanpa kulit",
    description:
      "Dada ayam fillet bersih, vakum. Siap untuk katsu, tumis, salad protein, atau meal prep mingguan.",
    image: "/images/fillet-ayam.jpg",
    cookedImage: "/images/cooked-ayam.jpg",
    weights: [
      { grams: 500, price: 42000 },
      { grams: 1000, price: 79000, originalPrice: 84000 },
    ],
    packing: PACK_BEEF,
    storage: "Bekukan. Setelah cair, masak dalam 24 jam. Jangan refreeze jika sudah mencair.",
    serving: "150 gram per porsi. 1 kg cukup meal prep 6–7 porsi.",
    recipe: {
      title: "Ayam lada garam",
      steps: [
        "Potong dadu, marinasi 10 menit dengan lada, garam, dan sedikit minyak wijen.",
        "Tumis api besar hingga matang merata.",
        "Sajikan dengan broccoli atau paprika.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Higienis"],
    expiryNote: "Baik digunakan 4 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "ayam-paha",
    name: "Paha Ayam",
    category: "ayam",
    tagline: "Berlemak pas, juicier saat dipanggang",
    description:
      "Paha ayam dengan kulit, vakum. Lebih juicy dari dada — ideal goreng, bakar madu, atau opor.",
    image: "/images/paha.jpg",
    cookedImage: "/images/cooked-ayam.jpg",
    weights: [
      { grams: 500, price: 35000 },
      { grams: 1000, price: 65000 },
    ],
    packing: PACK_BEEF,
    storage: "Simpan freezer. Goreng dari hampir beku diperbolehkan — api sedang agar matang dalam.",
    serving: "2–3 potong per orang. 1 kg untuk 4–5 porsi.",
    recipe: {
      title: "Ayam bakar madu",
      steps: [
        "Marinasi kecap, bawang putih, madu, dan jeruk nipis 30 menit.",
        "Panggang atau air-fryer 200°C selama 22–25 menit.",
        "Oles sisa marinasi di menit terakhir.",
      ],
    },
    badges: ["Halal MUI", "Vakum"],
    expiryNote: "Baik digunakan 4 bulan dalam freezer.",
  },
  {
    slug: "ayam-utuh",
    name: "Ayam Utuh",
    category: "ayam",
    tagline: "Satu ekor, siap oven atau opor",
    description:
      "Ayam kampung-style broiler utuh, dibersihkan, vakum. Berat sekitar 0,9–1,1 kg per ekor. Siap oven, bakar, atau kuah.",
    image: "/images/ayam-utuh.jpg",
    cookedImage: "/images/cooked-ayam.jpg",
    weights: [{ grams: 1000, price: 48000 }],
    packing: [
      { id: "vakum-utuh", label: "Utuh vakum", note: "1 ekor utuh" },
      { id: "potong-8", label: "Dipotong 8", note: "Siap opor / goreng" },
    ],
    storage: "Bekukan. Cairkan di kulkas 12–18 jam sebelum dioven.",
    serving: "1 ekor untuk 3–4 orang dengan nasi dan sayur.",
    recipe: {
      title: "Ayam oven herbal",
      steps: [
        "Balur garam, lemon, rosemary, dan bawang putih di bawah kulit.",
        "Oven 190°C selama 55–65 menit hingga kulit keemasan.",
        "Istirahatkan 10 menit sebelum diiris.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Higienis"],
    expiryNote: "Baik digunakan 4 bulan dalam freezer.",
  },
  {
    slug: "kambing-slice",
    name: "Kambing Slice",
    category: "kambing",
    tagline: "Tipis untuk sate dan tongseng cepat",
    description:
      "Daging kambing irisan tipis, dipilih dari bagian has, aroma lebih bersih. Siap sate, tongseng, atau krengsengan.",
    image: "/images/kambing-slice.jpg",
    cookedImage: "/images/cooked-sate.jpg",
    weights: [
      { grams: 250, price: 42000 },
      { grams: 500, price: 78000 },
    ],
    packing: PACK_SLICE,
    storage: "Bekukan. Cairkan di kulkas. Cuci cepat, keringkan sebelum ditusuk sate.",
    serving: "250 gram untuk 2 porsi sate (sekitar 10 tusuk).",
    recipe: {
      title: "Sate kambing bumbu kecap",
      steps: [
        "Tusuk slice, oles kecap, bawang putih, dan jeruk nipis.",
        "Bakar bara atau grill pan 2 menit per sisi.",
        "Sajikan dengan bawang merah iris dan sambal kecap.",
      ],
    },
    badges: ["Halal MUI", "Vakum", "Aroma bersih"],
    expiryNote: "Baik digunakan 5 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "kambing-kubus",
    name: "Kambing Kubus Gulai",
    category: "kambing",
    tagline: "Untuk gulai, tengkleng, dan tongseng",
    description:
      "Daging kambing potong dadu, campuran has dan sedikit lemak agar gulai berempah. Vakum, siap bumbu.",
    image: "/images/kambing-kubus.jpg",
    cookedImage: "/images/cooked-sate.jpg",
    weights: [
      { grams: 500, price: 82000 },
      { grams: 1000, price: 155000 },
    ],
    packing: PACK_BEEF,
    storage: "Simpan freezer. Untuk gulai, bisa langsung masuk kuali dari hampir beku.",
    serving: "500 gram untuk gulai 4 porsi. 1 kg untuk hajatan 8 porsi.",
    recipe: {
      title: "Gulai kambing santan",
      steps: [
        "Tumis bumbu kuning hingga pecah minyak.",
        "Masukkan daging, aduk, tuang santan encer lalu kental.",
        "Masak api kecil 1 jam, tabur daun jeruk.",
      ],
    },
    badges: ["Halal MUI", "Vakum"],
    expiryNote: "Baik digunakan 5 bulan dalam freezer.",
  },
  {
    slug: "sosis-sapi",
    name: "Sosis Sapi",
    category: "olahan",
    tagline: "Juicy, siap bakar atau tumis",
    description:
      "Sosis sapi halal, tekstur padat, rasa gurih. Siap BBQ, sandwich, atau isian nasi goreng. Dikemas vakum.",
    image: "/images/sosis.jpg",
    cookedImage: "/images/cooked-bbq.jpg",
    weights: [{ grams: 500, price: 38000 }],
    packing: PACK_READY,
    storage: "Bekukan. Setelah dibuka, habiskan dalam 3 hari di kulkas.",
    serving: "Cocok untuk BBQ weekend, bekal anak, atau sarapan. 100 gram per porsi.",
    recipe: {
      title: "Sosis bakar madu",
      steps: [
        "Belah sosis memanjang, oles madu dan kecap.",
        "Panggang 6–8 menit hingga kecokelatan.",
        "Sajikan dengan mustard atau sambal.",
      ],
    },
    badges: ["Halal MUI", "BPOM", "Vakum"],
    bpom: "MD 2273 1230 456",
    expiryNote: "Lihat tanggal pada kemasan, biasanya 9 bulan beku.",
  },
  {
    slug: "bakso-sapi",
    name: "Bakso Sapi Kenyal",
    category: "olahan",
    tagline: "Uratsedikit, kenyal khas warung",
    description:
      "Bakso sapi kenyal dengan sedikit urat, direbus matang lalu dibekukan. Tinggal celup kuah.",
    image: "/images/bakso.jpg",
    cookedImage: "/images/family-table.jpg",
    weights: [{ grams: 500, price: 32000 }],
    packing: PACK_READY,
    storage: "Bekukan. Rebus dari beku 8–10 menit hingga mengapung kembali.",
    serving: "500 gram untuk 3–4 mangkuk bakso. Pasangkan dengan mie dan sambal.",
    recipe: {
      title: "Kuah bakso 15 menit",
      steps: [
        "Rebus tulang atau kaldu instan, masukkan bakso beku.",
        "Tambah daun bawang, seledri, dan merica.",
        "Sajikan dengan mie, tahu, dan sambal.",
      ],
    },
    badges: ["Halal MUI", "BPOM", "Matang"],
    bpom: "MD 2273 1230 457",
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
  },
  {
    slug: "nugget-ayam",
    name: "Nugget Ayam",
    category: "olahan",
    tagline: "Tepung renyah, isi ayam asli",
    description:
      "Nugget ayam berlapis tepung, dibekukan mentah-matang. Goreng atau air-fryer tanpa cairkan.",
    image: "/images/nugget.jpg",
    cookedImage: "/images/cooked-ayam.jpg",
    weights: [{ grams: 500, price: 36000 }],
    packing: PACK_READY,
    storage: "Tetap beku. Jangan cairkan sebelum digoreng agar tepung tetap garing.",
    serving: "Camilan anak, bekal, atau lauk cepat. 150 gram per porsi.",
    recipe: {
      title: "Nugget air-fryer",
      steps: [
        "Air-fryer 180°C selama 12 menit, balik di menit ke-7.",
        "Atau goreng minyak sedang 3–4 menit.",
        "Sajikan dengan saus tomat atau mayo pedas.",
      ],
    },
    badges: ["Halal MUI", "BPOM"],
    bpom: "MD 2273 1230 458",
    expiryNote: "Baik digunakan 9 bulan dalam freezer.",
  },
  {
    slug: "burger-patty",
    name: "Burger Patty Sapi",
    category: "olahan",
    tagline: "100% daging, tanpa filler berlebih",
    description:
      "Patty sapi 100 gram per keping, vakum 4 pcs. Siap smash burger atau BBQ. Tidak hancur saat dibalik.",
    image: "/images/patty.jpg",
    cookedImage: "/images/cooked-bbq.jpg",
    weights: [{ grams: 400, price: 45000 }],
    packing: [
      { id: "vakum-utuh", label: "4 pcs vakum", note: "Dipisah kertas antar patty" },
    ],
    storage: "Bekukan. Masak dari beku di wajan panas — 3 menit per sisi.",
    serving: "1 patty per burger. 4 pcs untuk 4 porsi atau 2 double burger.",
    recipe: {
      title: "Smash burger",
      steps: [
        "Wajan sangat panas, tekan patty 10 detik, garam lada.",
        "Masak 2–3 menit per sisi, keju di menit terakhir.",
        "Roti, selada, tomat, saus BBQ Tangkil.",
      ],
    },
    badges: ["Halal MUI", "BPOM", "100% daging"],
    bpom: "MD 2273 1230 459",
    expiryNote: "Baik digunakan 6 bulan dalam freezer.",
    featured: true,
  },
  {
    slug: "bumbu-rendang",
    name: "Bumbu Rendang Siap Masak",
    category: "bumbu",
    tagline: "Racikan basah, pecah minyak di wajan",
    description:
      "Bumbu rendang basah racikan dapur Tangkil: cabai, lengkuas, serai, ketumbar. Cukup untuk 500 gram–1 kg daging.",
    image: "/images/bumbu-rendang.jpg",
    cookedImage: "/images/cooked-rendang.jpg",
    weights: [{ grams: 200, price: 18000 }],
    packing: PACK_READY,
    storage: "Bekukan atau kulkas 7 hari setelah cair. Jangan simpan di suhu ruang.",
    serving: "1 pack untuk 500 g–1 kg daging. Tambah santan sesuai selera.",
    recipe: {
      title: "Pakai dengan daging rendang",
      steps: [
        "Tumis bumbu hingga pecah minyak dan harum.",
        "Masukkan daging Tangkil, aduk rata.",
        "Tuang santan, masak api kecil hingga kering.",
      ],
    },
    badges: ["Halal MUI", "Tanpa pengawet"],
    expiryNote: "3 bulan beku, 7 hari setelah dicairkan.",
  },
  {
    slug: "bumbu-bbq",
    name: "Saus BBQ",
    category: "bumbu",
    tagline: "Manis-asap, untuk bakar dan olesan",
    description:
      "Saus BBQ kental, rasa smoky-manis, tanpa alkohol. Oles sosis, iga, patty, atau ayam bakar.",
    image: "/images/bumbu-set.jpg",
    cookedImage: "/images/cooked-bbq.jpg",
    weights: [{ grams: 250, price: 16000 }],
    packing: PACK_READY,
    storage: "Kulkas setelah dibuka, habiskan 3 minggu. Boleh dibekukan.",
    serving: "Oles saat 5 menit terakhir memanggang agar tidak gosong.",
    recipe: {
      title: "Iga bakar saus BBQ",
      steps: [
        "Rebus iga 45 menit, keringkan.",
        "Oles saus, panggang 15 menit, oles ulang.",
        "Sajikan dengan jagung bakar.",
      ],
    },
    badges: ["Halal MUI"],
    expiryNote: "12 bulan tertutup, 3 minggu setelah dibuka.",
  },
  {
    slug: "bumbu-yakiniku",
    name: "Marinasi Yakiniku",
    category: "bumbu",
    tagline: "Kecap, wijen, bawang — siap celup",
    description:
      "Saus yakiniku gurih-manis berbasis kecap dan wijen sangrai. Celup slice wagyu atau oles ayam.",
    image: "/images/bumbu-set.jpg",
    cookedImage: "/images/cooked-yakiniku.jpg",
    weights: [{ grams: 200, price: 22000 }],
    packing: PACK_READY,
    storage: "Kulkas setelah dibuka. Kocok sebelum dipakai.",
    serving: "2 sdm per 250 gram slice. Jangan marinasi wagyu terlalu lama — 5 menit cukup.",
    recipe: {
      title: "Celup yakiniku",
      steps: [
        "Panaskan piring besi, panggang slice tanpa bumbu.",
        "Celup ke saus di mangkuk kecil.",
        "Tabur wijen dan daun bawang.",
      ],
    },
    badges: ["Halal MUI"],
    expiryNote: "9 bulan tertutup, 3 minggu setelah dibuka.",
  },
  {
    slug: "paket-bbq-weekend",
    name: "Paket BBQ Weekend",
    category: "olahan",
    tagline: "Slice, sosis, patty, dan saus — siap bakar",
    description:
      "Satu box untuk 4–6 orang: sapi slice 500 g, sosis 500 g, burger patty 4 pcs, dan saus BBQ. Dikemas terpisah vakum, dikirim dalam tas pendingin.",
    image: "/images/bundle-bbq.jpg",
    cookedImage: "/images/cooked-bbq.jpg",
    weights: [{ grams: 1600, price: 199000, originalPrice: 232000 }],
    packing: [{ id: "box", label: "Box bundling", note: "Isi dipisah vakum" }],
    storage: "Bekukan masing-masing pack. Ambil sesuai menu hari itu.",
    serving: "Cukup untuk BBQ 4–6 orang dengan nasi atau roti.",
    recipe: {
      title: "Urutan bakar weekend",
      steps: [
        "Panaskan grill. Sosis dan patty duluan (lebih lama).",
        "Slice dipanggang terakhir 30 detik per sisi.",
        "Oles saus BBQ di 2 menit terakhir.",
      ],
    },
    badges: ["Hemat 14%", "Halal MUI", "Siap kirim"],
    expiryNote: "Ikuti tanggal masing-masing pack di dalam box.",
    featured: true,
    isBundle: true,
    bundleContents: [
      "Sapi slice 500 g",
      "Sosis sapi 500 g",
      "Burger patty 4 pcs",
      "Saus BBQ 250 g",
    ],
  },
  {
    slug: "paket-stok-bulanan",
    name: "Paket Stok Bulanan Rumahan",
    category: "sapi",
    tagline: "Isi freezer sebulan, harga lebih rapi",
    description:
      "Stok lauk sebulan untuk keluarga 3–4 orang: sapi rendang, shabu, ayam fillet, paha, bakso, dan sosis. Semua vakum, tinggal ambil per menu.",
    image: "/images/bundle-monthly.jpg",
    cookedImage: "/images/family-table.jpg",
    weights: [{ grams: 4500, price: 349000, originalPrice: 399000 }],
    packing: [{ id: "box", label: "Krat bulanan", note: "6 pack vakum + ice pack" }],
    storage: "Masukkan ke freezer dalam 15 menit setelah diterima. Susun sesuai kategori.",
    serving: "Perkiraan 12–16 porsi lauk sepanjang bulan, tergantung selera.",
    recipe: {
      title: "Rotasi menu mingguan",
      steps: [
        "Minggu 1–2: shabu dan ayam tumis.",
        "Minggu 3: rendang (masak sekaligus, simpan kulkas 3 hari).",
        "Minggu 4: bakso dan sosis untuk hari sibuk.",
      ],
    },
    badges: ["Hemat 12%", "Halal MUI", "Stok sebulan"],
    expiryNote: "Semua pack berlabel kedaluwarsa masing-masing.",
    featured: true,
    isBundle: true,
    bundleContents: [
      "Daging rendang 1 kg",
      "Sapi slice shabu 500 g",
      "Fillet dada ayam 1 kg",
      "Paha ayam 1 kg",
      "Bakso 500 g",
      "Sosis 500 g",
    ],
  },
];

export type SubscriptionPlan = {
  id: string;
  name: string;
  cadence: string;
  price: number;
  originalPrice: number;
  weightLabel: string;
  blurb: string;
  contents: string[];
};

export const subscriptions: SubscriptionPlan[] = [
  {
    id: "mingguan",
    name: "Kotak Mingguan",
    cadence: "Setiap minggu",
    price: 189000,
    originalPrice: 215000,
    weightLabel: "± 1,5 kg",
    blurb: "Lauk 3–4 masakan seminggu, rotasi sapi dan ayam.",
    contents: ["Sapi slice 500 g", "Ayam fillet 500 g", "Olahan 500 g"],
  },
  {
    id: "bulanan",
    name: "Kotak Bulanan",
    cadence: "Setiap bulan",
    price: 699000,
    originalPrice: 799000,
    weightLabel: "± 6 kg",
    blurb: "Isi freezer sebulan, diskon langganan 12%.",
    contents: [
      "Sapi mix 2,5 kg",
      "Ayam mix 2 kg",
      "Olahan 1 kg",
      "Bumbu 1 pack",
    ],
  },
  {
    id: "bbq",
    name: "Kotak BBQ",
    cadence: "Setiap 2 minggu",
    price: 249000,
    originalPrice: 280000,
    weightLabel: "± 2 kg",
    blurb: "Untuk yang gemar bakar di akhir pekan.",
    contents: ["Slice 500 g", "Iga 500 g", "Sosis + patty", "Saus BBQ"],
  },
];

export type Testimonial = {
  name: string;
  area: string;
  quote: string;
  rating: number;
  image: string;
};

export const testimonials: Testimonial[] = [
  {
    name: "Ibu Rina",
    area: "Buaran, Pekalongan",
    quote:
      "Shabu-nya masih kaku beku pas sampai, padahal sore hari. Packing rapi, tidak bau. Anak-anak minta lagi akhir pekan.",
    rating: 5,
    image: "/images/lifestyle-shabu.jpg",
  },
  {
    name: "Pak Hendra",
    area: "Kedungwuni",
    quote:
      "Paket BBQ Weekend isinya pas untuk 5 orang. Iga dan sosis matang merata, sausnya tidak terlalu manis. Langganan sameday.",
    rating: 5,
    image: "/images/cooked-bbq.jpg",
  },
  {
    name: "Mbak Sinta",
    area: "Wiradesa",
    quote:
      "Rendang 1 kg dimasak Sabtu, masih empuk. Bumbu racikan toko menghemat waktu. Kurir Paxel juga pakai ice pack.",
    rating: 5,
    image: "/images/cooked-rendang.jpg",
  },
];

export function getProduct(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(id: CategoryId) {
  return products.filter((p) => p.category === id);
}

export function getCategory(id: string) {
  return categories.find((c) => c.id === id);
}

export function searchProducts(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return products;
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(s) ||
      p.tagline.toLowerCase().includes(s) ||
      p.category.includes(s),
  );
}

export function lowestPrice(product: Product) {
  return Math.min(...product.weights.map((w) => w.price));
}
