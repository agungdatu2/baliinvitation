# BaliInvitation — Admin Dashboard & Template Undangan Digital

Stack: **Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL**.

## Kenapa stack ini
- Next.js App Router: 1 codebase untuk admin dashboard (`/admin`) dan halaman publik undangan (`/[slug]`), SSR untuk metadata OG share yang bagus di WhatsApp.
- Prisma + Postgres: data client & konten JSON (love story, gallery, events) fleksibel tapi tetap type-safe.
- Template registry (`src/components/templates/registry.ts`): menambah tema baru tinggal buat folder komponen baru + daftarkan key, tanpa ubah form admin atau API.

## Struktur Penting
```
prisma/schema.prisma          # model Invitation, RSVP, Template, AdminUser
src/types/invitation.ts       # kontrak data (InvitationData) dipakai form & semua template
src/lib/validations/          # zod schema, dipakai di client form & API (validasi ganda)
src/app/api/invitations       # CRUD undangan
src/app/api/rsvp              # simpan & ambil RSVP
src/components/admin/InvitationForm.tsx   # form dinamis (field array: love story, events, rekening, galeri)
src/components/templates/lume/*           # tema "Lume" — 11 komponen section
src/app/[slug]/page.tsx       # render publik: fetch by slug -> pilih komponen dari registry -> render
```

## Menjalankan
```bash
npm install
cp .env.example .env        # isi DATABASE_URL
npx prisma migrate dev
npx prisma db seed
npm run dev
```
Buat undangan di `/admin/invitations/new`, lalu buka `/{slug}?to=Nama%20Tamu` untuk lihat versi tamu (nama otomatis tampil di halaman gate, sesuai fitur asli).

## Fitur yang direplikasi dari referensi (tamubali.com/lume)
Splash screen loading %, gate "Kepada Yth: [nama tamu]" + tombol buka + musik latar, hero nama & tanggal, greeting adat, profil mempelai pria/wanita + IG, love story (list dinamis), galeri foto (grid & strip), countdown D/H/M/S, tombol "Tambahkan ke Kalender" (Google Calendar), kartu jadwal acara (Resepsi/Memadik, dst — jumlah & nama bebas diisi admin) dengan link Maps, form RSVP (hadir/tidak hadir/belum tahu + jumlah + ucapan), wedding gift/rekening dengan tombol salin, footer penutup.

## Catatan penting — soal "replikasi 100%"
Struktur, alur, dan fitur di atas sudah dibuat semirip mungkin dan sepenuhnya dinamis (bukan hardcode). Yang **sengaja tidak** saya salin identik:
- Font, warna, CSS/asset persis milik tamubali.com (itu properti desain kompetitor/brand lain — bukan hal yang aman untuk ditiru byte-per-byte untuk produk komersial kamu sendiri). Palet warna & font sudah saya siapkan sebagai variabel (`tailwind.config.ts`, `globals.css`) supaya kamu/desainer tinggal ganti sesuai identitas visual BaliInvitation.
- Foto-foto di halaman referensi adalah foto milik klien/fotografer mereka — jangan dipakai di template kamu.

Kalau kamu punya mockup desain sendiri (Figma/screenshot dari klien kamu), saya bisa sesuaikan CSS templat ini persis ke situ tanpa masalah — itu murni styling, bukan cloning produk orang lain.

## Belum termasuk di skeleton ini (langkah lanjut)
- Auth admin (NextAuth) — tabel `AdminUser` sudah ada di schema, tinggal pasang provider credentials.
- Upload gambar/musik ke storage (S3/Cloudinary) — saat ini field-nya menerima URL langsung.
- Halaman `/admin/invitations/[id]/edit` (form sama seperti create, tinggal prefill `defaultValues` dari GET `/api/invitations/[id]`).
