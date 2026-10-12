import type { Metadata } from "next";
import Link from "next/link";
import { GalleryHorizontalEnd, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getSiteImages, pickSiteImage } from "@/lib/siteImages";
import { SiteImage } from "@/components/ui/SiteImage";

export const metadata: Metadata = {
  title: "Hasil Produksi - Portofolio JahitPakaian.com",
  description:
    "Lihat portofolio hasil produksi konveksi JahitPakaian.com: seragam, kaos, kemeja, jaket, sablon, bordir, dan merchandise custom.",
};

/**
 * `key` = awalan slot gambar di Admin > Foto Website (lihat lib/siteImageSlots.ts):
 * `${key}_before` = desain / bahan mentah, `${key}_after` = hasil produksi.
 */
const portfolio = [
  {
    key: "gallery_1",
    title: "Seragam Kantor Perusahaan",
    category: "Seragam",
    description: "Seragam kerja 100 set lengkap dengan bordir logo di dada, ukuran disesuaikan per karyawan.",
  },
  {
    key: "gallery_2",
    title: "Kemeja Batik Korporat",
    category: "Kemeja",
    description: "Kemeja batik custom untuk acara perusahaan, motif eksklusif dengan jahitan rapi dan presisi.",
  },
  {
    key: "gallery_3",
    title: "Jaket Bomber Komunitas",
    category: "Jaket & Hoodie",
    description: "Jaket bomber custom dengan bordir patch dan rib premium untuk komunitas motor.",
  },
  {
    key: "gallery_4",
    title: "Kaos Event Sablon DTF",
    category: "Kaos & Polo",
    description: "Kaos cotton combed 30s dengan sablon full color untuk event dan panitia acara.",
  },
  {
    key: "gallery_5",
    title: "Polo Shirt Bordir Logo",
    category: "Kaos & Polo",
    description: "Polo shirt lacoste dengan bordir logo komputer yang rapi, jelas, dan tidak mudah rontok.",
  },
  {
    key: "gallery_6",
    title: "Wearpack Proyek",
    category: "Seragam",
    description: "Wearpack bahan drill tebal dengan reflektor dan saku fungsional untuk tim lapangan.",
  },
  {
    key: "gallery_7",
    title: "Hoodie Brand Streetwear",
    category: "Jaket & Hoodie",
    description: "Hoodie oversize fleece tebal dengan sablon plastisol dan label brand sendiri.",
  },
  {
    key: "gallery_8",
    title: "Merchandise Tote Bag",
    category: "Merchandise",
    description: "Tote bag kanvas custom untuk souvenir acara dan merchandise brand, jumlah massal.",
  },
];

// Foto bisa diganti admin kapan saja, jadi jangan di-cache saat build.
export const dynamic = "force-dynamic";

export default async function HasilProduksiPage() {
  const images = await getSiteImages();
  const img = (key: string) => pickSiteImage(images, key);
  return (
    <>
      <section className="relative border-b border-brand-border/60 bg-gradient-to-b from-brand-bg/80 via-white to-white">
        <div className="container-app pt-14 pb-16 sm:pt-16 sm:pb-20">
          <div className="max-w-3xl">
            <Badge variant="warning" className="mb-4 px-3 py-1.5">
              <GalleryHorizontalEnd className="h-3.5 w-3.5" />
              Galeri Portofolio
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-text">
              Hasil Produksi <span className="text-brand-green">Desain & Hasil Jadi</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl">
              Kumpulan hasil produksi konveksi yang sudah kami kerjakan. Lihat
              sendiri kualitas jahitan, sablon, dan bordir dari JahitPakaian.com.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 gap-6">
          {portfolio.map((p) => (
            <div
              key={p.key}
              className="group rounded-2xl border border-brand-border bg-white overflow-hidden shadow-soft hover:shadow-card hover:border-brand-green/30 transition-all"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-square overflow-hidden border-r border-brand-border/70 bg-slate-100">
                  <SiteImage src={img(`${p.key}_before`)} alt={`${p.title} - desain`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-slate-900/75 backdrop-blur text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                    DESAIN
                  </div>
                </div>
                <div className="relative aspect-square overflow-hidden bg-slate-100">
                  <SiteImage src={img(`${p.key}_after`)} alt={`${p.title} - hasil`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 bg-brand-green text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-soft">
                    HASIL
                  </div>
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h3 className="font-bold text-brand-text text-lg">{p.title}</h3>
                  <Badge variant="success">{p.category}</Badge>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {p.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 rounded-3xl bg-gradient-to-br from-brand-bg via-white to-green-50 border border-brand-green/20 p-8 sm:p-10 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-text">
            Punya Desain atau Ide Pakaian Sendiri?
          </h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Konsultasikan kebutuhan produksimu secara gratis. Tim kami siap membantu memilih
            bahan, model, dan jumlah produksi yang paling pas untuk kamu.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Button size="lg" asChild>
              <Link href="/layanan">
                Pesan Konveksi Sekarang
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/hubungi-kami">Konsultasi Gratis</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}