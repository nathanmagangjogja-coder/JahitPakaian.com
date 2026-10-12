import { supabase } from "./supabase";
import { categories as staticCategories, categoryTitle } from "./data";

/** Kategori layanan konveksi (tabel `service_categories`, lihat supabase/setup.sql). */
export interface CategoryFull {
  id: string;
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
}

const staticFull = (): CategoryFull[] =>
  staticCategories.map((c, i) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    icon: c.icon ?? "shirt",
    sortOrder: (i + 1) * 10,
  }));

function mapRow(row: any): CategoryFull {
  return {
    id: String(row.id),
    name: String(row.name ?? categoryTitle(String(row.id))),
    description: String(row.description ?? ""),
    icon: String(row.icon ?? "shirt"),
    sortOrder: Number.isFinite(row.sort_order) ? Number(row.sort_order) : 100,
  };
}

const bySort = (a: CategoryFull, b: CategoryFull) => a.sortOrder - b.sortOrder || a.name.localeCompare(b.name);

/**
 * Ambil kategori aktif dari Supabase (urut sesuai pengaturan admin).
 * Fallback ke daftar bawaan kalau database belum dikonfigurasi / tabel belum dibuat.
 */
export async function getCategoriesRemote(): Promise<CategoryFull[]> {
  if (!supabase) return staticFull();
  try {
    const { data, error } = await supabase.from("service_categories").select("*");
    if (error || !data || data.length === 0) return staticFull();
    return data.filter((r: any) => r.is_active !== false).map(mapRow).sort(bySort);
  } catch (e) {
    console.error("getCategoriesRemote error:", e);
    return staticFull();
  }
}

/** Cari kategori by id; kalau tidak terdaftar, buat nama cadangan dari slug-nya. */
export function resolveCategory(list: CategoryFull[], id: string): CategoryFull {
  return (
    list.find((c) => c.id === id) ?? { id, name: categoryTitle(id), description: "", icon: "shirt", sortOrder: 9999 }
  );
}

/**
 * Kategori yang ditampilkan di website publik: hanya yang punya layanan aktif,
 * urut sesuai pengaturan admin; kategori tak terdaftar (jarang) ditaruh di akhir.
 */
export function categoriesInUse(list: CategoryFull[], serviceCategoryIds: string[]): CategoryFull[] {
  const used = Array.from(new Set(serviceCategoryIds));
  const known = list.filter((c) => used.includes(c.id));
  const extra = used.filter((id) => !list.some((c) => c.id === id)).sort().map((id) => resolveCategory(list, id));
  return [...known, ...extra];
}

/* ------------------------------------------------------------------ */
/* Admin: tulis lewat API aman (/api/secure/admin/categories)           */
/* ------------------------------------------------------------------ */

export interface CategoryInput {
  name: string;
  description: string;
  icon: string;
}

export interface CategoryResult {
  ok: boolean;
  id?: string;
  error?: string;
}

async function callApi(method: "POST" | "PATCH" | "PUT" | "DELETE", body: unknown): Promise<CategoryResult> {
  try {
    const res = await fetch("/api/secure/admin/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.success) return { ok: false, error: json?.error || `Gagal (${res.status})` };
    return { ok: true, id: json.id };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Koneksi gagal" };
  }
}

export const createCategory = (input: CategoryInput) => callApi("POST", input);
export const updateCategory = (id: string, input: Partial<CategoryInput>) => callApi("PATCH", { ...input, id });
export const deleteCategory = (id: string) => callApi("DELETE", { id });
/** Simpan urutan baru: daftar id kategori dari paling atas. */
export const reorderCategories = (order: string[]) => callApi("PUT", { order });
