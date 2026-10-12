"use client";

import * as React from "react";
import { ImagePlus, Loader2, Star, X } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { compressImage, DEFAULT_PHOTO_MAX_DIMENSION } from "@/lib/imageResize";
import { getBusinessSettingsRemote } from "@/lib/settings";
import { MAX_SERVICE_IMAGES } from "@/lib/serviceDetails";

interface Props {
  value: string[];
  onChange: (urls: string[]) => void;
}

/**
 * Kolom unggah foto layanan di form admin.
 * Foto otomatis diperkecil di browser (mengikuti Pengaturan > Dimensi Foto), lalu diunggah
 * ke bucket `service-images`. Foto pertama jadi foto utama (sampul) layanan.
 */
export function ServiceImageUploader({ value, onChange }: Props) {
  const { toast } = useToast();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const latest = React.useRef<string[]>(value);
  const [uploading, setUploading] = React.useState(0);
  const [maxSide, setMaxSide] = React.useState(DEFAULT_PHOTO_MAX_DIMENSION);

  React.useEffect(() => {
    latest.current = value;
  }, [value]);

  React.useEffect(() => {
    getBusinessSettingsRemote()
      .then((s) => setMaxSide(s.photoMaxDimension || DEFAULT_PHOTO_MAX_DIMENSION))
      .catch(() => {});
  }, []);

  const push = (next: string[]) => {
    latest.current = next;
    onChange(next);
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const room = MAX_SERVICE_IMAGES - latest.current.length;
    if (room <= 0) {
      toast({ variant: "error", title: `Maksimal ${MAX_SERVICE_IMAGES} foto per layanan` });
      return;
    }
    const picked = Array.from(files).slice(0, room);
    if (files.length > room) {
      toast({ variant: "error", title: `Hanya ${room} foto yang dimasukkan`, description: `Batas ${MAX_SERVICE_IMAGES} foto per layanan.` });
    }

    for (const original of picked) {
      setUploading((n) => n + 1);
      try {
        const file = await compressImage(original, maxSide);
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/secure/admin/service-images", { method: "POST", body: fd });
        const json = await res.json().catch(() => null);
        if (!res.ok || !json?.success || !json.url) {
          toast({ variant: "error", title: "Gagal mengunggah foto", description: json?.error || `Kode ${res.status}` });
        } else {
          push([...latest.current, json.url as string]);
        }
      } catch {
        toast({ variant: "error", title: "Gagal mengunggah foto", description: "Koneksi bermasalah, coba lagi." });
      } finally {
        setUploading((n) => n - 1);
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (url: string) => push(latest.current.filter((u) => u !== url));
  const makeMain = (url: string) => push([url, ...latest.current.filter((u) => u !== url)]);

  const full = value.length >= MAX_SERVICE_IMAGES;

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {value.map((url, i) => (
          <div key={url} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-brand-border bg-brand-bg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={`Foto layanan ${i + 1}`} className="h-full w-full object-contain" />
            {i === 0 && (
              <span className="absolute left-2 top-2 rounded-full bg-brand-green px-2 py-0.5 text-[10px] font-bold text-white">
                Utama
              </span>
            )}
            <div className="absolute right-2 top-2 flex gap-1.5">
              {i > 0 && (
                <button
                  type="button"
                  onClick={() => makeMain(url)}
                  title="Jadikan foto utama"
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-slate-600 shadow hover:text-brand-green"
                >
                  <Star className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => remove(url)}
                title="Hapus foto"
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-red-500 shadow hover:bg-red-50"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {Array.from({ length: uploading }).map((_, i) => (
          <div
            key={`up-${i}`}
            className="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-brand-border bg-brand-bg/60 text-slate-400"
          >
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        ))}

        {!full && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex aspect-[4/3] flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-brand-border text-sm font-medium text-slate-500 transition-colors hover:border-brand-green hover:bg-brand-bg/60 hover:text-brand-green"
          >
            <ImagePlus className="h-5 w-5" />
            Tambah foto
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
      <p className="text-xs text-slate-500">
        JPG, PNG, atau WEBP, maksimal {MAX_SERVICE_IMAGES} foto. Foto diperkecil otomatis. Foto utama tampil paling besar di
        halaman layanan. Perubahan tersimpan setelah kamu menekan Simpan.
      </p>
    </div>
  );
}
