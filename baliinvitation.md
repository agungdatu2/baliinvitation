# BaliInvitation — Ringkasan Kerja

**Repo:** git@github.com:agungdatu2/baliinvitation.git
**Stack:** Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (Neon), deploy ke Vercel
**Tema publik:** "Lume" (`src/components/templates/lume/*`)
**Contoh undangan:** https://baliinvitation.vercel.app/agung-sintia
**Admin dashboard:** https://baliinvitation.vercel.app/admin (belum ada auth)

## Konvensi Kerja
- Setiap selesai ubah kode: `npm run build` → `git add/commit/push origin main` → `npx vercel deploy --prod`.
- Device ini tanpa SSH key & belum pernah `vercel login` — `VERCEL_TOKEN` dan `GITHUB_TOKEN` disimpan di `.env.local` (gitignored) atas permintaan user, dipakai otomatis untuk push & deploy tanpa perlu diminta ulang tiap sesi.
- Font Lume: heading = Cormorant, body = Hanken Grotesk (placeholder pengganti "Lausanne" berbayar).
- Section-section pakai lebar wadah konsisten `max-w-5xl`.
- Background section pakai satu wrapper blur `.groove-page-blur` (globals.css) — gate & hero tajam, section sesudahnya blur konsisten.
- Tidak ada border pada foto/gambar di tema ini.
- Modal/popup fixed-position WAJIB di-render via React portal ke `document.body` (bug `backdrop-filter` di ancestor `.groove-page-blur` merusak positioning fixed — sudah diperbaiki di `WeddingGift.tsx`).
- Skema Prisma diubah → `npx prisma db push` pakai `DATABASE_URL_UNPOOLED` dari `.env.local` (mengubah database production Neon, harus additive/non-destructive).

## Fitur yang Sudah Dikerjakan

### 1. Setup environment
Device baru tanpa Node/Homebrew — install via nvm (Node v24.18 LTS). Clone repo via HTTPS (SSH belum terdaftar). Vercel auth via personal token.

### 2. Package tiers (Premium & Gold) + gating fitur tema
- `Package` model dapat field baru: `hasIntro` (Boolean), `maxGalleryImages` (Int?), `activeMonths` (Int?).
- Tema Lume otomatis baca paket undangan: skip intro splash kalau `hasIntro=false`, batasi jumlah galeri, dan undangan otomatis "tidak aktif" setelah `eventDate + activeMonths`.
- Paket **Premium**: tanpa intro, galeri maks 10, aktif 6 bulan.
- Paket **Gold**: dengan intro, galeri maks 17, aktif 12 bulan.
- Admin bisa atur field ini di `/admin/packages`.

### 3. Admin dashboard — sidebar kiri
`AdminNav` diredesain dari tab horizontal jadi sidebar vertikal modern di kiri (desktop), fallback ke tab horizontal di mobile.

### 4. Theme preview
- Tombol "+ Daftarkan Tema Baru" dihapus dari `/admin/themes` (tema baru selalu butuh kode).
- Tombol "Lihat" di tiap kartu tema → buka `/theme-preview/[key]` di tab baru, render tema dengan data teks contoh + semua foto/video/galeri kosong (placeholder bawaan tiap komponen).

### 5. Footer "Created By"
`ClosingFooter.tsx` dapat blok kredit kontak: WhatsApp (+62 851-9009-0902), Instagram (@baliinvitation), Website (baliinvitation.com).

### 6. Dwi-bahasa (ID/EN), fixed per undangan
- `Invitation.language` (default `"id"`) — dipilih admin lewat dropdown "Bahasa Undangan" saat bikin/edit undangan. Tidak ada switcher untuk tamu.
- Dictionary lengkap di `src/lib/i18n/lume.ts`, mencakup semua teks UI hardcoded di ~13 komponen Lume (splash, hero, profil mempelai, love story, countdown, live streaming, dresscode, RSVP form, galeri, nav menu, wedding gift, footer) + format tanggal ikut bahasa.
- Dictionary "id" = persis teks yang sudah live (supaya undangan existing tidak berubah tampilan). Dictionary "en" = terjemahan penuh.
- Preview tema bisa cek kedua bahasa: `/theme-preview/lume?lang=en`.

### 7. Tema baru "Reverie" (in progress)
- Tema kedua, key `reverie`, folder `src/components/templates/reverie/*` — dibuat dengan cara duplikat penuh dari `lume/*` (bukan dari nol), lalu akan diubah section demi section sesuai arahan user.
- Sudah didaftarkan di `registry.ts`, `prisma/seed.ts`, dan sudah ada row di DB production (`Template.key = "reverie"`, name "Reverie - Editorial Split").
- Saat ini isinya masih identik 100% dengan Lume (cuma nama komponen/orchestrator & beberapa seed placeholder gambar yang diganti dari `lume-*` ke `reverie-*`) — belum ada perubahan visual/struktur.
- Sudah diverifikasi jalan normal di `/theme-preview/reverie` (splash → gate → hero → nav) tanpa error console.
- Arah desain yang diminta user: di desktop, sisi kanan jadi satu section besar **sticky** berisi foto pengantin, sisi kiri section yang **scrollable** (konten mengalir normal). Ini kemungkinan mengubah struktur orchestrator (`ReverieTemplate.tsx`) dari single-column jadi split dua kolom untuk breakpoint desktop, mobile tetap single-column. Belum dikerjakan — baru section loading page yang selesai.
- Rencana kerja: user akan memandu section per section (bukan sekali jadi) — jangan langsung redesign semua section sekaligus tanpa diminta.
- **Section "Loading Page" (LoadingScreen.tsx) — SELESAI direstyle**, terinspirasi referensi `cc-balky.webflow.io`: dari cincin foto + nama besar bergantian + counter raksasa gaya Lume, jadi kanvas krem polos (`bg-groove-bg`) dengan indikator minimal "Loading NN%" di bawah-tengah + garis progress tipis 1.5px (bg `groove-ink/10` track, fill `groove-ink` solid). Eyebrow label kiri-atas ("UNDANGAN PERNIKAHAN") dipertahankan. Ring foto & nama mempelai yang animasi bergantian **dihapus** dari loading page (tidak ada di referensi) — kalau mau dikembalikan tinggal bilang.
  - Prop `images`/`words` dibuang dari `LoadingScreen`/`SplashGate` (sudah tidak dipakai), tambah prop `loadingText`.
  - Tambah dictionary key baru `loadingLabel` ("Memuat"/"Loading") di `src/lib/i18n/lume.ts` (dipakai bersama Lume, tapi cuma Reverie yang consume key ini untuk sekarang).
  - **Bug ditemukan & diperbaiki**: kalau `framer-motion`'s `animate={{ y: ... }}` dipasang di elemen yang sama dengan class Tailwind `-translate-x-1/2`, motion menulis `transform` inline yang menimpa transform dari class Tailwind (bukan digabung) — akibatnya blok loading center jadi nge-geser ke kanan viewport dan approx separuh kepotong di mobile. Fix: pisah wrapper positioning (plain `div` dgn `-translate-x-1/2`) dari wrapper animasi (`motion.div` di dalamnya). Kalau ada modal/element lain di tema ini yang gabung Tailwind transform class + motion animate y/x, cek pola yang sama.
- Belum di-commit/push/deploy — masih tahap draft lokal, tunggu ada bentuk visual yang jelas dulu sebelum deploy ke production.

## Belum Selesai / Perlu Diingat
- Field galeri (`galleryImages`) admin bisa isi video langsung (URL `.mp4`/`.webm`/`.mov`) untuk featured item di Gallery — belum ada video asli yang diupload.
- Harga paket Premium & Gold masih Rp 0 (placeholder) — perlu diisi harga aslinya.
- `PackagesManager` di admin belum ada fitur edit inline (cuma create/toggle-aktif/hapus) — kalau mau ubah paket yang sudah ada, pakai API langsung atau hapus+buat ulang.
