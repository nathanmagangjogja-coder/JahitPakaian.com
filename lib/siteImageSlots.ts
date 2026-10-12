/**
 * DAFTAR SLOT GAMBAR WEBSITE (aman dipakai di server maupun client).
 * ------------------------------------------------------------------
 * Gambar sebenarnya disimpan di Supabase:
 *   - tabel   `site_media`  (key, url, label, category)
 *   - bucket  `site-media`  (file hasil upload admin)
 * Admin mengganti foto lewat  /admin/media  — tidak perlu edit kode.
 *
 * File ini hanya mendaftar slot yang dipakai halaman publik, supaya
 * admin selalu melihat semua slot walaupun barisnya belum ada di database.
 */
export interface SiteImageSlot {
  key: string;
  label: string;
  category: string;
}

const CAT_WORKSHOP = "Beranda: Workshop";
const CAT_WORKS = "Beranda: Portofolio";
const CAT_TESTI = "Beranda: Testimoni";
const CAT_GALLERY = "Galeri Hasil Produksi";

const workshop: [string, string][] = [
  ["home_workshop_1", "Menjahit Produksi"],
  ["home_workshop_2", "Memotong Bahan"],
  ["home_workshop_3", "Sablon & Bordir"],
  ["home_workshop_4", "Area Produksi"],
];

const homeWorks: [string, string][] = [
  ["home_work_1", "Seragam Perusahaan"],
  ["home_work_2", "Jaket Custom"],
  ["home_work_3", "Kaos & Polo Custom"],
  ["home_work_4", "Bordir Logo"],
];

const gallery: [string, string][] = [
  ["gallery_1", "Seragam Kantor"],
  ["gallery_2", "Kemeja Batik Korporat"],
  ["gallery_3", "Jaket Bomber"],
  ["gallery_4", "Kaos Event Sablon"],
  ["gallery_5", "Polo Shirt Bordir"],
  ["gallery_6", "Wearpack Proyek"],
  ["gallery_7", "Hoodie Streetwear"],
  ["gallery_8", "Tote Bag Merchandise"],
];

const pair = (prefix: string, base: string, name: string, category: string): SiteImageSlot[] => [
  { key: `${base}_before`, label: `${prefix} - ${name} (Desain)`, category },
  { key: `${base}_after`, label: `${prefix} - ${name} (Hasil)`, category },
];

export const siteImageSlots: SiteImageSlot[] = [
  ...workshop.map(([key, name]) => ({ key, label: `Beranda - Foto Workshop: ${name}`, category: CAT_WORKSHOP })),
  ...homeWorks.flatMap(([key, name]) => pair("Beranda", key, name, CAT_WORKS)),
  { key: "home_testimonial_1", label: "Beranda - Foto Testimoni Pelanggan", category: CAT_TESTI },
  ...gallery.flatMap(([key, name]) => pair("Galeri", key, name, CAT_GALLERY)),
];

export const SITE_MEDIA_BUCKET = "site-media";

/** Key slot hanya boleh huruf kecil, angka, underscore. */
export const isValidSlotKey = (key: unknown): key is string =>
  typeof key === "string" && /^[a-z0-9_]{1,60}$/.test(key);
