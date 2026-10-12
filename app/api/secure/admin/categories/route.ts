import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateAdminSession } from "@/lib/adminApiGuard";
import { getServiceRoleOrThrow } from "@/lib/supabaseServiceRole";

export const dynamic = "force-dynamic";

const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status });
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

/** Slug kategori: huruf kecil, angka, strip (mis. "kaos-polo"). */
function toCategorySlug(v: unknown): string {
  if (typeof v !== "string") return "";
  return v
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

function dbError(error: { message: string }) {
  console.error("admin/categories error:", error);
  const missingTable = /service_categories|relation|schema cache/i.test(error.message);
  return fail(
    500,
    missingTable
      ? "Tabel kategori belum ada di database. Jalankan supabase/setup.sql di Supabase SQL Editor dulu."
      : process.env.NODE_ENV === "development"
      ? error.message
      : "Gagal menyimpan ke database."
  );
}

async function guard(request: NextRequest) {
  return (await validateAdminSession(request)) ? null : fail(401, "Unauthorized");
}

function refresh() {
  revalidatePath("/");
  revalidatePath("/layanan");
}

/** Tambah kategori baru (atau aktifkan kembali kategori bernama sama yang pernah dihapus). */
export async function POST(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return fail(400, "Invalid request body");
    const name = text(body.name, 60);
    if (!name) return fail(400, "Nama kategori wajib diisi.");
    const id = toCategorySlug(name);
    if (!id) return fail(400, "Nama kategori harus mengandung huruf atau angka.");
    const description = text(body.description, 300) ?? "";
    const icon = text(body.icon, 40) || "shirt";

    const sb = await getServiceRoleOrThrow();
    const { data: existing, error: readErr } = await sb
      .from("service_categories")
      .select("id,is_active")
      .eq("id", id)
      .maybeSingle();
    if (readErr) return dbError(readErr);
    if (existing && existing.is_active !== false) return fail(409, "Kategori dengan nama itu sudah ada.");

    if (existing) {
      const { error } = await sb.from("service_categories").update({ name, description, icon, is_active: true }).eq("id", id);
      if (error) return dbError(error);
    } else {
      const { data: last } = await sb
        .from("service_categories")
        .select("sort_order")
        .order("sort_order", { ascending: false })
        .limit(1);
      const nextOrder = ((last?.[0] as any)?.sort_order ?? 0) + 10;
      const { error } = await sb
        .from("service_categories")
        .insert({ id, name, description, icon, sort_order: nextOrder });
      if (error) return dbError(error);
    }
    refresh();
    return NextResponse.json({ success: true, id });
  } catch (e) {
    console.error("POST /api/secure/admin/categories:", e);
    return fail(500, "Internal error");
  }
}

/** Ubah nama / deskripsi / ikon kategori. Id (slug) tidak berubah supaya layanan tetap terhubung. */
export async function PATCH(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== "string") return fail(400, "id kategori wajib diisi.");
    const payload: Record<string, unknown> = {};
    const name = text(body.name, 60);
    if (name !== undefined) {
      if (!name) return fail(400, "Nama kategori wajib diisi.");
      payload.name = name;
    }
    const description = text(body.description, 300);
    if (description !== undefined) payload.description = description;
    const icon = text(body.icon, 40);
    if (icon) payload.icon = icon;
    if (Object.keys(payload).length === 0) return fail(400, "Tidak ada data yang diubah.");

    const sb = await getServiceRoleOrThrow();
    const { data: existing } = await sb.from("service_categories").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      const { error } = await sb.from("service_categories").update(payload).eq("id", body.id);
      if (error) return dbError(error);
    } else {
      // Kategori bawaan di kode yang belum ada di database ikut tersimpan saat diedit pertama kali.
      const { error } = await sb
        .from("service_categories")
        .insert({ id: body.id, name: payload.name ?? body.id, description: "", icon: "shirt", sort_order: 200, ...payload });
      if (error) return dbError(error);
    }
    refresh();
    return NextResponse.json({ success: true, id: body.id });
  } catch (e) {
    console.error("PATCH /api/secure/admin/categories:", e);
    return fail(500, "Internal error");
  }
}

/** Simpan urutan kategori: { order: ["kaos", "seragam", ...] } dari paling atas. */
export async function PUT(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    const order: unknown = body?.order;
    if (!Array.isArray(order) || order.some((x) => typeof x !== "string")) return fail(400, "Urutan tidak valid.");
    const sb = await getServiceRoleOrThrow();
    for (let i = 0; i < order.length; i++) {
      const { error } = await sb.from("service_categories").update({ sort_order: (i + 1) * 10 }).eq("id", order[i]);
      if (error) return dbError(error);
    }
    refresh();
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("PUT /api/secure/admin/categories:", e);
    return fail(500, "Internal error");
  }
}

/** Hapus kategori (soft delete). Ditolak kalau masih ada layanan aktif di dalamnya. */
export async function DELETE(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== "string") return fail(400, "id kategori wajib diisi.");
    const sb = await getServiceRoleOrThrow();
    const { count, error: countErr } = await sb
      .from("services")
      .select("id", { count: "exact", head: true })
      .eq("category", body.id)
      .eq("is_active", true);
    if (countErr) return dbError(countErr);
    if ((count ?? 0) > 0) {
      return fail(409, `Masih ada ${count} layanan di kategori ini. Pindahkan atau hapus layanannya dulu.`);
    }
    const { data: existing } = await sb.from("service_categories").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      const { error } = await sb.from("service_categories").update({ is_active: false }).eq("id", body.id);
      if (error) return dbError(error);
    } else {
      const { error } = await sb
        .from("service_categories")
        .insert({ id: body.id, name: body.id, description: "", icon: "shirt", sort_order: 200, is_active: false });
      if (error) return dbError(error);
    }
    refresh();
    return NextResponse.json({ success: true, id: body.id });
  } catch (e) {
    console.error("DELETE /api/secure/admin/categories:", e);
    return fail(500, "Internal error");
  }
}
