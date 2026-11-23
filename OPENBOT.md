# BaliInvitation — Panduan Menjalankan Project (untuk OpenBot)

Dokumen serah-terima: apa project ini, akses apa saja yang dibutuhkan, cara menjalankannya, dan
aturan main supaya agen tidak merusak data produksi. **Dokumen ini sengaja TIDAK berisi nilai rahasia**
(password, token, connection string). Nilai aslinya diberikan pemilik lewat secret store, bukan lewat
chat atau file yang di-commit (lihat bagian 9).

---

## 1. Ringkasan

SaaS undangan digital (pernikahan, ulang tahun, melaspas/grand opening, potong gigi) milik Bali Invitation.

- **Stack:** Next.js 14.2.5 (App Router) + TypeScript + Tailwind + Prisma 5 + PostgreSQL (Neon) + NextAuth (credentials).
- **Produksi:** https://baliinvitation.com (alias https://baliinvitation.vercel.app), di-host di Vercel.
- **Repo:** https://github.com/agungdatu2/baliinvitation (branch `main`, tidak ada PR workflow — commit langsung ke `main`).
- **Vercel:** scope `agung-datus-projects`, project `baliinvitation`. Push ke `main` otomatis men-deploy ke Production.
- **Admin:** `/admin` (login di `/admin/k7xq2m9pv3`, bukan `/admin/login`). Portal client: `/portal/[token]` (tanpa login, token = otentikasi).
- **Undangan publik:** `/<slug>?to=Nama` atau `/<slug>?g=<guestCode>`. Draft hanya bisa dilihat admin yang login atau lewat `?portal_preview=<portalToken>`.
- **Bahasa kerja pemilik:** Indonesia. Komentar kode dan teks UI admin ditulis Indonesia.

Panduan konvensi kode yang lebih detail ada di `CLAUDE.md` (peta file, aturan tema, dst) — **baca itu juga**.

---

## 2. Akses yang dibutuhkan

| # | Layanan | Dipakai untuk | Akses minimal | Cara memberikan |
|---|---|---|---|---|
| 1 | **GitHub** `agungdatu2/baliinvitation` | clone, push ke `main` | Collaborator dengan **Write** | Undang akun/bot ke repo, atau deploy key SSH dengan write access. Pastikan identitas git di mesin bot punya hak tulis (pernah gagal 403 karena login sebagai akun lain). |
| 2 | **Vercel** (`agung-datus-projects/baliinvitation`) | deploy, redeploy, lihat log build | Token dengan scope project tsb | Buat di https://vercel.com/account/tokens → simpan sebagai `VERCEL_TOKEN` |
| 3 | **Neon PostgreSQL** (db `neondb`, region us-east-1) | database aplikasi | Connection string pooled **dan** unpooled | Dari dashboard Neon → Connection details. **Saran kuat: buat Neon *branch* khusus dev untuk bot** (lihat bagian 7). |
| 4 | **Akun admin aplikasi** | login ke dashboard admin untuk uji manual | email + password (tabel `AdminUser`) | Dibuat lewat seed (`ADMIN_EMAIL`/`ADMIN_PASSWORD`) atau menu Admin di dashboard |
| 5 | **Resend** | email lupa password | API key + domain pengirim terverifikasi | Dashboard Resend → API Keys |
| 6 | **Hostinger / WordPress** (`mediumpurple-cormorant-121040.hostingersite.com`) | hosting foto client (`/wp-content/uploads/YYYY/MM/...`) | Kalau bot perlu **mengunggah** foto: akun WP editor + *Application Password* | WP Admin → Users → Profile → Application Passwords. Kalau tidak perlu mengunggah, cukup minta pemilik mengunggah dan memberi URL. |
| 7 | **Google Tag Manager** `GTM-PZGFFWFK` | analytics | Hanya jika bot diminta mengatur tag (GA4 belum terpasang) | Undang ke container GTM dengan Edit access |
| 8 | **Google Chrome** di mesin lokal | route screenshot sosmed saat dev | Terpasang di `/Applications/Google Chrome.app` (macOS) | Di Vercel dipakai `@sparticuz/chromium`, tidak perlu apa-apa |
| 9 | **Instagram** `@baliinvitation` | — | **Tidak ada koneksi API.** Postingan hanya *digenerate* (gambar + caption), diunggah manual oleh pemilik | Auto-post butuh akun Business + Meta Graph API — belum dibuat |

Tidak ada layanan pembayaran/payment gateway, tidak ada S3/Cloudinary, tidak ada Redis.

---

## 3. Environment variables

File: `.env.local` di root (sudah di-`.gitignore`; **jangan pernah di-commit atau dicetak**). Nama persis seperti di bawah.

| Variabel | Wajib | Fungsi | Asal nilai |
|---|---|---|---|
| `DATABASE_URL` | ya | Koneksi Prisma (runtime). Pakai endpoint **pooled** Neon. | Neon dashboard |
| `DATABASE_URL_UNPOOLED` | ya, untuk `prisma db push` | Koneksi **langsung** (non-pooler) untuk DDL/skema | Neon dashboard |
| `NEXTAUTH_SECRET` | ya | Penanda tangan JWT NextAuth + middleware | Acak panjang, mis. `openssl rand -base64 32` |
| `NEXTAUTH_URL` | ya di luar Vercel | URL dasar app (mis. `http://localhost:3001`) | Isi sendiri |
| `ADMIN_EMAIL` | opsional | Bootstrap admin pertama saat `prisma db seed` | Pemilik |
| `ADMIN_PASSWORD` | opsional | idem | Pemilik |
| `RESEND_API_KEY` | untuk email | Kirim email reset password | Resend |
| `RESEND_FROM_EMAIL` | untuk email | Alamat pengirim | Domain terverifikasi di Resend |
| `PORTAL_AUTO_APPROVE_EVENT_EDITS` | opsional | `true` = perubahan acara dari portal client langsung disetujui | Pemilik |
| `VERCEL_TOKEN` | untuk deploy via CLI | Auth Vercel CLI | Vercel account tokens |

Catatan:
- **Env yang sama harus ada di Vercel** (Project → Settings → Environment Variables) agar produksi berjalan. Jangan menimpa env produksi tanpa izin pemilik.
- Muat env ke shell dengan `set -a && source .env.local && set +a` — jangan `cat`/`echo` isinya.

---

## 4. Setup lokal

Prasyarat: Node.js ≥ 20 (dikembangkan di Node 24), npm, Git, Google Chrome (opsional).

```bash
git clone https://github.com/agungdatu2/baliinvitation.git
cd baliinvitation
cp /path/ke/secret/.env.local .env.local     # nilai dari secret store, jangan ketik di chat
npm install                                   # postinstall menjalankan `prisma generate`
npx prisma generate                           # jika klien Prisma belum ter-generate
npm run dev -- -p 3001
```

- **Port 3001** dipakai karena port 3000 sering dipakai project lain di mesin pemilik.
- Preview tema tanpa membuat undangan: `http://localhost:3001/theme-preview/<key>?intro=0` (key: `lume`, `reverie`, `muse`, `grand-opening`, `nocturne`, `confetti`). `intro=0` melewati loading screen.
- Tema `confetti` menerima parameter URL (`host`, `title`, `date`, `time`, `venue`, `place`, `sign`, `cover`, `photos`) supaya data client asli tidak perlu masuk kode.

---

## 5. Perintah

| Perintah | Fungsi |
|---|---|
| `npm run dev -- -p 3001` | Dev server |
| `npm run build` | Build produksi (`next build`) |
| `npm test` | Vitest (±60 tes, harus hijau sebelum commit) |
| `npx tsc --noEmit` | Typecheck (abaikan error dari `.next/types` yang basi) |
| `npm run lint` | ESLint |
| `npx prisma generate` | Generate klien Prisma |
| `DATABASE_URL="$DATABASE_URL_UNPOOLED" npx prisma db push` | **Ubah skema DB — lihat aturan bagian 7** |

---

## 6. Alur kerja & deploy

1. Ubah kode → `npx tsc --noEmit` dan `npm test`.
2. Commit **hanya file yang relevan** (`git add <path-spesifik>`, bukan `git add -A`) lalu `git push origin main`.
3. Vercel otomatis build & deploy ke Production (±1 menit). Cek status:
   ```bash
   set -a && source .env.local && set +a && vercel ls | head
   ```
4. Build gagal karena gangguan jaringan (mis. gagal unduh Google Fonts)? Ulang dari commit yang sama:
   ```bash
   vercel redeploy <url-deployment-yang-gagal>
   ```
   **Jangan** `vercel deploy --prod` dari folder lokal yang punya perubahan belum di-commit — itu mengunggah semuanya.
5. Log build: `vercel inspect <url> --logs`.

---

## 7. Aturan penting (guardrails)

**Database produksi**
- `DATABASE_URL` di `.env.local` pemilik menunjuk **langsung ke database produksi**. Tidak ada DB dev terpisah.
- Perubahan skema (`prisma db push`) hanya yang **additive** (kolom/tabel baru dengan default). Dilarang `--accept-data-loss`, drop, atau rename.
- **Tanya pemilik dulu** sebelum menulis ke DB produksi (skema, insert template, buat/ubah undangan, koreksi data). Menulis atas permintaan eksplisit pemilik boleh.
- Untuk bot yang bekerja mandiri: minta pemilik membuat **Neon branch dev** dan pakai connection string branch itu.

**Rahasia**
- Jangan mencetak, me-log, atau meng-commit nilai env, token, password, atau portal token.
- Foto client **tidak boleh di-commit**. Untuk review lokal taruh di `public/dev-samples/` (sudah di-gitignore).

**Gaya kerja**
- Pemilik memandu desain **section per section**. Edit hanya tema/section yang diminta; jangan merombak banyak section sekaligus.
- Tema di `src/components/templates/*` saling terpisah (duplikat); jangan menyentuh tema lain.
- Teks UI tema tidak di-hardcode: pakai dictionary i18n (`src/lib/i18n/*`, id & en).
- Modal `position: fixed` wajib lewat React portal ke `document.body`.
- Tema baru: folder `templates/<key>/` + daftar di `registry.ts` + `prisma/seed.ts` + row di tabel `Template`.
- Field baru di undangan: `schema.prisma` → `types/invitation.ts` → `validations/invitation.schema.ts` → `InvitationForm.tsx` (defaultValues) → `admin/invitations/[id]/edit/page.tsx` (initialValues) → API create (`api/invitations/route.ts`) → duplicate route.
- **Jangan mematikan dev server** yang sedang berjalan kecuali diminta. Kalau cache `.next` rusak (HTML dan CSS beda hash font), hapus `.next` lalu nyalakan lagi.
- Zona waktu: semua jam acara adalah **WITA (Asia/Makassar)**. Pakai `src/lib/utils/timezone.ts` (`parseBaliDateTime`, `toBaliDatetimeLocal`, `BALI_TZ`). Server Vercel berjalan di UTC.
- Selesai fitur: tambahkan entri singkat (maks 5 bullet) di `baliinvitation.md` bila relevan.

---

## 8. Peta fitur & modul penting

**Tema** (`src/components/templates/<key>/`): `lume`, `reverie`, `muse` (wedding), `grand-opening` (melaspas/bisnis), `nocturne` (wedding, gelap — **belum terdaftar di tabel Template**, hanya preview), `confetti` (ulang tahun anak, terdaftar). Registry: `src/components/templates/registry.ts`.

**Admin** (`src/app/admin/*`):
- Undangan: buat/edit/duplikat, hub per undangan (tamu, RSVP, permintaan perubahan acara).
- **Income** (pembayaran, outstanding) dan **Invoice** (`/admin/invoices`, cetak/PDF A4 + teks WhatsApp; total = `Invitation.totalPrice`).
- **Harga add-on** satu sumber di `src/lib/addons.ts` (`calcTotalPrice`): total = paket + add-on yang dicentang; undangan "add-on" (`isAddon`) hanya ditagih harga add-on.
- **Social Media** (`/admin/social`): generator carousel Feed 1080×1080 dan Story 1080×1920 (canvas di browser, `src/lib/social/*`), menyesuaikan jenis acara (`occasion.ts`). Tombol "Ambil Screenshot Asli" memakai `POST /api/social/screens` (puppeteer-core + Chromium; di lokal memakai Chrome macOS, di Vercel `@sparticuz/chromium`, `maxDuration` 60 dtk).
- Semua `/api/*` kecuali `/api/auth`, `/api/rsvp`, `/api/portal` diproteksi login admin lewat `src/middleware.ts`.

**Konten dinamis di undangan non-wedding**: `hostName` = nama anak/penyelenggara, `eventTitle` = judul (usia dibaca dari angka pertama, mis. "Ulang Tahun ke-1"), `greeting` = kata pengantar, `quote` = tanda tangan orang tua (tema Confetti).

**Musik**: field `musicUrl` per undangan; tema Confetti punya bawaan `public/audio/happy-birthday-piano.m4a`.

---

## 9. Cara serah-terima secrets yang aman

1. Pemilik memasukkan semua nilai ke **secret store OpenBot** (atau password manager), bukan ke chat, issue, atau commit.
2. Bot membuat `.env.local` dari secret store pada saat dijalankan; file itu tidak pernah di-commit.
3. Beri bot token seminimal mungkin (GitHub: hanya repo ini; Vercel: hanya project ini).
4. Setelah pemakaian atau kalau ada kebocoran: **rotasi** `NEXTAUTH_SECRET` (semua sesi login keluar), `VERCEL_TOKEN`, `RESEND_API_KEY`, dan password database Neon.
5. Jangan pernah menempelkan isi `.env.local` ke percakapan.

---

## 10. Masalah umum

| Gejala | Penyebab / solusi |
|---|---|
| Dev server mati sendiri | Nyalakan lagi `npm run dev -- -p 3001`. Cek `lsof -ti:3001`. |
| Font tema tampil sans / hash font beda | Cache `.next` rusak → `rm -rf .next` lalu restart dev |
| 404 sesaat di halaman baru saat dev | Kompilasi pertama; muat ulang |
| Build Vercel gagal "next/font ... fonts.gstatic.com failed" | Gangguan jaringan sesaat → `vercel redeploy <url>` |
| `git push` ditolak 403 | Identitas git bukan collaborator repo → perbaiki kredensial/akses |
| Screenshot sosmed gagal di produksi | Lihat pesan error di bawah tombol; pastikan `next.config.js` menyertakan `outputFileTracingIncludes` untuk `@sparticuz/chromium` |
| Halaman undangan draft menampilkan "belum dipublikasikan" | Normal untuk publik; pakai login admin atau `?portal_preview=<token>` |

---

## 11. Status pekerjaan (per 2026-11-23)

- Sudah live: invoice generator, add-on pricing, edit pembayaran, tool Social Media (Feed + Story, multi-acara), tema Confetti + undangan draft `aluna-1st-birthday` (foto sudah terisi, belum dipublikasikan, paket belum dipilih), perbaikan zona waktu jam acara.
- **Belum di-commit** (perubahan lokal pemilik): tema **Nocturne** — `BrideSection.tsx`, `SaveTheDateSection.tsx`, `WeddingDetails.tsx`, `NocturneTemplate.tsx`, dan file baru `GallerySection.tsx`. Nocturne belum didaftarkan ke tabel `Template` (menunggu persetujuan pemilik).
- Ditunda: GA4 belum dipasang di GTM; auto-post Instagram (butuh Meta Graph API).
- Undangan lama dibuat sebelum perbaikan zona waktu: jam countdown-nya bergeser 8 jam sampai disimpan ulang dari form edit.
