# JahitPakaian.com — Konveksi & Produksi Pakaian

Website usaha konveksi berbasis web, dibangun dengan **Next.js 14 (App Router)**, **TypeScript**, **TailwindCSS**, dan **Supabase**.

---

## ✨ Fitur Utama

### 🌐 Website Publik

- 🏠 **Beranda** — Hero, statistik, kategori & layanan unggulan, cara kerja, portofolio, dan CTA.
- 🧵 **Layanan** — Katalog produk konveksi dengan **tab kategori**, pencarian, dan foto produk. Semua dibaca dari database:
  - Seragam, Kaos & Polo, Kemeja, Jaket & Hoodie, Jas & Blazer, Celana
  - Sablon, Bordir, Merchandise
  - Produksi Massal / Grosir, Custom Design & Sample
  - (kategori bisa ditambah/diubah sendiri oleh admin)
- 🔧 **Cara Kerja** — Alur konsultasi, sampel, produksi, sampai pengiriman.
- 📸 **Hasil Produksi** — Galeri portofolio (desain & hasil jadi).
- ❓ **FAQ**
- 📞 **Hubungi Kami** — Form kontak; pertanyaan dikirim lewat WhatsApp.
- 💬 **Pemesanan via WhatsApp** — Tombol "Pesan Konveksi" membuka WhatsApp dengan pesan yang sudah terisi.

---

## 🛠️ Panel Admin

Panel admin tersedia di `/admin`. Saat ini sistem menggunakan **satu admin**.

### Menu Admin

- 🧵 **Layanan** — Tambah/edit/hapus layanan konveksi:
  - **Foto produk**: unggah hingga 6 foto per layanan (otomatis diperkecil di browser), foto pertama jadi foto utama.
  - **Kelola Kategori**: tambah, ubah nama/deskripsi/ikon, atur urutan tab, dan hapus kategori.
  - Konten detail: penjelasan, yang didapat, tahapan produksi, tips, dan FAQ.
- 🖼️ **Foto Website** — Atur gambar beranda dan galeri hasil produksi.
- ⚙️ **Pengaturan** — Kontak bisnis, media sosial, lokasi peta, logo/favicon, dan ukuran foto.
- 🔑 **Ganti Password** — Dilengkapi indikator kekuatan password.

### Keamanan

- 🔒 **Sesi Login** — Berlaku selama **1 jam** menggunakan cookie `httpOnly`.
- Halaman admin tidak menampilkan navbar/footer website publik.

---

# 🚀 Mulai Cepat

## Prasyarat

Pastikan sudah tersedia:

- **Node.js >= 18.17**
- **npm**

## 1. Install Dependencies

```bash
npm install
```

## 2. Salin Environment Variable

### macOS / Linux

```bash
cp .env.example .env.local
```

### Windows

```bat
copy .env.example .env.local
```

## 3. Isi `.env.local`

Lihat bagian [Environment](#️-environment) di bawah.

## 4. Jalankan Development Server

```bash
npm run dev
```

Kemudian buka:

```text
http://localhost:3000
```

---

## 📦 Build Produksi

```bash
npm run build
npm run start
```

---

# ⚙️ Environment

| Variabel | Wajib | Fungsi |
|---|:---:|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Ya | URL project Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ya | Anon key yang digunakan browser |
| `SUPABASE_SERVICE_ROLE_KEY` | Ya | Digunakan server untuk login admin dan pengaturan. **Jangan** diberi awalan `NEXT_PUBLIC_`. |
| `ADMIN_SESSION_SECRET` | Ya (produksi) | String acak panjang untuk menandatangani cookie sesi admin |
| `NEXT_PUBLIC_SITE_URL` | Ya (produksi) | Alamat website sebenarnya; digunakan pada tautan pesan WhatsApp |
| `ADMIN_RECOVERY_PASSWORD` | Opsional | Pemulihan darurat jika lupa password admin (minimal 8 karakter) |

> Kontak bisnis juga dapat diubah melalui **Admin → Pengaturan** tanpa melakukan redeploy.

> **Keamanan:** `.env` dan `.env.local` sudah ada di `.gitignore`. Jangan pernah melakukan commit terhadap file tersebut.

---

# 🗄️ Setup Database — Supabase

Cukup jalankan **satu file**: `supabase/setup.sql`, lewat **Supabase SQL Editor** (tempel seluruh isi, lalu Run).
File ini aman dijalankan berulang kali dan juga memperbarui database lama.

Yang dibuat/diperbarui:

| Bagian | Isi |
|---|---|
| `business_settings` | Pengaturan bisnis (kontak, sosial media, logo, peta) |
| `site_media` | Foto website (beranda & galeri) |
| `service_categories` | **Kategori layanan** (nama, deskripsi, ikon, urutan) — 11 kategori konveksi awal |
| `services` | Katalog layanan (kolom `images` untuk foto produk) — 15 layanan konveksi awal |
| `admin_users` | Akun admin |
| Storage | Bucket publik `site-media`, `brand-assets`, dan `service-images` (foto produk) |

### ⚠️ Memperbarui dari versi lama (permak/reparasi)

Menjalankan `setup.sql` akan:

- menghapus 13 layanan bawaan lama (permak, reparasi, resleting, aksesoris) berdasarkan id-nya,
- melepas batas kategori lama pada tabel `services`,
- menambahkan kolom `images` dan tabel `service_categories`,
- menonaktifkan kategori lama (`permak`, `reparasi`, `resleting`, `aksesoris`).

Layanan buatan admin sendiri **tidak dihapus**. Jika masih memakai kategori lama, pindahkan lewat **Admin → Layanan → Edit**.

> Foto di **Admin → Foto Website** memakai slot yang sama dengan versi lama. Unggah ulang foto yang masih bertema permak supaya sesuai dengan konveksi.

---

## 👤 Tabel `admin_users`

Login admin membaca tabel `admin_users`.

Buat tabel secara manual menggunakan SQL berikut:

```sql
create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'admin',
  full_name text,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

-- Tanpa policy: hanya service role yang bisa membaca/menulis.
```

### Membuat Hash Password

Buat hash bcrypt untuk password awal:

```bash
node -e "console.log(require('bcryptjs').hashSync('PASSWORD_AWAL_ANDA', 10))"
```

Kemudian masukkan hasil hash ke database:

```sql
insert into public.admin_users (username, password_hash, full_name)
values ('admin', '<HASH_DARI_PERINTAH_DI_ATAS>', 'Admin JahitPakaian');
```

> Setelah berhasil login, segera ganti password melalui **Admin → Ganti Password**.

---

# 🔑 Login Admin

Buka:

```text
/admin/login
```

Masukkan password admin.

Sistem saat ini hanya memiliki satu admin:

```text
username = admin
```

### Masa Berlaku Sesi

Sesi login berakhir setelah **1 jam**.

### Lupa Password

Jika lupa password:

1. Isi sementara `ADMIN_RECOVERY_PASSWORD`.
2. Login menggunakan password tersebut.
3. Ganti password melalui **Admin → Ganti Password**.
4. Hapus kembali variabel `ADMIN_RECOVERY_PASSWORD`.

---

# 📁 Struktur Proyek

```text
├── app/
│   ├── page.tsx
│   ├── layanan/
│   ├── cara-kerja/
│   ├── hasil-produksi/
│   ├── faq/
│   ├── hubungi-kami/
│   ├── admin/                     # Panel admin (layanan, media, pengaturan)
│   │   ├── login/
│   │   ├── password/
│   │   ├── services/
│   │   ├── media/
│   │   └── settings/
│   │
│   ├── api/
│   │   ├── admin-login/           # Sesi admin
│   │   ├── admin-logout/
│   │   └── secure/admin/...       # API admin (wajib sesi)
│   │
│   ├── globals.css
│   └── layout.tsx                 # Root layout + SiteChrome
│
├── components/
│   ├── admin/                     # CategoryManager, ServiceImageUploader, dll
│   ├── shared/                    # ServiceCatalog (tab kategori), ServiceGallery, dll
│   ├── layout/                    # Navbar, Footer,
│   │                               # SiteChrome, DashboardLayout
│   └── ui/                        # Button, Card, Input, Badge, dll
│
├── lib/
│   ├── adminSession.ts            # Cookie sesi (1 jam)
│   ├── adminAuth.ts               # Verifikasi & ganti password (bcrypt)
│   ├── services.ts
│   ├── categories.ts              # Kategori layanan (database + API admin)
│   ├── brand.ts                   # Nama & tagline usaha
│   ├── settings.ts
│   ├── data.ts
│   └── ...
│
├── middleware.ts                  # Proteksi /admin/*
├── supabase/
│   └── setup.sql                  # SQL database (satu file)
│
└── public/
```

---

# 🎨 Design System

| Elemen | Nilai | Kegunaan |
|---|---|---|
| Light BG | `#F6FAF8` | Background alternatif |
| Green | `#16A34A` | Primary (CTA, brand) |
| Dark Green | `#15803D` | Hover & link |
| Blue | `#2563EB` | Aksen sekunder |
| Text | `#172033` | Teks utama |
| Border | `#E2E8F0` | Border & garis |

### Border Radius

- `rounded-xl` — **12px** untuk tombol/input.
- `rounded-2xl` — **16px** untuk card/modal.

---

# 🛠️ Scripts

| Command | Deskripsi |
|---|---|
| `npm run dev` | Menjalankan development server di `localhost:3000` |
| `npm run build` | Membuat build produksi |
| `npm run start` | Menjalankan build produksi |
| `npm run lint` | Menjalankan ESLint |
| `npm run typecheck` | Menjalankan `tsc --noEmit` |

---

# 🔒 Catatan Keamanan

- Semua penulisan data sensitif (admin, pengaturan, layanan, kategori, foto) dilakukan melalui API server dengan service role.
- Browser tidak boleh menulis langsung ke tabel.
- Isi `ADMIN_SESSION_SECRET` dengan string acak yang panjang di production.
- Jangan commit `.env`.
- Jika `.env` pernah ter-commit, ganti seluruh key di dalamnya.

>>>>>>> f6a9214 (docs: improve README formatting)