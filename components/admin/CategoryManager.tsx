"use client";

import * as React from "react";
import { ArrowDown, ArrowUp, Check, Edit, Loader2, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { ServiceIcon, serviceIconOptions } from "@/components/ui/ServiceIcon";
import { useToast } from "@/components/ui/Toast";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  type CategoryFull,
} from "@/lib/categories";

interface Props {
  categories: CategoryFull[];
  /** Jumlah layanan aktif per id kategori (untuk info & mencegah hapus kategori yang terpakai). */
  counts: Record<string, number>;
  onClose: () => void;
  /** Dipanggil setiap data kategori berubah supaya halaman induk memuat ulang daftar. */
  onChanged: () => void;
}

interface Draft {
  id: string | null; // null = kategori baru
  name: string;
  description: string;
  icon: string;
}

const blank: Draft = { id: null, name: "", description: "", icon: "shirt" };

/** Jendela kelola kategori: tambah, ubah nama/deskripsi/ikon, atur urutan, dan hapus. */
export function CategoryManager({ categories, counts, onClose, onChanged }: Props) {
  const { toast } = useToast();
  const [draft, setDraft] = React.useState<Draft | null>(null);
  const [busy, setBusy] = React.useState<string | null>(null);

  const fail = (title: string, description?: string) => toast({ variant: "error", title, description });

  const save = async () => {
    if (!draft) return;
    if (!draft.name.trim()) return fail("Nama kategori wajib diisi");
    setBusy("save");
    const input = { name: draft.name.trim(), description: draft.description.trim(), icon: draft.icon };
    const res = draft.id ? await updateCategory(draft.id, input) : await createCategory(input);
    setBusy(null);
    if (!res.ok) return fail("Gagal menyimpan kategori", res.error);
    toast({ variant: "success", title: draft.id ? "Kategori diperbarui" : "Kategori ditambahkan" });
    setDraft(null);
    onChanged();
  };

  const remove = async (c: CategoryFull) => {
    if (!confirm(`Hapus kategori "${c.name}"? Kategori ini tidak akan tampil lagi di website.`)) return;
    setBusy(c.id);
    const res = await deleteCategory(c.id);
    setBusy(null);
    if (!res.ok) return fail("Gagal menghapus kategori", res.error);
    toast({ variant: "success", title: "Kategori dihapus" });
    onChanged();
  };

  const move = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= categories.length) return;
    const ids = categories.map((c) => c.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    setBusy("order");
    const res = await reorderCategories(ids);
    setBusy(null);
    if (!res.ok) return fail("Gagal mengubah urutan", res.error);
    onChanged();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-card w-full max-w-2xl max-h-[92vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white flex items-center justify-between p-5 border-b border-brand-border">
          <div>
            <h3 className="font-bold text-brand-text">Kelola Kategori Layanan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kategori tampil sebagai tab di halaman Layanan. Urutan di sini = urutan tab.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600" aria-label="Tutup">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <ul className="divide-y divide-brand-border/60 rounded-2xl border border-brand-border">
            {categories.length === 0 && <li className="p-6 text-center text-sm text-slate-400">Belum ada kategori.</li>}
            {categories.map((c, i) => {
              const used = counts[c.id] ?? 0;
              return (
                <li key={c.id} className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 shrink-0 rounded-xl bg-brand-bg text-brand-green flex items-center justify-center ring-1 ring-brand-border">
                    <ServiceIcon name={c.icon} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-brand-text truncate">{c.name}</div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {used} layanan{c.description ? ` · ${c.description}` : ""}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="!h-8 !w-8 !p-0" disabled={i === 0 || busy !== null} onClick={() => move(i, -1)} aria-label="Naikkan">
                      <ArrowUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="!h-8 !w-8 !p-0" disabled={i === categories.length - 1 || busy !== null} onClick={() => move(i, 1)} aria-label="Turunkan">
                      <ArrowDown className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!h-8 !w-8 !p-0"
                      onClick={() => setDraft({ id: c.id, name: c.name, description: c.description, icon: c.icon })}
                      aria-label="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="!h-8 !w-8 !p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
                      disabled={busy !== null}
                      onClick={() => remove(c)}
                      title={used > 0 ? "Pindahkan layanannya dulu" : "Hapus kategori"}
                      aria-label="Hapus"
                    >
                      {busy === c.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>

          {draft ? (
            <div className="space-y-4 rounded-2xl border border-brand-green/30 bg-brand-bg/40 p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-brand-green">
                {draft.id ? "Edit kategori" : "Kategori baru"}
              </h4>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-text">Nama kategori</label>
                <Input
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="Contoh: Topi & Aksesoris"
                  maxLength={60}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-text">Deskripsi singkat</label>
                <Textarea
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={2}
                  className="min-h-[70px]"
                  maxLength={300}
                  placeholder="Tampil di bawah judul kategori pada halaman Layanan."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-brand-text">Ikon</label>
                <Select value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })}>
                  {serviceIconOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </Select>
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setDraft(null)}>Batal</Button>
                <Button type="button" onClick={save} disabled={busy === "save"}>
                  {busy === "save" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  Simpan kategori
                </Button>
              </div>
            </div>
          ) : (
            <Button type="button" variant="outline" onClick={() => setDraft(blank)}>
              <Plus className="h-4 w-4" />
              Tambah Kategori
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
