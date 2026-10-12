import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileStickyCTA from "@/components/ui/MobileStickyCTA";
import { ToastProvider } from "@/components/ui/Toast";
import { getBusinessSettingsRemote } from "@/lib/settings";

const baseMetadata: Metadata = {
  title: "JahitPakaian.com - Konveksi, Seragam, Kaos & Jaket Custom",
  description:
    "Jasa konveksi dan jahit custom profesional: seragam perusahaan, seragam sekolah, kaos, polo shirt, kemeja, jaket, hoodie, jas, sablon, bordir, hingga produksi massal dan grosir.",
  keywords: [
    "konveksi",
    "jasa jahit",
    "jahit custom",
    "seragam perusahaan",
    "seragam sekolah",
    "wearpack",
    "kaos custom",
    "polo shirt",
    "kemeja custom",
    "jaket custom",
    "hoodie & sweater",
    "jas & blazer",
    "celana custom",
    "sablon custom",
    "bordir custom",
    "merchandise",
    "produksi massal",
    "grosir pakaian",
    "custom design & sample",
    "JahitPakaian",
  ],
  authors: [{ name: "JahitPakaian.com" }],
  openGraph: {
    title: "JahitPakaian.com - Konveksi & Produksi Pakaian Custom",
    description:
      "Konveksi profesional: seragam, kaos, kemeja, jaket, sablon, bordir, dan produksi massal.",
    type: "website",
    locale: "id_ID",
  },
  twitter: {
    card: "summary_large_image",
    title: "JahitPakaian.com - Konveksi & Produksi Pakaian Custom",
    description:
      "Konveksi profesional: seragam, kaos, kemeja, jaket, sablon, bordir, dan produksi massal.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/** Metadata dasar + favicon dari database (kalau admin sudah upload). */
export async function generateMetadata(): Promise<Metadata> {
  try {
    const cfg = await getBusinessSettingsRemote();
    if (cfg.faviconUrl) {
      return { ...baseMetadata, icons: { icon: cfg.faviconUrl, shortcut: cfg.faviconUrl, apple: cfg.faviconUrl } };
    }
  } catch {
    // pakai favicon bawaan
  }
  return baseMetadata;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-white text-brand-text antialiased">
        <ToastProvider>
          <SiteChrome
            navbar={<Navbar />}
            footer={<Footer />}
            cta={<MobileStickyCTA />}
          >
            {children}
          </SiteChrome>
        </ToastProvider>
      </body>
    </html>
  );
}