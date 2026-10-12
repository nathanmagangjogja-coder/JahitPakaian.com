"use client";

import * as React from "react";
import Link from "next/link";
import { Clock, Images, Search, X, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { ServiceIcon } from "@/components/ui/ServiceIcon";
import { ServiceWhatsAppButton } from "@/components/shared/ServiceWhatsAppButton";
import type { ServiceFull } from "@/lib/serviceDetails";
import type { CategoryFull } from "@/lib/categories";

interface Props {
  services: ServiceFull[];
  /** Kategori yang punya layanan, sudah urut sesuai pengaturan admin. */
  categories: CategoryFull[];
  initialCategory?: string;
}

/** Katalog layanan konveksi: pencarian, tab kategori, dan kartu produk dengan foto. */
export function ServiceCatalog({ services, categories, initialCategory }: Props) {
  const [active, setActive] = React.useState<string>(
    initialCategory && categories.some((c) => c.id === initialCategory) ? initialCategory : "all"
  );
  const [query, setQuery] = React.useState("");

  const q = query.trim().toLowerCase();
  const visible = services.filter((s) => {
    if (active !== "all" && s.category !== active) return false;
    return !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
  });
  const categoryOf = (id: string) => categories.find((c) => c.id === id);
  const activeCategory = active === "all" ? null : categoryOf(active);

  const tabCls = (on: boolean) =>
    `shrink-0 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      on
        ? "border-brand-green bg-brand-green text-white shadow-soft"
        : "border-brand-border bg-white text-slate-600 hover:border-brand-green/40 hover:text-brand-green"
    }`;
  const countCls = (on: boolean) =>
    `rounded-full px-1.5 py-px text-[11px] font-bold leading-4 ${on ? "bg-white/25 text-white" : "bg-brand-bg text-slate-500"}`;

  return (
    <div className="space-y-8">
      <div className="space-y-5">
        {/* Baris 1: ringkasan hasil + pencarian */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-bold text-brand-text">{visible.length}</span> dari {services.length} layanan
            {activeCategory ? <> di kategori <span className="font-semibold text-brand-text">{activeCategory.name}</span></> : null}
          </p>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari produk atau layanan..."
              className="pl-10 pr-10"
              aria-label="Cari layanan"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Hapus pencarian"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Baris 2: tab kategori (geser di HP, membungkus rapi di layar lebar) */}
        <div
          role="tablist"
          aria-label="Kategori layanan"
          className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <button role="tab" aria-selected={active === "all"} onClick={() => setActive("all")} className={tabCls(active === "all")}>
            Semua
            <span className={countCls(active === "all")}>{services.length}</span>
          </button>
          {categories.map((c) => {
            const count = services.filter((s) => s.category === c.id).length;
            const on = active === c.id;
            return (
              <button key={c.id} role="tab" aria-selected={on} onClick={() => setActive(c.id)} className={tabCls(on)}>
                <ServiceIcon name={c.icon} className="h-4 w-4" />
                {c.name}
                <span className={countCls(on)}>{count}</span>
              </button>
            );
          })}
        </div>

        {activeCategory?.description && (
          <p className="max-w-3xl text-sm text-slate-600 sm:text-base">{activeCategory.description}</p>
        )}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-brand-border bg-white/60 py-16 text-center text-slate-500">
          Tidak ada layanan yang cocok. Coba kategori lain atau kata kunci berbeda.
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => {
            const cat = categoryOf(s.category);
            const catName = cat?.name ?? s.category;
            const cover = s.images[0];
            return (
              <Card
                key={s.id}
                className="group flex flex-col overflow-hidden transition-all hover:-translate-y-0.5 hover:border-brand-green/30 hover:shadow-card"
              >
                {/* Foto produk */}
                <Link
                  href={`/layanan/${s.id}`}
                  aria-label={`Lihat ${s.name}`}
                  className="relative block aspect-[4/3] shrink-0 overflow-hidden border-b border-brand-border/60 bg-brand-bg"
                >
                  {cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cover}
                      alt={s.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-bg via-green-50 to-emerald-100/70">
                      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/80 text-brand-green shadow-soft ring-1 ring-brand-border">
                        <ServiceIcon name={s.icon} className="h-8 w-8" />
                      </span>
                      <span className="text-xs font-medium text-slate-400">Foto produk segera hadir</span>
                    </div>
                  )}

                  <span className="absolute left-3 top-3 inline-flex max-w-[75%] items-center gap-1.5 truncate rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-brand-green-dark shadow-soft backdrop-blur">
                    <ServiceIcon name={s.icon} className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{catName}</span>
                  </span>

                  {s.images.length > 1 && (
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Images className="h-3 w-3" />
                      {s.images.length}
                    </span>
                  )}
                </Link>

                <CardContent className="flex flex-1 flex-col gap-4 p-5">
                  <div className="space-y-2">
                    <h3 className="line-clamp-2 text-lg font-bold leading-snug text-brand-text">
                      <Link href={`/layanan/${s.id}`} className="transition-colors hover:text-brand-green">
                        {s.name}
                      </Link>
                    </h3>
                    <p className="line-clamp-3 text-sm leading-relaxed text-slate-600">{s.description}</p>
                  </div>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-brand-border/60 pt-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                      <Clock className="h-3.5 w-3.5" />
                      {s.duration}
                    </span>
                    <Link
                      href={`/layanan/${s.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-brand-green hover:underline"
                    >
                      Lihat detail
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </div>

                  <ServiceWhatsAppButton service={{ name: s.name, categoryLabel: catName }} variant="secondary" className="w-full" />
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}