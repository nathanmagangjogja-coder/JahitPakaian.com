import type { Metadata } from "next";
import Link from "next/link";
import { PackageCheck, CheckCircle2, Send, Search, FileText, ThumbsUp, Pen, Award, ShieldCheck, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Cara Kerja - JahitPakaian.com",
  description:
    "Pelajari alur pemesanan konveksi di JahitPakaian.com, dari konsultasi desain, pembuatan sampel, produksi, sampai pesanan dikirim.",
};

const steps = [
  {
    icon: Send,
    step: "01",
    title: "Pilih Produk & Konsultasi",
    desc: "Pilih produk di halaman Layanan, lalu chat WhatsApp untuk membahas model, bahan, jumlah, dan kirim desain atau referensimu.",
  },
  {
    icon: PackageCheck,
    step: "02",
    title: "Sepakati Detail & DP",
    desc: "Kami susun rincian pesanan: spesifikasi bahan, ukuran (size chart), jumlah, jadwal produksi, dan pembayaran awal.",
  },
  {
    icon: Search,
    step: "03",
    title: "Pembuatan Sampel",
    desc: "Sampel dibuat lebih dulu untuk dicek model, ukuran, warna, dan hasil sablon atau bordirnya sebelum produksi massal.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Persetujuan Sampel",
    desc: "Setelah sampel kamu setujui, sampel menjadi acuan produksi. Revisi bisa dilakukan sebelum produksi dimulai.",
  },
  {
    icon: Pen,
    step: "05",
    title: "Produksi Massal",
    desc: "Tim penjahit profesional memproduksi pesananmu dengan standar yang konsisten. Kamu bisa menanyakan progresnya kapan saja lewat WhatsApp.",
  },
  {
    icon: Award,
    step: "06",
    title: "Quality Control",
    desc: "Setiap unit dicek: kerapian jahitan, kecocokan ukuran, hasil sablon/bordir, dan kebersihan, lalu dikemas rapi.",
  },
  {
    icon: ThumbsUp,
    step: "07",
    title: "Pesanan Siap Diambil / Dikirim",
    desc: "Pesanan selesai dan bisa diambil langsung di workshop atau dikirim via ekspedisi ke seluruh Indonesia.",
  },
];

export default function CaraKerjaPage() {
  return (
    <>
      <section className="relative border-b border-brand-border/60 bg-gradient-to-b from-brand-bg/80 via-white to-white">
        <div className="container-app pt-14 pb-16 sm:pt-16 sm:pb-20">
          <div className="max-w-3xl">
            <Badge variant="blue" className="mb-4 px-3 py-1.5">
              Alur Pemesanan
            </Badge>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-text">
              Cara Kerja <span className="text-brand-green">JahitPakaian.com</span>
            </h1>
            <p className="mt-4 text-lg text-slate-600 leading-relaxed max-w-2xl">
              Proses yang transparan dan mudah diikuti. 7 langkah sederhana dari
              konsultasi desain sampai pesanan konveksimu sampai di tanganmu.
            </p>
          </div>
        </div>
      </section>

      <section className="container-app py-12 sm:py-16">
        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            {steps.map((s, i) => (
              <div
                key={s.step}
                className="relative rounded-2xl border border-brand-border bg-white p-5 sm:p-6 shadow-soft hover:shadow-card hover:border-brand-green/30 transition-all"
              >
                <div className="flex items-start gap-5">
                  <div className="relative shrink-0">
                    <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-green to-emerald-400 text-white flex items-center justify-center shadow-soft">
                      <s.icon className="h-6 w-6" />
                    </div>
                    <div className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-white border-2 border-brand-green text-brand-green flex items-center justify-center text-xs font-bold shadow-soft">
                      {i + 1}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="font-bold text-brand-text text-lg sm:text-xl">{s.title}</h3>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
                      {s.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <Card className="border-brand-green/20 bg-gradient-to-br from-brand-bg via-white to-green-50">
              <CardContent className="p-6 sm:p-7 space-y-5">
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 shrink-0 rounded-xl bg-brand-green text-white flex items-center justify-center shadow-soft">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-brand-text text-lg">Garansi Hasil Rapi</h3>
                    <p className="text-sm text-slate-600 mt-1">
                      Jika hasil produksi tidak sesuai sampel yang disetujui, kami perbaiki atau ganti ulang gratis.
                    </p>
                  </div>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    "Penjahit berpengalaman 5+ tahun",
                    "Rincian pesanan jelas tanpa kejutan",
                    "Update progres produksi via WhatsApp",
                    "Konsultasi gratis sebelum pesanan",
                    "Estimasi produksi tertera di tiap layanan",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-slate-700">
                      <CheckCircle2 className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-col gap-2 pt-2">
                  <Button size="lg" className="w-full" asChild>
                    <Link href="/layanan">
                      Mulai Pesan Konveksi
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="w-full" asChild>
                    <Link href="/faq">Lihat FAQ</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-2xl border border-brand-border bg-white p-5 shadow-soft">
              <h4 className="font-bold text-brand-text mb-2">Perlu Bantuan?</h4>
              <p className="text-sm text-slate-600 leading-relaxed mb-3">
                Tim kami siap membantu konsultasi kebutuhan konveksimu secara gratis sebelum memesan.
              </p>
              <Button variant="ghost" className="text-brand-green !p-0 h-auto" asChild>
                <Link href="/hubungi-kami">
                  Hubungi Kami Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}