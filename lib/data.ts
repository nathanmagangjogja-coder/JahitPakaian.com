export interface Service {
  id: string;
  name: string;
  description: string;
  duration: string;
  /** Slug kategori bebas (mis. "seragam", "kaos"). Admin boleh membuat kategori baru. */
  category: string;
  icon: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
}

export const categories: Category[] = [
  { id: "seragam", icon: "graduation-cap", name: "Seragam", description: "Seragam sekolah, kantor, dan lapangan sesuai ukuran dan logo." },
  { id: "kaos", icon: "shirt", name: "Kaos & Polo", description: "Kaos dan polo shirt custom untuk komunitas, kantor, atau acara." },
  { id: "kemeja", icon: "shirt", name: "Kemeja", description: "Kemeja custom dijahit sesuai ukuran badan dan model pilihan." },
  { id: "jaket", icon: "shirt", name: "Jaket & Hoodie", description: "Jaket, hoodie, dan sweater custom dengan pilihan bahan dan desain." },
  { id: "jas", icon: "briefcase-business", name: "Jas & Blazer", description: "Jas dan blazer dijahit sesuai ukuran untuk tampilan formal." },
  { id: "celana", icon: "scissors", name: "Celana", description: "Celana custom dijahit sesuai ukuran dan model pilihan." },
  { id: "sablon", icon: "printer", name: "Sablon", description: "Sablon desain pada kaos atau bahan milik Anda." },
  { id: "bordir", icon: "pen-tool", name: "Bordir", description: "Bordir logo atau tulisan dengan hasil rapi dan awet." },
  { id: "merchandise", icon: "shopping-bag", name: "Merchandise", description: "Merchandise custom untuk brand atau acara Anda." },
  { id: "grosir", icon: "boxes", name: "Produksi Massal / Grosir", description: "Produksi pakaian dalam jumlah besar untuk kebutuhan bisnis." },
  { id: "desain", icon: "palette", name: "Custom Design & Sample", description: "Konsultasi desain dan pembuatan sampel sebelum produksi." },
];

/** "kaos-polo" -> "Kaos Polo" (nama cadangan untuk kategori yang dibuat admin sendiri). */
export function categoryTitle(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Info kategori; kalau belum terdaftar di daftar di atas, nama dibuat dari slug-nya. */
export function getCategory(id: string): Category {
  return categories.find((c) => c.id === id) ?? { id, name: categoryTitle(id), description: "" };
}

/** Urutan kategori untuk ditampilkan: yang terdaftar dulu (sesuai urutan di atas), lalu sisanya A-Z. */
export function orderCategoryIds(ids: string[]): string[] {
  const unique = Array.from(new Set(ids));
  const known = categories.map((c) => c.id).filter((id) => unique.includes(id));
  const extra = unique.filter((id) => !categories.some((c) => c.id === id)).sort();
  return [...known, ...extra];
}

export const services: Service[] = [
  { id: "bordir-custom", name: "Bordir Custom", description: "Bordir logo atau tulisan dengan hasil rapi dan awet.", duration: "2-5 hari", category: "bordir", icon: "pen-tool" },
  { id: "celana-custom", name: "Celana Custom", description: "Celana custom dijahit sesuai ukuran dan model pilihan.", duration: "3-5 hari", category: "celana", icon: "scissors" },
  { id: "desain-custom-sample", name: "Custom Design & Sample", description: "Konsultasi desain custom dan pembuatan sampel sebelum produksi.", duration: "3-7 hari", category: "desain", icon: "palette" },
  { id: "grosir-produksi-massal", name: "Produksi Massal / Grosir", description: "Produksi pakaian dalam jumlah besar dengan harga grosir.", duration: "14-30 hari", category: "grosir", icon: "boxes" },
  { id: "jaket-custom", name: "Jaket Custom", description: "Jaket custom dengan pilihan bahan, warna, dan desain.", duration: "7-14 hari", category: "jaket", icon: "shirt" },
  { id: "jaket-hoodie-sweater", name: "Hoodie & Sweater", description: "Hoodie dan sweater custom dengan bahan nyaman.", duration: "7-14 hari", category: "jaket", icon: "shirt" },
  { id: "jas-blazer", name: "Jas & Blazer", description: "Jas dan blazer dijahit sesuai ukuran untuk tampilan formal.", duration: "10-14 hari", category: "jas", icon: "briefcase-business" },
  { id: "kaos-custom", name: "Kaos Custom", description: "Kaos custom dengan desain, warna, dan ukuran sesuai keinginan Anda.", duration: "3-7 hari", category: "kaos", icon: "shirt" },
  { id: "kaos-polo-shirt", name: "Polo Shirt", description: "Polo shirt custom untuk komunitas, kantor, atau acara.", duration: "3-7 hari", category: "kaos", icon: "shirt" },
  { id: "kemeja-custom", name: "Kemeja Custom", description: "Kemeja custom dijahit sesuai ukuran badan dan model pilihan.", duration: "5-10 hari", category: "kemeja", icon: "shirt" },
  { id: "merchandise-custom", name: "Merchandise", description: "Pembuatan merchandise custom untuk brand atau acara Anda.", duration: "5-10 hari", category: "merchandise", icon: "shopping-bag" },
  { id: "sablon-custom", name: "Sablon Custom", description: "Sablon desain pada kaos atau bahan milik Anda.", duration: "2-5 hari", category: "sablon", icon: "printer" },
  { id: "seragam-perusahaan", name: "Seragam Perusahaan", description: "Pembuatan seragam kerja custom untuk perusahaan, lengkap dengan logo dan ukuran sesuai karyawan.", duration: "7-14 hari", category: "seragam", icon: "shirt" },
  { id: "seragam-sekolah", name: "Seragam Sekolah", description: "Pembuatan seragam sekolah sesuai ukuran dan model yang diinginkan.", duration: "7-14 hari", category: "seragam", icon: "graduation-cap" },
  { id: "seragam-wearpack", name: "Wearpack / Seragam Kerja", description: "Wearpack dan seragam kerja lapangan dengan bahan kuat dan nyaman.", duration: "7-14 hari", category: "seragam", icon: "hard-hat" },
];

export interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const faqItems: FAQItem[] = [
  {
    question: "Berapa minimal jumlah pesanan untuk jahit konveksi?",
    answer: "Minimal order bervariasi: untuk kaos sablon minimal 12 pcs, seragam kantor minimal 24 set, produksi massal/grosir minimal 50 pcs per model. Konsultasikan kebutuhanmu lewat WhatsApp untuk info lebih lanjut.",
    category: "grosir",
  },
  {
    question: "Apakah bisa membuat desain atau model custom sendiri?",
    answer: "Tentu. Kami menerima model custom sesuai referensi foto, sketsa, atau moodboard yang kamu berikan. Untuk hasil presisi, diawali dengan pembuatan sampel terlebih dahulu sebelum produksi massal.",
    category: "desain",
  },
  {
    question: "Berapa lama estimasi pengerjaan seragam perusahaan?",
    answer: "Untuk 50-100 set seragam kantor, rata-rata 7-14 hari kerja tergantung kompleksitas model dan jumlah bordir logo. Untuk urgent bisa dikoordinasikan via WhatsApp.",
    category: "seragam",
  },
  {
    question: "Apakah sablon dan bordir tahan lama saat dicuci?",
    answer: "Kami menggunakan tinta sablon berkualitas industri dengan proses curing panas, serta benang bordir polyester premium. Keduanya dijamin awet dan tidak mudah luntur/rontok meski rutin dicuci.",
    category: "sablon",
  },
  {
    question: "Apakah tersedia layanan pengiriman ke luar kota?",
    answer: "Ya. Kami melayani pengiriman ke seluruh Indonesia via JNE, J&T, SiCepat, ekspedisi kargo, dll. Ongkir ditanggung pemesan. Untuk pesanan besar bisa diatur pengiriman trucking sendiri.",
    category: "pengiriman",
  },
  {
    question: "Bagaimana kalau hasil produksi tidak sesuai sampel?",
    answer: "Kami selalu membuat sample acuan yang disetujui dulu sebelum massal. Jika ditemukan ketidaksesuaian jahitan, ukuran, atau cetak logo dari sisi kami, kami perbaiki atau ganti ulang secara gratis.",
    category: "grosir",
  },
];