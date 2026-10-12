import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { validateAdminSession } from "@/lib/adminApiGuard";
import { getServiceRoleOrThrow } from "@/lib/supabaseServiceRole";
import { categoryTitle } from "@/lib/data";
import {
  cleanList,
  cleanSteps,
  cleanFaqs,
  cleanImages,
  serviceImagePath,
  SERVICE_IMAGES_BUCKET,
} from "@/lib/serviceDetails";

/** Kategori bebas: huruf kecil, angka, dan strip (mis. "kaos", "custom-design"). */
function toCategorySlug(v: unknown): string {
  if (typeof v !== "string") return "";
  return v
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
}

/** Pastikan kategori layanan terdaftar di tabel `service_categories` (diabaikan kalau tabel belum ada). */
async function ensureCategory(sb: Awaited<ReturnType<typeof getServiceRoleOrThrow>>, slug: unknown) {
  if (typeof slug !== "string" || !slug) return;
  try {
    const { data } = await sb.from("service_categories").select("id,is_active").eq("id", slug).maybeSingle();
    if (!data) {
      await sb.from("service_categories").insert({ id: slug, name: categoryTitle(slug), description: "", icon: "shirt", sort_order: 200 });
    } else if ((data as any).is_active === false) {
      await sb.from("service_categories").update({ is_active: true }).eq("id", slug);
    }
  } catch (e) {
    console.error("ensureCategory:", e);
  }
}

function refresh(id?: string) {
  revalidatePath("/");
  revalidatePath("/layanan");
  if (id) revalidatePath(`/layanan/${id}`);
}

const fail = (status: number, error: string) =>
  NextResponse.json({ success: false, error }, { status });

const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : undefined);

function slugify(name: string, category: string) {
  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  return `${category}-${slug || "layanan"}`;
}

/** Ubah body dari admin menjadi kolom tabel `services`. Hanya field yang dikirim yang diisi. */
function toPayload(body: any): Record<string, unknown> {
  const p: Record<string, unknown> = {};
  const name = text(body.name, 120);
  if (name !== undefined) p.name = name;
  const description = text(body.description, 500);
  if (description !== undefined) p.description = description;
  const duration = text(body.duration, 60);
  if (duration !== undefined) p.duration = duration;
  const category = toCategorySlug(body.category);
  if (category) p.category = category;
  const icon = text(body.icon, 40);
  if (icon !== undefined) p.icon = icon;

  const longDescription = text(body.longDescription, 6000);
  if (longDescription !== undefined) p.long_description = longDescription;
  if (body.includes !== undefined) p.includes = cleanList(body.includes);
  if (body.tips !== undefined) p.tips = cleanList(body.tips);
  if (body.steps !== undefined) p.steps = cleanSteps(body.steps);
  if (body.faqs !== undefined) p.faqs = cleanFaqs(body.faqs);
  if (body.images !== undefined) p.images = cleanImages(body.images);
  return p;
}

function dbError(error: { message: string }) {
  console.error("admin/services error:", error);
  const missingColumn = /column|schema cache/i.test(error.message);
  return fail(
    500,
    missingColumn
      ? "Kolom detail layanan belum ada di database. Jalankan supabase/setup.sql di Supabase SQL Editor dulu."
      : process.env.NODE_ENV === "development"
      ? error.message
      : "Gagal menyimpan ke database."
  );
}

async function guard(request: NextRequest) {
  return (await validateAdminSession(request)) ? null : fail(401, "Unauthorized");
}

export async function POST(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") return fail(400, "Invalid request body");
    const payload = toPayload(body);
    if (!payload.name || !payload.description || !payload.duration || !payload.category) {
      return fail(400, "Nama, deskripsi, durasi, dan kategori wajib diisi.");
    }

    const sb = await getServiceRoleOrThrow();
    let id = slugify(String(payload.name), String(payload.category));
    const { data: existing } = await sb.from("services").select("id").eq("id", id).maybeSingle();
    if (existing) id = `${id}-${Math.random().toString(36).slice(2, 6)}`;

    await ensureCategory(sb, payload.category);
    const { error } = await sb.from("services").insert({ id, ...payload });
    if (error) return dbError(error);
    refresh(id);
    return NextResponse.json({ success: true, id });
  } catch (e) {
    console.error("POST /api/secure/admin/services:", e);
    return fail(500, "Internal error");
  }
}

export async function PATCH(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== "string") return fail(400, "id layanan wajib diisi.");
    const payload = toPayload(body);
    if (Object.keys(payload).length === 0) return fail(400, "Tidak ada data yang diubah.");

    const sb = await getServiceRoleOrThrow();
    await ensureCategory(sb, payload.category);
    // upsert: layanan bawaan (statis) yang belum ada di database ikut tersimpan saat diedit pertama kali.
    const { data: existing } = await sb.from("services").select("id").eq("id", body.id).maybeSingle();
    if (existing) {
      // Foto yang dihapus admin ikut dibuang dari storage setelah data tersimpan.
      let removedImages: string[] = [];
      if (Array.isArray(payload.images)) {
        const { data: prev } = await sb.from("services").select("images").eq("id", body.id).maybeSingle();
        const before = cleanImages((prev as any)?.images);
        removedImages = before.filter((u) => !(payload.images as string[]).includes(u));
      }
      const { error } = await sb.from("services").update(payload).eq("id", body.id);
      if (error) return dbError(error);
      const paths = removedImages.map(serviceImagePath).filter((x): x is string => !!x);
      if (paths.length > 0) {
        await sb.storage.from(SERVICE_IMAGES_BUCKET).remove(paths).catch((e: unknown) => console.error("hapus foto layanan:", e));
      }
    } else {
      const { error } = await sb.from("services").insert({ id: body.id, ...payload });
      if (error) return dbError(error);
    }
    refresh(body.id);
    return NextResponse.json({ success: true, id: body.id });
  } catch (e) {
    console.error("PATCH /api/secure/admin/services:", e);
    return fail(500, "Internal error");
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await guard(request);
  if (denied) return denied;
  try {
    const body = await request.json().catch(() => null);
    if (!body || typeof body.id !== "string") return fail(400, "id layanan wajib diisi.");
    const sb = await getServiceRoleOrThrow();
    const { error } = await sb.from("services").update({ is_active: false }).eq("id", body.id);
    if (error) return dbError(error);
    refresh(body.id);
    return NextResponse.json({ success: true, id: body.id });
  } catch (e) {
    console.error("DELETE /api/secure/admin/services:", e);
    return fail(500, "Internal error");
  }
}