# Danis Zaidan — Portfolio, edition 02

Remake lengkap dengan tema charcoal, sage, off-white, dan lime dari `../index.html`. Versi pertama tidak diubah.

## Buka

Buka **index.html** langsung di browser. Seluruh halaman, gambar, font, dan CV sudah lokal; tidak memerlukan framework atau proses build untuk melihat hasil.

Untuk preview melalui localhost:

```sh
cd version-2
npm start
```

Buka http://127.0.0.1:4173.

## Halaman

- `index.html` — home, selected work, about, services, playground, process, contact.
- `works.html` — 10 proyek, filter disiplin, dan pencarian.
- `works/{slug}/index.html` — 10 halaman studi kasus, galeri, informasi peran/teknologi, dan proyek berikutnya.
- `about.html` — biografi, pengalaman kerja, pendidikan, penghargaan, sertifikasi, dan minat pribadi.
- `expertise.html` — layanan, proses, toolkit, dan FAQ.
- `playground.html` — generative art yang dapat diatur dan diunduh sebagai PNG, serta eksperimen tipografi.
- `contact.html` — kontak langsung dan penyusun brief.
- `certificate.html` — 14 sertifikat/penghargaan, lightbox, dan tautan verifikasi sertifikat.
- `cv.html` — résumé, versi cetak, preview dokumen asli, dan unduhan PDF.

**Contact:** formulir menyiapkan draft melalui aplikasi email pengguna, bukan mengirim pesan lewat server. Ada preview dan tombol salin sebagai alternatif jika aplikasi email tidak terbuka. Tidak ada pesan yang dikirim otomatis.

## Struktur & edit

- `assets/style.css` — design system dan responsive layouts.
- `assets/app.js` — interaksi; HTML tetap dapat dibaca tanpa JavaScript.
- `assets/fonts.css`, `assets/fonts/` — font lokal dan lisensinya.
- `assets/images/` — gambar asli dari situs referensi.
- `assets/cv-danis-zaidan.pdf` — CV asli.
- `scripts/content.mjs` — teks dan metadata proyek, pengalaman, layanan, sertifikat.
- `scripts/build.mjs` — template halaman dan pembangkit HTML statis.
- `reference/` — snapshot konten dan pemetaan aset sumber.
- `qa/` — screenshot dan hasil pemeriksaan browser.

Setelah mengedit template atau konten:

```sh
npm run build
npm test
```

Untuk tes browser, jalankan server terlebih dahulu. Tes memakai Google Chrome yang terpasang:

```sh
npm ci
npm run test:browser
```

## Sumber konten

[Portfolio asli Danis Zaidan](https://daniszaidan.vercel.app/), termasuk About, Works, 10 studi kasus, CV, dan Certificate. Diambil 24 September 2026. Identitas, foto, karya, peran, riwayat kerja, dan sertifikat mengikuti sumber ini; copy diedit ulang untuk hierarki baru. Tidak ada metrik bisnis, testimonial, atau klien baru yang direkayasa. Mediku tetap disajikan sebagai preview karena sumber belum menerbitkan detail proyek.

Font: DM Sans, IBM Plex Mono, Instrument Serif, melalui Google Fonts (SIL Open Font License; salinan lisensi ada di `assets/fonts/`).

## Verifikasi

- Semua 18 halaman memiliki judul, deskripsi, heading utama, dan navigasi.
- Seluruh referensi file lokal dan seluruh gambar proyek asli diperiksa.
- Semua 14 sertifikat dipertahankan; perbandingan Data Exchange mempertahankan pasangan before/after.
- Tes browser mencakup desktop 1440px dan mobile 390px, gambar, overflow, error JavaScript, filter/pencarian, lightbox, pemulihan fokus, menu mobile, reduced motion, playground, ekspor PNG, dan draft email.
- Screenshot diperiksa secara visual. Rincian hasil tersimpan di `qa/results.json`.
- Review independen: 63 kombinasi tambahan pada lebar 320, 540, 600, 800, 801, 1024, dan 1200px; fokus keyboard, lightbox sertifikat, dan cetak CV lolos.
- Uji `file://` dalam mode offline: navigasi, font lokal, dan filter proyek lolos (`node scripts/offline-test.mjs`).

Static hosting dapat melayani isi folder ini secara langsung. Tidak ada deployment yang dilakukan.
# gpt-6-astra-portfolio-greenark
