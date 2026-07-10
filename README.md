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
- Form edit undangan penuh (nama mempelai, love story, galeri, dst) — `/admin/invitations/{id}` saat ini adalah hub Tamu/RSVP/Portal, belum form edit data inti undangan.

## Portal Client & Guest Tracking

### Konsep
- **Guest**: satu baris per tamu per undangan, punya `guestCode` (8 karakter acak) yang dipakai di link personalisasi `/{slug}?g={guestCode}`. Status tamu bergerak maju saja: `pending → sent → opened → responded` (lihat `src/lib/utils/guest-status.ts`), tidak pernah mundur meskipun halaman dibuka ulang.
- **Link lama `?to=Nama`** tetap jalan sebagai fallback untuk broadcast massal (tidak tracked per-tamu, hanya menampilkan nama di gate).
- **Portal Client** (`/portal/{portalToken}`): halaman self-service tanpa login — token di URL itu sendiri adalah otentikasinya. Divalidasi di `src/app/portal/[token]/layout.tsx` lewat `resolvePortalByToken()`. Portal otomatis dianggap expired 30 hari setelah tanggal acara (`PORTAL_EXPIRY_GRACE_DAYS` di `src/lib/portal/resolve-portal.ts`).
- **Perubahan jadwal acara** dari Portal disimpan sebagai `EventChangeRequest` (acuan `eventIndex` ke array `Invitation.events`, karena events bukan tabel terpisah). Env var `PORTAL_AUTO_APPROVE_EVENT_EDITS` (default `true`) menentukan apakah perubahan langsung diterapkan atau menunggu approve admin di tab **Perubahan Acara**.
- **Tracking view** (`InvitationView`) mencatat setiap kunjungan `/{slug}`, dibedakan `guest` (via `?g=`) vs `to`/`direct`. Crawler link-preview (WhatsApp, Facebook, dst — lihat `src/lib/utils/bot-detect.ts`) sengaja tidak dihitung supaya status tamu tidak salah jadi "opened" duluan sebelum benar-benar dibuka.
- **Rate limit** (`RateLimitHit` table) dipakai untuk endpoint "tandai terkirim" — disimpan di Postgres (bukan in-memory) supaya konsisten lintas instance serverless di Vercel.

### Struktur tambahan
```
prisma/schema.prisma                          # + Guest, InvitationView, EventChangeRequest, RateLimitHit
src/lib/portal/resolve-portal.ts              # validasi token portal (valid/invalid/disabled/expired)
src/lib/portal/track-view.ts                  # catat InvitationView + naikkan status guest
src/lib/portal/event-change.ts                # logic auto-approve config
src/lib/services/guests.ts                    # CRUD & bulk-import guest, dipakai admin & portal
src/lib/services/event-change-requests.ts     # create/approve/reject + terapkan ke Invitation.events
src/app/portal/[token]/                        # Portal Client: dashboard, guests, rsvp, events
src/app/api/portal/[token]/                    # API portal (guests, bulk, mark-sent, events)
src/app/admin/invitations/[id]/               # Hub admin per-undangan: Ringkasan/Tamu/RSVP/Perubahan Acara
```

### Cara pakai (untuk diteruskan ke client)
1. Admin generate link Portal dari tab **Ringkasan** undangan (`/admin/invitations/{id}`), lalu kirim ke client via tombol "Kirim link portal via WA".
2. Client buka link Portal dari HP-nya (didesain mobile-first, tanpa perlu install apa-apa atau login).
3. Di tab **Tamu**: client tambah tamu satu-satu atau tempel banyak nama sekaligus (import massal), lalu klik **Kirim via WA** per tamu — otomatis membuka WhatsApp dengan pesan undangan + link personal.
4. Tab **RSVP**: client pantau siapa yang sudah konfirmasi hadir/tidak, dan ucapan yang masuk.
5. Tab **Acara**: kalau admin mengizinkan, client bisa ubah jam/lokasi/link Maps acara sendiri (perubahan tercatat, tidak menghapus riwayat lama).
6. Kalau link Portal bocor/salah kirim, admin bisa klik **Reset Link Portal** — link lama langsung tidak berlaku.

### Menjalankan test
```bash
npm test
```
Vitest meng-cover logic murni yang tidak butuh koneksi database: transisi status tamu, parsing bulk-import, format token, evaluasi akses portal, config auto-approve, deteksi bot, dan rate limiter (di-mock). Test yang butuh koneksi Postgres nyata (mis. flow API end-to-end) sengaja tidak dibuat di sini — diverifikasi manual lewat dev server sebelum deploy.
