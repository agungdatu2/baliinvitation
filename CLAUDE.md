# BaliInvitation

SaaS undangan digital. Next.js 14 (App Router) + TypeScript + Tailwind + Prisma + PostgreSQL (Neon), deploy Vercel.
Live: https://baliinvitation.vercel.app — admin `/admin` (NextAuth credentials, tabel `AdminUser`).

## Aturan Hemat Token (WAJIB)
- JANGAN eksplorasi/scan folder. Pakai peta di bawah untuk langsung ke file yang relevan.
- Pakai Grep dulu untuk cari simbol/teks, baru Read file yang ketemu. File besar (>300 baris): Read range baris yang perlu saja.
- Jangan baca ulang file yang barusan diedit. Jangan baca file yang tidak disebut user kecuali memang dependensi langsung.
- Tema di `templates/*` adalah duplikat satu sama lain — edit HANYA tema yang diminta, jangan cek/ubah tema lain.
- `baliinvitation.md` = log riwayat fitur (panjang). Baca HANYA kalau butuh konteks fitur lama. Setelah fitur selesai, tambah entri maks 5 bullet di sana.
- Jawab singkat; jangan tampilkan ulang isi file yang sudah diedit.

## Perintah
- Dev: `npm run dev -- -p 3001` · Build: `npm run build` · Test: `npm test` (vitest)
- Preview tema: `/theme-preview/<key>?intro=0&lang=en` (`intro=0` skip loading)
- Undangan publik: `/<slug>?g=<guestCode>` atau `/<slug>?to=Nama`

## Peta File
```
prisma/schema.prisma            # AdminUser, Template, Testimonial, Package, Invitation, RSVP, Guest,
                                # InvitationView, EventChangeRequest, RateLimitHit, Payment
prisma/seed.ts                  # seed Template/Package
src/types/invitation.ts         # InvitationData / TemplateProps — kontrak data semua tema
src/lib/validations/*.schema.ts # zod (client form + API)
src/lib/i18n/lume.ts            # dictionary id/en dipakai Lume, Reverie, dll
src/lib/i18n/grand-opening.ts
src/lib/services/               # guests.ts, event-change-requests.ts
src/lib/portal/                 # resolve-portal, track-view, event-change
src/lib/utils/                  # whatsapp, tokens, rate-limit, bot-detect, guest-status, csv, format, dll
src/lib/auth.ts · mail.ts · prisma.ts
src/middleware.ts

src/app/[slug]/page.tsx         # render undangan publik via registry
src/app/theme-preview/[key]/    # preview tema dgn data contoh
src/app/admin/                  # dashboard: invitations, packages, themes, admins, income, testimonials
src/app/admin/invitations/[id]/ # hub per undangan: edit, guests, rsvp, change-requests
src/app/portal/[token]/         # portal client (tanpa login, token = auth)
src/app/api/                    # REST: invitations, rsvp, guests, packages, payments, templates,
                                # testimonials, admin-users, portal/[token]/*, auth/*

src/components/admin/InvitationForm.tsx   # form utama undangan (~700 baris — Read per range)
src/components/admin/AdminNav.tsx          # sidebar admin
src/components/portal/ · landing/
src/components/templates/registry.ts       # daftar tema (key = Template.key di DB)
src/components/templates/<tema>/           # lume, reverie, muse, nocturne, grand-opening
                                           # entry: <Tema>Template.tsx, section per file
src/app/globals.css · tailwind.config.ts   # warna/font tema (groove-*)
```

## Konvensi Penting
- Tema baru: folder `templates/<key>/` + daftar di `registry.ts` + `prisma/seed.ts` + row DB `Template`.
- Field baru di undangan: update `schema.prisma` → `types/invitation.ts` → `validations/invitation.schema.ts` → `InvitationForm.tsx` (defaultValues) → `admin/invitations/[id]/edit/page.tsx` (initialValues).
- Teks UI tema TIDAK hardcode — pakai dictionary i18n (id & en).
- Modal fixed-position WAJIB via React portal ke `document.body` (bug `backdrop-filter` di `.groove-page-blur`).
- Jangan gabung class Tailwind `translate-*` dengan `motion` animate x/y di elemen yang sama — pisah wrapper.
- Sticky column: parent flex jangan `items-start`.
- Lebar section `max-w-5xl`; foto tanpa border.
- Ubah schema → `npx prisma db push` pakai `DATABASE_URL_UNPOOLED` dari `.env.local` (DB PRODUCTION — harus additive/non-destructive, konfirmasi user dulu).
- Selesai ubah kode: `npm run build` → commit & push `main` → `npx vercel deploy --prod` (token di `.env.local`, load via `source`, jangan di-print).
- User memandu redesign section per section — jangan redesign banyak section sekaligus tanpa diminta.
