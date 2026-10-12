import type { Service } from "./data";

export interface ServiceStep {
  title: string;
  description: string;
}
export interface ServiceFaq {
  question: string;
  answer: string;
}

/** Konten detail yang bisa diatur admin (tabel `services`, lihat supabase/setup.sql). */
export interface ServiceDetails {
  longDescription: string; // paragraf dipisah baris kosong
  includes: string[]; // "Yang Anda dapatkan"
  steps: ServiceStep[]; // tahapan pengerjaan
  tips: string[]; // tips sebelum memesan
  faqs: ServiceFaq[];
  images: string[]; // foto layanan (URL), tampil di bawah informasi layanan
}

export type ServiceFull = Service & ServiceDetails;

const categoryDefaults: Record<string, Partial<ServiceDetails>> = {
  seragam: {
    steps: [
      { title: "Konsultasi & desain", description: "Diskusikan model, warna, bahan, dan jumlah seragam yang dibutuhkan beserta logo atau identitas perusahaan." },
      { title: "Pengukuran & sampel", description: "Pengukuran ukuran per karyawan atau penetapan size chart, lalu pembuatan sampel untuk disetujui." },
      { title: "Produksi massal", description: "Setelah sampel disetujui, pakaian diproduksi massal dengan standar kualitas yang konsisten." },
      { title: "Quality control & pengiriman", description: "Pengecekan jahitan, ukuran, dan sablon/bordir tiap unit, lalu dikemas rapi untuk dikirim." },
    ],
    tips: [
      "Siapkan logo perusahaan dalam format vektor (AI, CDR, SVG) agar hasil sablon/bordir tajam.",
      "Berikan daftar ukuran per orang untuk meminimalkan ketidaksesuaian.",
      "Pesan minimal 2 minggu sebelum tanggal distribusi untuk hasil terbaik.",
    ],
  },
  kaos: {
    steps: [
      { title: "Pemilihan bahan & warna", description: "Pilih jenis bahan (cotton combed 20s/24s/30s, polyester, dll) dan warna kaos sesuai kebutuhan." },
      { title: "Desain & mockup", description: "Buat desain kaos dan susun mockup untuk preview warna, letak sablon, dan detail." },
      { title: "Pemotongan & penjahitan", description: "Bahan dipotong sesuai pola, lalu dijahit menjadi kaos dengan standar konveksi." },
      { title: "Finishing & sorting", description: "Quality control, penyortiran ukuran, dan pengemasan rapi siap kirim." },
    ],
    tips: [
      "Tentukan jumlah per ukuran (S, M, L, XL) agar proporsional.",
      "Untuk acara tertentu, siapkan desain paling lambat 1 minggu sebelum produksi.",
      "Pilih bahan sesuai iklim: cotton combed untuk daerah tropis lebih nyaman.",
    ],
  },
  kemeja: {
    steps: [
      { title: "Pemilihan bahan & model", description: "Pilih bahan kemeja (katun, linen, stretch) dan model (kerah, lengan, saku)." },
      { title: "Pola & pengukuran", description: "Pembuatan pola dasar atau pengukuran individual untuk hasil yang presisi." },
      { title: "Penjahitan detail", description: "Penjahitan kemeja dengan perhatian khusus pada kerah, manset, saku, dan placket." },
      { title: "Penyetrikaan & pengecekan", description: "Finishing setrika profesional dan pengecekan detail jahitan per unit." },
    ],
    tips: [
      "Sebutkan preferensi model: slim fit, regular fit, atau loose fit.",
      "Untuk kemeja seragam, tentukan panjang lengan (panjang/pendek) sejak awal.",
      "Bawa referensi model kemeja yang disukai untuk menyesuaikan pola.",
    ],
  },
  jaket: {
    steps: [
      { title: "Konsultasi desain & bahan", description: "Pilih jenis jaket (bomber, parka, hoodie, varsity) dan bahan (fleece, drill, canvas, kulit sintetis)." },
      { title: "Pembuatan pola & sampel", description: "Pola dibuat sesuai desain, lalu sampel jaket dijahit untuk uji coba ukuran dan bahan." },
      { title: "Produksi & detail", description: "Produksi massal dengan detail seperti resleting, saku, hoodie, dan bordir/logo." },
      { title: "QC akhir & pengemasan", description: "Pemeriksaan kekuatan jahitan, resleting, dan ukuran sebelum dikemas." },
    ],
    tips: [
      "Jaket dengan lapisan membutuhkan waktu pengerjaan lebih lama.",
      "Untuk hoodie sweater, tentukan ketebalan bahan fleece yang diinginkan.",
      "Pastikan desain logo sudah final sebelum bordir dilakukan.",
    ],
  },
  jas: {
    steps: [
      { title: "Konsultasi & pengukuran detail", description: "Pengukuran menyeluruh (bahu, dada, pinggang, panjang lengan/jas) dengan perhitungan proporsi badan." },
      { title: "Pemilihan kain & furing", description: "Pilih bahan jas (wool, semi-wool, suiting) dan warna furing yang serasi." },
      { title: "Penjahitan bertahap & fitting", description: "Penjahitan jas dengan tahapan fitting di tengah proses untuk penyesuaian." },
      { title: "Finishing presisi", description: "Penyetrikaan uap, pengecekan lapisan, dan penyesuaian detail akhir." },
    ],
    tips: [
      "Pakai kemeja dan sepatu yang akan dipakai bersamanya saat pengukuran.",
      "Tentukan acara (kantor, pernikahan, wisuda) agar model dan warna sesuai.",
      "Jas formal membutuhkan minimal 10 hari kerja untuk hasil presisi.",
    ],
  },
  celana: {
    steps: [
      { title: "Model & pengukuran", description: "Tentukan model celana (chino, jeans, slacks, rok) dan ukuran pinggang, pinggul, panjang." },
      { title: "Pemilihan bahan", description: "Pilih bahan sesuai model: twill, jeans, suiting, atau katun stretch." },
      { title: "Penjahitan detail", description: "Penjahitan dengan perhatian pada saku, resleting, lipatan pinggang, dan keliman." },
      { title: "Finishing & pengecekan ukuran", description: "Pengecekan jahitan kuat, ukuran sesuai, dan penyetrikaan rapi." },
    ],
    tips: [
      "Tentukan preferensi potongan: slim, straight, atau regular.",
      "Celana dengan stretch lebih nyaman untuk mobilitas tinggi.",
      "Berikan panjang inseam (dari selangkangan) jika ingin hasil presisi.",
    ],
  },
  sablon: {
    steps: [
      { title: "Review desain & setup", description: "Cek resolusi desain, pemisahan warna, dan pembuatan screen untuk setiap warna." },
      { title: "Pemilihan media sablon", description: "Pilih jenis tinta (rubber, plastisol, discharge, glitter) sesuai bahan dan tampilan yang diinginkan." },
      { title: "Proses penyablonan", description: "Penyablonan manual dengan screen frame, tekanan dan suhu sesuai tinta." },
      { title: "Pemanasan & QC", description: "Pengeringan dengan heater untuk ketahanan tinta, lalu pengecekan kerapatan hasil sablon." },
    ],
    tips: [
      "Kirim desain dalam format PNG transparan atau AI/CDR untuk hasil terbaik.",
      "Semakin banyak warna yang dipakai, semakin lama pengerjaan dan semakin mahal biaya setup.",
      "Test wash tersedia untuk memastikan sablon tahan luntur.",
    ],
  },
  bordir: {
    steps: [
      { title: "Digitizing desain", description: "Desain logo dikonversi menjadi pola jahitan mesin bordir dengan setting warna dan density." },
      { title: "Setup mesin & frame", description: "Persiapan mesin bordir, pemilihan warna benang, dan penempatan kain pada frame." },
      { title: "Proses bordir", description: "Mesin membordir logo sesuai file digitizing dengan kecepatan terkontrol." },
      { title: "Finishing & pembersihan", description: "Pemangkasan benang sisa, pengecekan kerapian bordiran, dan setrika tempel bila perlu." },
    ],
    tips: [
      "Desain dengan garis tegas dan minimum detail halus lebih cocok untuk bordir.",
      "Sediakan file vektor logo (AI/CDR/SVG) untuk hasil digitizing maksimal.",
      "Bordir lebih tahan lama dibanding sablon untuk pencucian rutin.",
    ],
  },
  merchandise: {
    steps: [
      { title: "Brainstorming & konsep", description: "Diskusi jenis merchandise, target pasar, tema acara/brand, dan budget." },
      { title: "Desain & mockup 3D", description: "Pembuatan desain visual dan mockup produk untuk preview sebelum produksi." },
      { title: "Produksi & branding", description: "Produksi barang sesuai spesifikasi, termasuk penambahan logo via sablon, bordir, atau embos." },
      { title: "Packaging & pengiriman", description: "Pengemasan custom sesuai tema, quality control, dan pengiriman tepat waktu." },
    ],
    tips: [
      "Pilih merchandise yang sesuai target audiens dan budget.",
      "Semakin cepat order, semakin leluasa variasi desain dan pilihan barang.",
      "Kemas merchandise dengan kemasan menarik agar nilai brand makin tinggi.",
    ],
  },
  grosir: {
    steps: [
      { title: "Konsultasi kebutuhan & MOQ", description: "Diskusi jumlah pesanan, variasi model, target harga, dan jadwal pengiriman." },
      { title: "Sampel & penetapan standar", description: "Pembuatan sampel acuan kualitas (jahitan, bahan, ukuran) untuk disepakati." },
      { title: "Produksi massal terjadwal", description: "Produksi dalam batch dengan QC terjadwal di setiap tahap pemotongan, jahit, dan finishing." },
      { title: "Sorting, QC akhir, & ekspedisi", description: "Penyortiran per ukuran, pemeriksaan acak, dan pengiriman dalam jumlah besar." },
    ],
    tips: [
      "Semakin besar jumlah pesanan, semakin efisien harga satuan.",
      "Pesan jauh-jauh hari sebelum musim atau acara puncak untuk menghindari antrean.",
      "Pastikan size chart sudah final sebelum produksi skala besar dimulai.",
    ],
  },
  desain: {
    steps: [
      { title: "Konsultasi kebutuhan brand", description: "Gali identitas brand, nilai yang ingin ditonjolkan, dan target pengguna produk." },
      { title: "Konsep desain & sketsa", description: "Buat sketsa awal, moodboard bahan, dan pilihan palet warna." },
      { title: "Pembuatan sampel pertama", description: "Produksi sampel pertama berdasarkan desain final untuk evaluasi." },
      { title: "Revisi & finalisasi sampel", description: "Perbaiki sampel berdasarkan feedback hingga mendapat persetujuan untuk produksi." },
    ],
    tips: [
      "Kumpulkan referensi model yang disukai untuk mempercepat penentuan konsep.",
      "Satu sesi revisi sudah termasuk, revisi lebih dari itu terpisah.",
      "Sampel yang sudah disetujui akan menjadi acuan produksi massal.",
    ],
  },
};

const genericFaqs: ServiceFaq[] = [
  {
    question: "Berapa minimal jumlah pesanan untuk konveksi?",
    answer:
      "Minimal order bervariasi tergantung jenis layanan. Untuk sablon/bordir mulai dari 12 pcs, untuk produksi massal biasanya mulai dari 50 pcs per model. Konsultasikan kebutuhanmu lewat WhatsApp untuk penawaran terbaik.",
  },
  {
    question: "Apakah bisa request model custom sendiri?",
    answer:
      "Bisa. Kami menerima model custom sesuai referensi foto atau sketsa yang kamu berikan. Untuk hasil presisi, sebaiknya diawali dengan pembuatan sampel terlebih dahulu.",
  },
  {
    question: "Bagaimana cara memantau progres pesanan?",
    answer:
      "Tanyakan progres pesanan kapan saja lewat WhatsApp kami. Cukup sebutkan nama pemesan atau nomor order, dan kami akan berikan update beserta dokumentasi foto.",
  },
  {
    question: "Apakah ada garansi untuk hasil produksi?",
    answer:
      "Kami memberikan garansi perbaikan untuk cacat produksi (jahitan lepas, ukuran meleset dari sample, sablon luntur) dalam 7 hari setelah barang diterima.",
  },
  {
    question: "Bagaimana kalau hasilnya tidak sesuai sampel?",
    answer:
      "Jika ditemukan ketidaksesuaian dengan sampel yang sudah disetujui, kami memperbaiki atau mengganti ulang secara gratis sesuai kesepakatan.",
  },
];

const serviceDefaults: Record<string, Partial<ServiceDetails>> = {
  "seragam-perusahaan": {
    longDescription:
      "Layanan pembuatan seragam kerja perusahaan dalam jumlah custom. Tersedia model seragam kantor (kemeja, celana, rok, blazer) hingga seragam lapangan (wearpack, safety). Lengkap dengan bordir atau sablon logo perusahaan sesuai identitas brand.\n\nSetiap unit melewati proses quality control standar konveksi: jahitan kuat, ukuran sesuai size chart, dan kerapian detail. Bisa request cutting slim fit, regular fit, atau menyesuaikan budaya perusahaan.",
    includes: [
      "Konsultasi model & bahan seragam",
      "Pilihan bahan premium (katun, twill, drill, suiting)",
      "Bordir / sablon logo perusahaan",
      "Size chart per individu atau standar S/M/L/XL",
      "Sampel 1 unit sebelum produksi massal",
      "Quality control tiap unit & pengemasan per karyawan",
    ],
    faqs: [
      { question: "Berapa lama pengerjaan 100 set seragam?", answer: "Rata-rata 7-14 hari kerja, tergantung kompleksitas model, jumlah bordir, dan ketersediaan bahan. Untuk urgent bisa ditanyakan via WhatsApp." },
      { question: "Apakah bisa pesan sample dulu sebelum massal?", answer: "Tentu. Kami sarankan selalu order sample acuan (dibayar terpisah) agar hasil sesuai ekspektasi sebelum jumlah banyak diproduksi." },
    ],
  },
  "seragam-sekolah": {
    longDescription:
      "Pembuatan seragam sekolah untuk tingkat SD, SMP, SMA, maupun pesantren. Tersedia seragam pramuka, seragam olahraga, batik sekolah, dan seragam khusus acara. Jahitan kuat dan nyaman dipakai sehari-hari oleh anak-anak.\n\nKami menerima pesanan dari sekolah yayasan maupun kelompok orang tua murid. Bahan dipilih yang adem, mudah dicuci, dan warna tidak mudah pudar meski sering dipakai.",
    includes: [
      "Model seragam sesuai ketentuan sekolah",
      "Bahan pilihan yang adem & tahan lama",
      "Logo sekolah & nomor induk via bordir/sablon",
      "Size chart per kelas atau individu",
      "Finishing rapi & setrika",
    ],
    faqs: [
      { question: "Apakah ukuran bisa custom per anak?", answer: "Bisa. Kami menyediakan lembar ukur agar setiap murid diukur secara individu, sehingga hasilnya lebih pas." },
      { question: "Berapa minimal order seragam sekolah?", answer: "Minimal 30 pcs per model. Untuk pesanan kelas atau kelompok kecil bisa diatur bersama via WhatsApp." },
    ],
  },
  "seragam-wearpack": {
    longDescription:
      "Pembuatan wearpack dan seragam kerja lapangan untuk teknisi, pekerja bengkel, konstruksi, manufaktur, dan warehouse. Bahan kuat, anti-robek, dilengkapi multiple saku untuk perkakas, serta pilihan warna safety (orange, kuning, hijau) sesuai standar proyek.\n\nTersedia juga setelan celana + baju serta overall. Bisa ditambahkan reflector strip dan nama bordir per pekerja untuk keperluan identitas di area lapangan.",
    includes: [
      "Bahan drill / canvas / American drill pilihan",
      "Lengan panjang / pendek sesuai kebutuhan",
      "Saku alat kerja multiple di baju dan celana",
      "Reflector strip opsional untuk keselamatan",
      "Bordir nama, logo perusahaan, dan ID karyawan",
    ],
    faqs: [
      { question: "Apakah wearpack tahan terhadap noda minyak?", answer: "Kami menyarankan bahan drill atau duck canvas yang lebih mudah dibersihkan untuk area berminyak." },
      { question: "Bisa buat overall (terusan)?", answer: "Bisa. Model overall, setelan celana+baju, dan rompi safety semuanya tersedia." },
    ],
  },
  "kaos-custom": {
    longDescription:
      "Kaos custom sablon untuk komunitas, kampanye, event, merchandise brand, sampai UMKM. Bahan tersedia mulai dari cotton combed 24s, 30s, tri-blend, sampai dry-fit untuk keperluan olahraga.\n\nSablon rubber, plastisol, atau discharge sesuai tampilan yang diinginkan. Cetak depan, belakang, dan lengan bisa dengan desain berbeda. Pantone color matching tersedia untuk standar brand.",
    includes: [
      "Free revisi mockup desain sablon",
      "Pilihan bahan cotton combed / dry-fit / polyester",
      "Sablon depan + belakang (opsional lengan)",
      "Size run S, M, L, XL, XXL",
      "Label custom / neck tag opsional",
    ],
    faqs: [
      { question: "Minimal berapa pcs untuk sablon custom?", answer: "Minimal 12 pcs per desain. Dibawah itu biaya setup screen per warna relatif lebih mahal." },
      { question: "Apakah sablon luntur saat dicuci?", answer: "Tidak, asalkan dicuci dengan deterjen biasa (bukan pemutih). Kami menggunakan tinta berkualitas dan proses curing panas standar industri." },
    ],
  },
  "kaos-polo-shirt": {
    longDescription:
      "Polo shirt (kerah) untuk seragam kantor semi-formal, tim olahraga, komunitas golf, dan merchandise brand eksklusif. Bahan lacoste pique, cotton pique, atau dri-fit polo dengan jahitan kerah rapi tidak mudah melar.\n\nLogo bisa diletakkan di dada kiri via bordir untuk tampilan yang lebih premium. Tersedia pilihan warna solid klasik (putih, hitam, navy, abu, maroon).",
    includes: [
      "Bahan lacoste / pique cotton pilihan",
      "Kerah 2 ply tidak mudah melar",
      "Bordir logo di dada (opsional sablon)",
      "Lengan pendek atau panjang sesuai request",
      "Finishing setrika rapi",
    ],
    faqs: [
      { question: "Apakah bisa request warna custom?", answer: "Warna custom tersedia untuk pesanan 100 pcs ke atas. Dibawah itu pilih dari katalog warna ready stock." },
      { question: "Model wanita ada potongan khusus?", answer: "Ada. Ladies cut memiliki lekukan pinggang dan lingkar bahu yang lebih ramping dibanding men's cut." },
    ],
  },
  "kemeja-custom": {
    longDescription:
      "Kemeja custom pria dan wanita, baik untuk seragam kantor, batik korporat, kemeja acara, maupun setelan keluarga. Model kerah reguler, mandarin, atau slim fit sesuai preferensi. Bahan katun, linen, batik tulis, atau batik cap premium.\n\nDetail per jahitan diperhatikan: kerah tidak miring, manset pas, saku dada simetris, dan jahitan samping lurus. Cocok untuk tampilan formal maupun smart-casual.",
    includes: [
      "Pilihan bahan katun / linen / batik / stretch",
      "Model kerah, manset, saku bisa custom",
      "Kancing logo atau kancing polos premium",
      "Monogram nama inisial (opsional)",
      "Finishing setrika profesional",
    ],
    faqs: [
      { question: "Apakah bisa jahit sesuai pengukuran badan?", answer: "Bisa, untuk order sample atau jumlah kecil. Untuk seragam massal menggunakan size chart standar yang disetujui." },
      { question: "Berapa lama pengerjaan kemeja batik?", answer: "Batik membutuhkan waktu lebih lama karena pemotongan motif harus simetris. Estimasi 7-10 hari kerja." },
    ],
  },
  "jaket-custom": {
    longDescription:
      "Jaket custom untuk kebutuhan komunitas motor, universitas, perusahaan, brand streetwear, dan acara outdoor. Tipe bomber, varsity, parka, trucker, canvas kerja. Bisa ditambahkan bordir patch di lengan, dada, dan punggung.\n\nBahan tersedia drill, canvas, nylon taslan, hingga fleece tebal untuk musim hujan. Detail resleting YKK, saku dalam, dan hoodie yang bisa dilepas tersedia sebagai add-on.",
    includes: [
      "Pilihan model bomber, varsity, parka, trucker, canvas",
      "Bahan drill / canvas / nylon / taslan tebal",
      "Resleting berkualitas dan saku fungsional",
      "Bordir / patch logo sesuai desain",
      "Lapisan furing adem opsional",
    ],
    faqs: [
      { question: "Apakah jaket bisa waterproof?", answer: "Untuk daya tahan air ringan pilih bahan taslan atau nylon. Jaket bukan jaket outdoor profesional. Hujan deras tetap memerlukan jas hujan terpisah." },
      { question: "Patch bordir apakah bisa dilepas pasang?", answer: "Ada opsi velcro patch (opsional) untuk patch yang ingin sering diganti-ganti." },
    ],
  },
  "jaket-hoodie-sweater": {
    longDescription:
      "Hoodie dan sweater fleece custom untuk merchandise band, komunitas, kampus, sampai brand fashion lokal. Bahan fleece 240-320 GSM pilihan agar hangat namun tidak gerah. Tersedia model hoodie (dengan topi), crewneck (tanpa topi), dan zip-up hoodie.\n\nSablon jumbo di bagian punggung atau DTG print detail halus di bagian depan menjadi pilihan customer. Ukuran uniseks, dari XS sampai XXXL bisa tersedia.",
    includes: [
      "Bahan fleece tebal 240-320 GSM",
      "Karet pinggang dan manset rib kuat",
      "Tali hoodie premium warna custom",
      "Sablon / DTG print / bordir sesuai desain",
      "Size run XS s/d XXXL",
    ],
    faqs: [
      { question: "Apakah fleece mudah berbulu?", answer: "Kami menggunakan fleece kualitas baik anti-pilling (tidak mudah muncul bulu halus) setelah beberapa kali pencucian." },
      { question: "Apa bedanya hoodie zip-up dan oversize?", answer: "Zip-up punya resleting di depan, model oversize lebih loose dipakai dan sedang tren di kalangan anak muda. Keduanya bisa dibuat sesuai request." },
    ],
  },
  "jas-blazer": {
    longDescription:
      "Pembuatan jas dan blazer formal dengan pengukuran presisi. Model jas pria single/double breast, blazer wanita, jas almamater wisuda, jas pengantin beserta setelan celana dan rok. Bahan suiting wool, semi-wool, dan premium stretch.\n\nProses fitting 2 tahap (setelah potong badan + sebelum finishing) untuk menjamin potongan sesuai bentuk badan. Detail jas: lapisan furing, saku dalam, kerah notched/peak lapel sesuai selera.",
    includes: [
      "Pengukuran badan detail lebih dari 12 titik",
      "Pilihan kain suiting lokal & import",
      "Fitting 2 tahap untuk presisi",
      "Kancing & aksesoris premium",
      "Setrika uap finishing profesional",
    ],
    faqs: [
      { question: "Saya butuh jas untuk acara pernikahan, berapa lama?", answer: "Minimal 10-14 hari kerja. Disarankan konsultasi 3 minggu sebelum acara untuk menghindari rush dan memberi ruang revisi." },
      { question: "Apakah jas bisa dibuat slim-fit?", answer: "Tentu. Potongan slim-fit, modern-fit, dan classic-fit semua tersedia, disesuaikan bentuk badan dan kenyamanan acara." },
    ],
  },
  "celana-custom": {
    longDescription:
      "Pembuatan celana custom pria dan wanita dengan model chino, slacks, jeans, cargo, kulot, dan rok kerja. Sesuai untuk seragam kantor, sekolah, komunitas, sampai fashion personal. Bisa request detail pleats (lipatan di depan), cuff (lipatan ujung), dan saku cargo.\n\nUkuran dibuat menyesuaikan tinggi dan bentuk badan: slim-fit, straight-cut, atau regular. Jahitan saku dalam kuat dan tidak mudah sobek meski sering dipakai.",
    includes: [
      "Pilihan bahan: twill, chino, jeans, suiting, katun stretch",
      "Potongan slim / straight / regular sesuai pesanan",
      "Saku depan & belakang, bisa request saku cargo",
      "Resleting berkualitas kuat",
      "Finishing setrika & pembersihan benang sisa",
    ],
    faqs: [
      { question: "Apakah bisa jahit celana sesuai tinggi badan 150 cm dan 185 cm?", answer: "Bisa. Buat size chart khusus berdasarkan rata-rata tinggi pemakai. Setiap panjang kaki bisa disesuaikan." },
      { question: "Ada saku untuk HP di celana kerja?", answer: "Bisa. Kami menambahkan saku HP samping yang tersembunyi dan saku punggung ganda sesuai request." },
    ],
  },
  "sablon-custom": {
    longDescription:
      "Layanan penyablonan kaos, polo, jaket, totebag, topi, dan berbagai media kain lainnya. Teknik sablon manual screen printing untuk hasil tahan lama. Jenis tinta rubber, plastisol, discharge, puff (timbul), reflective, dan glitter.\n\nPelayanan berlaku untuk kaos customer (bawa bahan sendiri) maupun yang memesan bahan dari tempat kami. Minimum order terjangkau, cocok untuk event kecil dan komunitas.",
    includes: [
      "Free setup desain & mockup preview",
      "Tinta pilihan: rubber, plastisol, discharge, puff, reflective",
      "Pisah per warna dengan screen frame stainless",
      "Proses curing pemanasan agar tinta awet",
      "Test cuci (untuk order besar) opsional",
    ],
    faqs: [
      { question: "Bisa sablon di kain bahan sendiri?", answer: "Bisa. Kirim sample kain dulu untuk uji tinta, karena setiap jenis kain menyerap tinta berbeda." },
      { question: "Apa maksimal warna dalam 1 desain?", answer: "Tidak ada batasan, tapi setiap warna menambah screen dan biaya setup. Untuk desain dengan gradasi lebih ekonomis pakai DTG print (bisa tanya opsinya)." },
    ],
  },
  "bordir-custom": {
    longDescription:
      "Layanan bordir komputer untuk logo perusahaan, nama seragam, patch komunitas, emblem sekolah, lambang organisasi, dan inisial nama pada kemeja/jas. Mesin bordir multi-head sehingga hasil konsisten rapi dalam jumlah besar.\n\nHasil bordir memiliki kesan premium dibanding sablon dan tahan ratusan kali pencucian. Cocok untuk logo seragam kantor, nama dada karyawan, dan patch lepas velcro.",
    includes: [
      "Digitizing logo format bordir (pembuatan pola jahit)",
      "Pilihan benang polyester berkualitas tahan luntur",
      "Bordir 1 sisi atau multi lokasi (dada, lengan, leher belakang)",
      "Patch bordir lem atau velcro tersedia",
      "Finishing pembersihan benang sisa & setrika tempel",
    ],
    faqs: [
      { question: "Apakah file PNG biasa bisa langsung dibordir?", answer: "Perlu dikonversi dulu ke file bordir (digitizing). Kami bantu prosesnya, kirim saja file PNG/AI logo kamu." },
      { question: "Bisa bordir nama per orang berbeda-beda?", answer: "Bisa. Harga per nama berbeda dari logo massal. Daftarkan nama-namanya di file excel untuk kecepatan input." },
    ],
  },
  "merchandise-custom": {
    longDescription:
      "Jasa pembuatan merchandise brand, merch band, merchandise perusahaan, souvenir acara (seminar, pernikahan, gathering), dan hampers lebaran. Produk mulai dari apparel (kaos, topi, totebag) sampai barang non-apparel (tumbler, gantungan kunci, pulpen custom, notebook).\n\nKami menangani end-to-end: dari brainstorming ide merch sesuai budget, desain grafis, produksi, sampai packaging custom. Cocok untuk UMKM, startup, dan panitia acara.",
    includes: [
      "Konsultasi konsep merch & budget",
      "Desain grafis produk & mockup 3D",
      "Produksi apparel + non-apparel terpadu",
      "Custom packaging (box, stiker, thank you card)",
      "Quality control & pengiriman tepat jadwal acara",
    ],
    faqs: [
      { question: "Saya tidak punya desain, apakah bisa dibantu buat?", answer: "Bisa. Kami tim desainer internal siap membantu dari konsep sampai final file produksi." },
      { question: "Minimal berapa unit untuk merchandise acara?", answer: "Tergantung jenis barang. Apparel mulai 24 pcs, tumbler mulai 50 pcs, gantungan kunci mulai 100 pcs. Konsultasikan paketnya." },
    ],
  },
  "grosir-produksi-massal": {
    longDescription:
      "Layanan produksi pakaian massal (MOQ mulai 500 pcs per model) untuk reseller, toko fashion online, brand lokal, dan distributor. Kapasitas produksi hingga ribuan pcs per bulan dengan lead time yang dapat dijadwalkan.\n\nProses transparan: cutting sheet, laporan progres mingguan, QC sampling di setiap tahap. Standar ekspor bisa diatur sesuai target pasar (lokal atau ekspor).",
    includes: [
      "Sourcing bahan harga grosir langsung dari pabrik",
      "Pola gradasi ukuran full size range",
      "Produksi batch besar dengan QC terjadwal",
      "Label woven, hangtag, polybag per unit",
      "Laporan produksi & dokumentasi foto",
    ],
    faqs: [
      { question: "Berapa kapasitas produksi per bulan?", answer: "Hingga 5.000-10.000 pcs per bulan tergantung kompleksitas model. Konsultasikan kebutuhan untuk jadwal yang pasti." },
      { question: "Bisa buat brand sendiri dengan label saya?", answer: "Tentu (private label / OEM). Kami sediakan pembuatan woven label, hangtag, dan kemasan custom brand kamu." },
    ],
  },
  "desain-custom-sample": {
    longDescription:
      "Jasa konsultasi desain busana + pembuatan sampel pertama sebelum kamu memutuskan produksi massal. Cocok untuk desainer muda, startup fashion baru, dan brand yang ingin test market koleksi terbaru.\n\nTahapan konsultasi desain (tren warna, moodboard bahan, sketsa tech pack) → pembuatan pola → sample jahit → revisi 1x. Hasil akhir sample dan pola bisa dipakai untuk produksi di tempat mana saja.",
    includes: [
      "Sesi konsultasi desain 1-2x pertemuan / call",
      "Moodboard & sketsa ilustrasi koleksi",
      "Tech pack spesifikasi detail (bahan, ukuran, jahitan)",
      "Pembuatan pola gradasi dasar",
      "Sample jahit 1 ukuran + 1x revisi gratis",
    ],
    faqs: [
      { question: "Apakah desainnya menjadi milik saya?", answer: "Ya. Seluruh hak cipta desain, pola, dan file tech pack menjadi milik kamu setelah pembayaran lunas." },
      { question: "Berapa lama dari desain sampai sample jadi?", answer: "Rata-rata 3-7 hari kerja, tergantung tingkat kerumitan desain dan ketersediaan bahan." },
    ],
  },
};
const notEmpty = (v: unknown): boolean =>
  Array.isArray(v) ? v.length > 0 : typeof v === "string" ? v.trim().length > 0 : v != null;

function pick<K extends keyof ServiceDetails>(
  key: K,
  raw: Partial<ServiceDetails>,
  id: string,
  category: Service["category"]
): ServiceDetails[K] {
  const fromRaw = raw[key];
  if (notEmpty(fromRaw)) return fromRaw as ServiceDetails[K];
  const fromService = serviceDefaults[id]?.[key];
  if (notEmpty(fromService)) return fromService as ServiceDetails[K];
  const fromCategory = categoryDefaults[category]?.[key];
  if (notEmpty(fromCategory)) return fromCategory as ServiceDetails[K];
  return (key === "faqs" ? genericFaqs : key === "longDescription" ? "" : []) as ServiceDetails[K];
}

export function withDetails(base: Service, raw: Partial<ServiceDetails> = {}): ServiceFull {
  const detail: ServiceDetails = {
    longDescription: pick("longDescription", raw, base.id, base.category) || base.description,
    includes: pick("includes", raw, base.id, base.category),
    steps: pick("steps", raw, base.id, base.category),
    tips: pick("tips", raw, base.id, base.category),
    faqs: pick("faqs", raw, base.id, base.category),
    images: cleanImages(raw.images),
  };
  return { ...base, ...detail };
}
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function cleanList(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.map(str).filter(Boolean).slice(0, 30);
}
export function cleanSteps(v: unknown): ServiceStep[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x: any) => ({ title: str(x?.title), description: str(x?.description) }))
    .filter((x) => x.title)
    .slice(0, 20);
}
export function cleanFaqs(v: unknown): ServiceFaq[] {
  if (!Array.isArray(v)) return [];
  return v
    .map((x: any) => ({ question: str(x?.question), answer: str(x?.answer) }))
    .filter((x) => x.question && x.answer)
    .slice(0, 20);
}
/** Bucket storage untuk foto layanan dan batas jumlah foto per layanan. */
export const SERVICE_IMAGES_BUCKET = "service-images";
export const MAX_SERVICE_IMAGES = 6;
const SERVICE_IMAGES_MARKER = `/storage/v1/object/public/${SERVICE_IMAGES_BUCKET}/`;

/** Hanya terima URL https/http dari bucket foto layanan kita (bukan link bebas dari luar). */
export function cleanImages(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v
    .map(str)
    .filter((u) => u.length > 0 && u.length <= 600 && /^https?:\/\//i.test(u) && u.includes(SERVICE_IMAGES_MARKER))
    .slice(0, MAX_SERVICE_IMAGES);
}

/** Path objek di bucket dari URL publiknya; null kalau bukan dari bucket kita. */
export function serviceImagePath(url: string): string | null {
  const i = url.indexOf(SERVICE_IMAGES_MARKER);
  if (i === -1) return null;
  return decodeURIComponent(url.slice(i + SERVICE_IMAGES_MARKER.length).split("?")[0]);
}

export const listToText = (list: string[]) => list.join("\n");
export const textToList = (text: string) => cleanList(text.split("\n"));

function pairsToText(rows: [string, string][]) {
  return rows.map(([a, b]) => `${a} | ${b}`).join("\n");
}
function textToPairs(text: string): [string, string][] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const i = line.indexOf("|");
      return i === -1 ? [line, ""] : [line.slice(0, i).trim(), line.slice(i + 1).trim()];
    }) as [string, string][];
}

export const stepsToText = (steps: ServiceStep[]) =>
  pairsToText(steps.map((s) => [s.title, s.description]));
export const textToSteps = (text: string): ServiceStep[] =>
  textToPairs(text).map(([title, description]) => ({ title, description }));

export const faqsToText = (faqs: ServiceFaq[]) =>
  pairsToText(faqs.map((f) => [f.question, f.answer]));
export const textToFaqs = (text: string): ServiceFaq[] =>
  textToPairs(text).map(([question, answer]) => ({ question, answer }));