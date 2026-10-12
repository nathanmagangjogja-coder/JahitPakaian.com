"use client";

import * as React from "react";
import { ImagePlus, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { compressImage, DEFAULT_PHOTO_MAX_DIMENSION } from "@/lib/imageResize";
import { getBusinessSettingsRemote } from "@/lib/settings";
import { updateService, type ServiceFull } from "@/lib/services";
import { MAX_SERVICE_IMAGES } from "@/lib/serviceDetails";

interface Props {
  service: ServiceFull;
  /** Dipanggil setelah foto tersimpan, supaya daftar dimuat ulang. */
  onUploaded: () => void;
}

/**
 * Tombol unggah foto cepat langsung dari tabel Kelola Layanan,
 * tanpa perlu membuka form edit. Foto langsung disimpan ke layanan.
 */
export function ServiceQuickPhoto({ service, onUploaded }: Props) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [busy, setBusy] = React.useState(false);
  const [maxSide, setMaxSide] = React.useState(DEFAULT_PHOTO_MAX_DIMENSION);

  React.useEffect(() => {
    getBusinessSettingsRemote()
      .then((s) => setMaxSide(s.photoMaxDimension || DEFAULT_PHOTO_MAX_DIMENSION))
      .catch(() => {});
  }, []);

  const full = service.images.length >= MAX_SERVICE_IMAGES;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_SERVICE_IMAGES - service.images.length;
    const picked = Array.from(files).slice(0, room);
    setBusy(true);
    const urls: string[] = [];
    try {
      for (const original of picked) {
        const file = await compressImage(original, maxSide);
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/secure/admin/service-images", { method: "POST", body: fd });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success || !json.url) {
          toast({ variant: "error", title: "Gagal mengunggah foto", description: json?.error || `Kode ${res.status}` });
          break;
        }
        urls.push(json.url as string);
      }
      if (urls.length > 0) {
        // Kirim data lengkap supaya layanan bawaan (statis) yang belum ada di database ikut tersimpan.
        const result = await updateService(service.id, {
          name: service.name,
          description: service.description,
          duration: service.duration,
          category: service.category,
          icon: service.icon,
          longDescription: service.longDescription,
          includes: service.includes,
          steps: service.steps,
          tips: service.tips,
          faqs: service.faqs,
          images: [...service.images, ...urls],
        });
        if (result.ok) {
          toast({ variant: "success", title: `${urls.length} foto ditambahkan`, description: service.name });
          onUploaded();
        } else {
          toast({ variant: "error", title: "Foto terunggah tapi gagal disimpan", description: result.error });
        }
      }
    } catch {
      toast({ variant: "error", title: "Gagal mengunggah foto", description: "Koneksi bermasalah, coba lagi." });
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs ${service.images.length === 0 ? "font-semibold text-amber-600" : "text-slate-500"}`}>
        {service.images.length === 0 ? "Belum ada" : `${service.images.length} foto`}
      </span>
      <button
        type="button"
        disabled={busy || full}
        onClick={() => inputRef.current?.click()}
        title={full ? `Maksimal ${MAX_SERVICE_IMAGES} foto` : "Unggah foto produk"}
        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-brand-green/40 bg-green-50 px-2.5 text-xs font-semibold text-brand-green-dark transition-colors hover:bg-brand-green hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <ImagePlus className="h-3.5 w-3.5" />}
        {busy ? "Mengunggah..." : "Upload"}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}