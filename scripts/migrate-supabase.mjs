#!/usr/bin/env node
/**
 * Salin SELURUH data JahitPakaian.com dari project Supabase LAMA ke project Supabase BARU:
 *  - Tabel : service_categories, services, site_media, business_settings, admin_users
 *  - Storage: bucket site-media, brand-assets, service-images (semua file, path sama)
 *  - URL gambar di dalam data otomatis diganti dari domain Supabase lama ke yang baru.
 *
 * Syarat: di project BARU, supabase/setup.sql sudah dijalankan (tabel & bucket sudah ada).
 *
 * Pemakaian (dari folder root project):
 *   node scripts/migrate-supabase.mjs --dry     # hanya cek & hitung, TIDAK menulis apa pun
 *   node scripts/migrate-supabase.mjs           # salin sungguhan
 *   node scripts/migrate-supabase.mjs --clean   # salin + hapus data "sisa" di project baru
 *                                               # (mis. layanan contoh dari setup.sql yang sudah dihapus di lama)
 *
 * Kredensial dibaca dari file .env.migrate.local (lihat MIGRASI-SUPABASE.md) atau environment variable.
 */
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

// ---------- konfigurasi ----------
for (const f of [".env.migrate.local", ".env.migrate"]) {
  if (!fs.existsSync(f)) continue;
  for (const line of fs.readFileSync(f, "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}
const DRY = process.argv.includes("--dry");
const CLEAN = process.argv.includes("--clean");

const need = ["OLD_SUPABASE_URL", "OLD_SERVICE_ROLE_KEY", "NEW_SUPABASE_URL", "NEW_SERVICE_ROLE_KEY"];
const missing = need.filter((k) => !process.env[k]);
if (missing.length) {
  console.error("Variabel belum diisi: " + missing.join(", ") + "\nLihat MIGRASI-SUPABASE.md.");
  process.exit(1);
}
const OLD_URL = process.env.OLD_SUPABASE_URL.replace(/\/+$/, "");
const NEW_URL = process.env.NEW_SUPABASE_URL.replace(/\/+$/, "");
if (OLD_URL === NEW_URL) {
  console.error("OLD_SUPABASE_URL dan NEW_SUPABASE_URL sama. Hentikan agar data tidak tertimpa.");
  process.exit(1);
}

// Koneksi ke Supabase kadang putus-nyambung (timeout), jadi setiap request diulang otomatis.
async function retryFetch(input, init) {
  let last;
  for (let i = 1; i <= 5; i++) {
    try {
      return await fetch(input, init);
    } catch (e) {
      last = e;
      await new Promise((r) => setTimeout(r, 1000 * i));
    }
  }
  throw last;
}
const mk = (url, key) =>
  createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: retryFetch } });
const oldSb = mk(OLD_URL, process.env.OLD_SERVICE_ROLE_KEY);
const newSb = mk(NEW_URL, process.env.NEW_SERVICE_ROLE_KEY);

const TABLES = [
  { name: "service_categories", key: "id" },
  { name: "services", key: "id" },
  { name: "site_media", key: "key" },
  { name: "business_settings", key: "id", keep: true },
  { name: "admin_users", key: "username", omit: ["id"], keep: true },
];
const BUCKETS = ["site-media", "brand-assets", "service-images"];

// ---------- util ----------
/** Ganti domain Supabase lama -> baru di semua string (termasuk di dalam array/objek JSON). */
function swapUrls(v) {
  if (typeof v === "string") return v.split(OLD_URL).join(NEW_URL);
  if (Array.isArray(v)) return v.map(swapUrls);
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, swapUrls(x)]));
  return v;
}

async function readAll(sb, table, key) {
  const rows = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await sb.from(table).select("*").order(key).range(from, from + 999);
    if (error) throw new Error(`Gagal membaca ${table}: ${error.message}`);
    rows.push(...data);
    if (data.length < 1000) break;
  }
  return rows;
}

async function listFiles(sb, bucket, prefix = "") {
  const files = [];
  for (let offset = 0; ; offset += 100) {
    const { data, error } = await sb.storage.from(bucket).list(prefix, { limit: 100, offset });
    if (error) throw new Error(`Gagal membaca bucket ${bucket}/${prefix}: ${error.message}`);
    for (const item of data) {
      const p = prefix ? `${prefix}/${item.name}` : item.name;
      if (item.id === null) files.push(...(await listFiles(sb, bucket, p))); // folder
      else files.push({ path: p, type: item.metadata?.mimetype });
    }
    if (data.length < 100) break;
  }
  return files;
}

// ---------- tabel ----------
async function copyTables() {
  console.log("\n== TABEL ==");
  for (const t of TABLES) {
    const rows = await readAll(oldSb, t.name, t.key);
    console.log(`${t.name}: ${rows.length} baris di project lama`);
    if (DRY) continue;

    if (rows.length) {
      const cleaned = rows.map((r) => {
        const x = swapUrls(r);
        for (const col of t.omit ?? []) delete x[col];
        return x;
      });
      for (let i = 0; i < cleaned.length; i += 100) {
        const { error } = await newSb.from(t.name).upsert(cleaned.slice(i, i + 100), { onConflict: t.key });
        if (error) throw new Error(`Gagal menulis ${t.name}: ${error.message}`);
      }
    }

    if (CLEAN && !t.keep) {
      const keep = new Set(rows.map((r) => r[t.key]));
      const existing = await readAll(newSb, t.name, t.key);
      const extra = existing.map((r) => r[t.key]).filter((k) => !keep.has(k));
      if (extra.length) {
        const { error } = await newSb.from(t.name).delete().in(t.key, extra);
        if (error) throw new Error(`Gagal membersihkan ${t.name}: ${error.message}`);
        console.log(`  - ${extra.length} baris sisa di project baru dihapus`);
      }
    }
  }
}

// ---------- storage ----------
async function ensureBucket(id) {
  const { data: oldB } = await oldSb.storage.getBucket(id);
  const { data: newB } = await newSb.storage.getBucket(id);
  if (newB) return;
  const { error } = await newSb.storage.createBucket(id, {
    public: true,
    fileSizeLimit: oldB?.file_size_limit ?? undefined,
    allowedMimeTypes: oldB?.allowed_mime_types ?? undefined,
  });
  if (error) throw new Error(`Gagal membuat bucket ${id}: ${error.message}`);
  console.log(`  bucket ${id} dibuat di project baru`);
}

async function copyStorage() {
  console.log("\n== STORAGE (GAMBAR) ==");
  for (const bucket of BUCKETS) {
    const { data: ob } = await oldSb.storage.getBucket(bucket);
    if (!ob) {
      console.log(`${bucket}: tidak ada di project lama, dilewati`);
      continue;
    }
    const files = await listFiles(oldSb, bucket);
    console.log(`${bucket}: ${files.length} file`);
    if (DRY) continue;
    await ensureBucket(bucket);

    let done = 0;
    for (const f of files) {
      const { data: blob, error: dErr } = await oldSb.storage.from(bucket).download(f.path);
      if (dErr) throw new Error(`Gagal mengunduh ${bucket}/${f.path}: ${dErr.message}`);
      const body = Buffer.from(await blob.arrayBuffer());
      const { error: uErr } = await newSb.storage
        .from(bucket)
        .upload(f.path, body, { contentType: f.type || blob.type || "application/octet-stream", cacheControl: "31536000", upsert: true });
      if (uErr) throw new Error(`Gagal mengunggah ${bucket}/${f.path}: ${uErr.message}`);
      done++;
      if (done % 10 === 0 || done === files.length) console.log(`  ${done}/${files.length}`);
    }
  }
}

// ---------- verifikasi ----------
async function verify() {
  console.log("\n== PERBANDINGAN LAMA vs BARU ==");
  for (const t of TABLES) {
    const a = await oldSb.from(t.name).select("*", { count: "exact", head: true });
    const b = await newSb.from(t.name).select("*", { count: "exact", head: true });
    const ok = a.count === b.count ? "OK " : "BEDA";
    console.log(`${ok} ${t.name}: lama=${a.count} baru=${b.count}`);
  }
  for (const bucket of BUCKETS) {
    try {
      const a = (await listFiles(oldSb, bucket)).length;
      const b = (await listFiles(newSb, bucket)).length;
      console.log(`${a === b ? "OK " : "BEDA"} ${bucket}: lama=${a} baru=${b}`);
    } catch {
      /* bucket tidak ada */
    }
  }
}

(async () => {
  console.log(`${DRY ? "[DRY RUN] " : ""}Dari ${OLD_URL}\n      ke   ${NEW_URL}`);
  await copyTables();
  await copyStorage();
  if (!DRY) await verify();
  console.log(DRY ? "\nDry run selesai. Tidak ada data yang ditulis." : "\nSelesai.");
})().catch((e) => {
  console.error("\nGAGAL:", e.message);
  process.exit(1);
});
