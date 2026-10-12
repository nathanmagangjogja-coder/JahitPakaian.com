"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface Props {
  images: string[];
  name: string;
}

/** Galeri foto layanan: grid di halaman, klik untuk memperbesar (Esc menutup, panah kiri/kanan berpindah). */
export function ServiceGallery({ images, name }: Props) {
  const [open, setOpen] = React.useState<number | null>(null);
  const count = images.length;

  React.useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % count));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + count) % count));
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, count]);

  if (count === 0) return null;

  return (
    <>
      <div className={count === 1 ? "grid grid-cols-1" : "grid grid-cols-2 sm:grid-cols-3 gap-3"}>
        {images.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setOpen(i)}
            className={`group relative overflow-hidden rounded-2xl border border-brand-border bg-brand-bg shadow-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${
              i === 0 && count > 1 ? "col-span-2 row-span-2 aspect-[4/3] sm:aspect-auto sm:h-full" : "aspect-[4/3]"
            } ${count === 1 ? "aspect-[16/10]" : ""}`}
            aria-label={`Perbesar foto ${i + 1} dari ${count}: ${name}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${name} - foto ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            />
          </button>
        ))}
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Foto ${name}`}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4"
          onClick={() => setOpen(null)}
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
            aria-label="Tutup"
          >
            <X className="h-5 w-5" />
          </button>
          {count > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open - 1 + count) % count);
                }}
                className="absolute left-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                aria-label="Foto sebelumnya"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen((open + 1) % count);
                }}
                className="absolute right-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25"
                aria-label="Foto berikutnya"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[open]}
            alt={`${name} - foto ${open + 1}`}
            className="max-h-[88vh] max-w-full rounded-xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
