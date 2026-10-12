import { NextRequest, NextResponse } from "next/server";
import { validateAdminSession } from "@/lib/adminApiGuard";
import { getServiceRoleOrThrow } from "@/lib/supabaseServiceRole";
import { SERVICE_IMAGES_BUCKET } from "@/lib/serviceDetails";

export const dynamic = "force-dynamic";
// Beri waktu cukup untuk beberapa percobaan ulang saat koneksi ke Supabase tersendat.
export const maxDuration = 60;

const MAX_ATTEMPTS = 3;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Kesalahan jaringan sementara (timeout / fetch failed) layak dicoba ulang; kesalahan lain (mis. bucket tidak ada) tidak. */
function isNetworkError(error: { message?: string; originalError?: unknown } | null): boolean {
  if (!error) return false;
  const text = `${error.message ?? ""} ${String((error.originalError as { cause?: { code?: string } } | undefined)?.cause?.code ?? "")}`;
  return /fetch failed|timeout|ECONNRESET|ENOTFOUND|EAI_AGAIN|UND_ERR/i.test(text);
}

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB (batas body serverless ~4.5 MB)
const MIME_EXT: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

const fail = (status: number, error: string) => NextResponse.json({ success: false, error }, { status });

/** Unggah satu foto layanan. multipart/form-data: file. Mengembalikan URL publiknya. */
export async function POST(request: NextRequest) {
  if (!(await validateAdminSession(request))) return fail(401, "Unauthorized");
  try {
    const form = await request.formData().catch(() => null);
    const file = form?.get("file");
    if (!(file instanceof File)) return fail(400, "File foto wajib diisi.");

    const ext = MIME_EXT[file.type];
    if (!ext) return fail(400, "Format harus JPG, PNG, atau WEBP.");
    if (file.size > MAX_BYTES) return fail(400, "Ukuran foto maksimal 4 MB.");

    const sb = await getServiceRoleOrThrow();
    const month = new Date().toISOString().slice(0, 7).replace("-", "");
    const path = `${month}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    let error: Awaited<ReturnType<ReturnType<typeof sb.storage.from>["upload"]>>["error"] = null;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      // upsert: true aman karena path unik, dan mencegah gagal "sudah ada" bila percobaan sebelumnya sebenarnya sempat masuk.
      ({ error } = await sb.storage
        .from(SERVICE_IMAGES_BUCKET)
        .upload(path, bytes, { contentType: file.type, cacheControl: "31536000", upsert: true }));
      if (!error || !isNetworkError(error)) break;
      console.warn(`admin/service-images: percobaan ${attempt}/${MAX_ATTEMPTS} gagal (jaringan), mengulang...`);
      if (attempt < MAX_ATTEMPTS) await sleep(800 * attempt);
    }
    if (error) {
      console.error("admin/service-images upload error:", error);
      return fail(
        500,
        /bucket/i.test(error.message)
          ? "Bucket 'service-images' belum ada. Jalankan supabase/setup.sql di Supabase SQL Editor."
          : isNetworkError(error)
            ? "Koneksi ke Supabase timeout. Cek internet/DNS atau pastikan project Supabase tidak ter-pause, lalu coba lagi."
            : "Gagal mengunggah foto ke storage."
      );
    }

    const { data } = sb.storage.from(SERVICE_IMAGES_BUCKET).getPublicUrl(path);
    return NextResponse.json({ success: true, url: data.publicUrl });
  } catch (e) {
    console.error("POST /api/secure/admin/service-images:", e);
    return fail(500, "Internal error");
  }
}