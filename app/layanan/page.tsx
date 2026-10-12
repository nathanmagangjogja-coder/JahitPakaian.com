import type { Metadata } from "next";
import { Shirt, Clock, MessageCircle, Layers } from "lucide-react";
import { getServicesRemote } from "@/lib/services";
import { getCategoriesRemote, categoriesInUse } from "@/lib/categories";
import { Badge } from "@/components/ui/Badge";
import { ServiceCatalog } from "@/components/shared/ServiceCatalog";
import { BRAND_NAME } from "@/lib/brand";

export const metadata: Metadata = {
  title: `Layanan Konveksi & Produksi Pakaian - ${BRAND_NAME}`,
  description:
    "Daftar layanan konveksi: seragam, kaos, kemeja, jaket, jas, celana, sablon, bordir, merchandise, sampai produksi massal. Pilih kategori, lihat produknya, lalu pesan lewat WhatsApp.",
};

// Daftar layanan & kategori bisa diubah admin, jadi selalu ambil data terbaru (tidak di-cache saat build).
export const dynamic = "force-dynamic";

export default async function LayananPage({ searchParams }: { searchParams?: { kategori?: string } }) {
  const [services, allCategories] = await Promise.all([getServicesRemote(), getCategoriesRemote()]);
  const categories = categoriesInUse(allCategories, services.map((s) => s.category));

  const highlights = [
    { icon: Layers, label: `${services.length} layanan`, hint: `${categories.length} kategori produk` },
    { icon: Clock, label: "Estimasi jelas", hint: "Waktu produksi tiap layanan" },
    { icon: MessageCircle, label: "Pesan via WhatsApp", hint: "Konsultasi langsung, tanpa ribet" },
  ];

  return (
    <>
      <section className="relative overflow-hidden border-b border-brand-border/60 bg-gradient-to-b from-brand-bg via-white to-white">
        <div className="container-app py-12 sm:py-16 lg:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            <div>
              <Badge variant="success" className="mb-4 px-3 py-1.5">
                <Shirt className="h-3.5 w-3.5" />
                Layanan Konveksi
              </Badge>
              <h1 className="text-balance text-3xl font-extrabold leading-[1.1] tracking-tight text-brand-text sm:text-4xl lg:text-5xl">
                Pilih Produk <span className="text-brand-green">Konveksi yang Kamu Butuhkan</span>
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                {services.length} layanan konveksi dalam {categories.length} kategori, dengan estimasi waktu produksi yang
                jelas. Pilih produk, lihat detailnya, lalu pesan lewat WhatsApp.
              </p>
            </div>

            <ul className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {highlights.map(({ icon: Icon, label, hint }) => (
                <li
                  key={label}
                  className="flex items-center gap-4 rounded-2xl border border-brand-border bg-white/80 p-4 shadow-soft backdrop-blur"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-bg text-brand-green ring-1 ring-brand-border">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-bold text-brand-text">{label}</span>
                    <span className="block text-sm text-slate-500">{hint}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-app py-10 sm:py-14">
        <ServiceCatalog services={services} categories={categories} initialCategory={searchParams?.kategori} />
      </section>
    </>
  );
}