import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { buildWaLink } from "@/lib/utils/whatsapp";
import ScrollReveal from "@/components/landing/ScrollReveal";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import PhoneFrame from "@/components/landing/PhoneFrame";
import LaptopFrame from "@/components/landing/LaptopFrame";
import PageLoader from "@/components/landing/PageLoader";
import FullscreenNav from "@/components/landing/FullscreenNav";
import RevealOnLoad from "@/components/landing/RevealOnLoad";

const NAV_LINKS = [
  { label: "Tema", href: "#tema" },
  { label: "Paket", href: "#paket" },
];

const CREATOR = {
  whatsappNumber: "085190090902",
  whatsappLabel: "+62 851-9009-0902",
  instagramHandle: "baliinvitation",
};

// Ukuran mockup laptop+HP di section Tema — ditampilkan berdampingan
// (bukan tumpang tindih) supaya kedua device kelihatan utuh.
const LAPTOP_WIDTH = 220;
const PHONE_WIDTH = 65;

const FEATURES = [
  "Slug URL personal — baliinvitation.com/(nama-kalian)",
  "Dikerjakan langsung oleh tim, bukan generate otomatis",
  "Bisa custom sesuai kebutuhan acara",
  "Dashboard admin: kelola tamu, RSVP, dan ucapan dari satu tempat",
  "Portal khusus client untuk kirim link ke tamu & pantau RSVP",
  "Dukungan langsung via WhatsApp",
];

const ADDONS = [
  { label: "Tambahan sesi acara / 2 link jadwal berbeda", price: "Rp 100.000" },
  { label: "Ubah cover asli jadi video", price: "Rp 30.000" },
  { label: "Tambah kuota galeri foto", price: "Rp 35.000" },
  { label: "Undangan multi-bahasa (ID/EN)", price: "Rp 100.000" },
  { label: "Link aktif seumur hidup", price: "Rp 100.000" },
];

// Paket dikelola dari /admin/packages — revalidate tiap jam supaya perubahan
// harga/fitur tidak nunggu deploy baru untuk muncul di landing page.
export const revalidate = 3600;

function formatRupiah(n: number) {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default async function HomePage() {
  const packages = await prisma.package.findMany({
    where: { isActive: true },
    orderBy: { price: "asc" },
  });

  // Tema di landing page ambil dari DB (bukan array hardcoded) supaya tema baru
  // otomatis muncul begitu admin isi tagline/deskripsi/fitur-nya di /admin/themes —
  // tidak perlu ubah kode di sini lagi. Screenshot laptop/HP tetap lewat convention
  // /landing/thumbnails/<key>-{laptop,phone}.png.
  const themes = await prisma.template.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
  });

  const heroWaLink = buildWaLink(
    CREATOR.whatsappNumber,
    "Halo, saya mau tanya-tanya soal paket undangan digital BaliInvitation 🙏"
  );

  return (
    <main className="min-h-screen bg-groove-bg text-groove-ink font-groove-body">
      <PageLoader />
      <FloatingWhatsApp href={heroWaLink} />

      {/* Hero — video full-screen, nav mengambang transparan di atasnya */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_040604_c8ace780-37e9-4f61-bc5c-8b1712b4640b.mp4"
        />
        <div className="absolute inset-0 bg-black/35" />

        <RevealOnLoad className="relative z-10 flex h-full flex-col">
          <header className="px-6 sm:px-10 py-5 sm:py-6 flex items-center justify-between">
            <Image
              src="/brand/logo.webp"
              alt="BaliInvitation"
              width={160}
              height={47}
              priority
              className="w-28 sm:w-36 h-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
            <FullscreenNav
              links={NAV_LINKS}
              ctaHref={heroWaLink}
              ctaLabel="Buat Undangan"
              contactPhoneLabel={CREATOR.whatsappLabel}
              contactPhoneHref={heroWaLink}
              instagramHref={`https://instagram.com/${CREATOR.instagramHandle}`}
            />
          </header>

          <div className="flex-1 flex items-start justify-center pt-16 sm:pt-20 md:pt-24 px-6">
            <div className="text-center max-w-2xl">
              <p className="uppercase tracking-[0.3em] text-xs text-white/70 mb-5">Undangan Online Premium</p>
              <h1 className="text-white text-4xl sm:text-5xl md:text-6xl font-groove-display leading-[1.05]" style={{ fontWeight: 500 }}>
                Bagikan momen bahagiamu lebih mudah{" "}
                <span className="font-script text-5xl sm:text-6xl md:text-7xl text-white/90" style={{ fontWeight: 600 }}>
                  bersama
                </span>{" "}
                BaliInvitation
              </h1>
              <p className="text-white/80 max-w-md mx-auto mt-6 text-base">
                Buat undangan pernikahan digital, kelola tamu &amp; RSVP, semuanya dari satu tempat.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <a
                  href={heroWaLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-6 py-3 bg-white text-groove-ink text-sm font-semibold rounded-full hover:bg-white/90 transition"
                >
                  Buat Undangan
                </a>
                <Link
                  href="/contoh-undangan"
                  className="px-6 py-3 groove-glass-dark rounded-full text-white text-sm font-semibold hover:bg-white/10 transition"
                >
                  Lihat Contoh Undangan
                </Link>
              </div>
            </div>
          </div>
        </RevealOnLoad>
      </section>

      {/* Kenapa Pilih — dua kolom: headline+copy+checklist di kiri, foto potret
          di kanan. Kata kedua di headline dibuat italic sebagai aksen editorial. */}
      <section className="bg-[#e9e3d6] border-y border-groove-line">
        <div className="max-w-6xl mx-auto px-6 py-20 md:py-28 grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <ScrollReveal>
            <h2
              className="font-groove-display uppercase text-4xl sm:text-5xl leading-[1.1] text-groove-ink mb-6"
              style={{ fontWeight: 500 }}
            >
              Mengapa kamu <em className="italic font-normal">harus</em> menggunakan BaliInvitation?
            </h2>
            <p className="text-groove-ink/70 leading-relaxed mb-8">
              BaliInvitation dikerjakan langsung oleh tim kami, bukan generate otomatis, supaya desainnya benar-benar
              sesuai gaya dan cerita kalian. Dari kelola tamu, RSVP, sampai portal khusus client untuk pantau
              undangan — semuanya sudah kami siapkan dalam satu tempat, dengan dukungan langsung via WhatsApp kalau
              butuh bantuan.
            </p>
            <ul className="space-y-3 mb-10">
              {FEATURES.map((f, i) => (
                <ScrollReveal key={f} delay={i * 60}>
                  <li className="flex items-start gap-3 text-sm text-groove-ink/75">
                    <span className="text-groove-primary mt-0.5">✓</span>
                    <span>{f}</span>
                  </li>
                </ScrollReveal>
              ))}
            </ul>
            <a
              href="#tema"
              className="inline-block uppercase tracking-[0.2em] text-xs font-semibold text-groove-ink border-b-2 border-groove-ink pb-1.5 hover:text-groove-primary hover:border-groove-primary transition"
            >
              Lihat Tema
            </a>
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden">
              <Image
                src="/landing/kenapa-baliinvitation.webp"
                alt="Pasangan pengantin memakai busana adat Bali"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Themes — dark glass cards + teks watermark raksasa di belakang.
          Judul sengaja tidak menyebut angka ("Tiga Gaya") karena daftar tema
          akan terus bertambah. Thumbnail pakai screenshot statis (bukan
          iframe live) supaya landing page tidak nge-load 3+ halaman penuh
          sekaligus — cukup regenerate lewat scripts/capture-screenshots.js
          tiap kali desain tema berubah. */}
      <section id="tema" className="relative overflow-hidden bg-groove-bg py-24">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_030633_83c8f212-88f1-442c-a2cc-3b25355f12c6.mp4"
        />
        {/* Overlay terang (bukan gelap) — video tetap kelihatan supaya blur di
            kartu glass beneran nge-blur sesuatu, tapi ini nge-lighten videonya
            biar teks & watermark di luar kartu tetap gampang dibaca. */}
        <div className="absolute inset-0 bg-black/35" />

        {/* Watermark raksasa "TEMA" di belakang kartu — subtle di atas bg terang */}
        <p
          aria-hidden
          className="pointer-events-none select-none absolute inset-x-0 top-8 text-center font-groove-display leading-none"
          style={{
            fontSize: "clamp(6rem, 22vw, 14rem)",
            fontWeight: 700,
            backgroundImage: "linear-gradient(to bottom, rgba(201,164,92,0.35), rgba(201,164,92,0.04))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          TEMA
        </p>

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          <ScrollReveal className="text-center mb-12">
            <p className="uppercase tracking-[0.25em] text-xs text-groove-primary-light mb-3">Pilihan Tema</p>
            <h2 className="font-groove-display text-3xl md:text-4xl text-groove-bg" style={{ fontWeight: 500 }}>
              Jelajahi Semua Tema
            </h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-8">
            {themes.map((theme, i) => {
              const features = theme.features as string[];
              // Template.name disimpan lengkap ("Lume - Elegant Minimalist") untuk
              // dropdown admin; kartu di sini cuma perlu nama pendeknya.
              const displayName = theme.name.split(" - ")[0];
              return (
                // Kartu kaca beneran — pakai .groove-glass-strong (tint tipis + blur) supaya
                // video di section ini tetap kelihatan tembus. Panel kaca ini SENGAJA tidak
                // dibungkus ScrollReveal (opacity/transform animasi) — backdrop-filter di atas
                // video akan "ngebug"/gak ke-apply blurnya di Safari kalau ancestor-nya lagi
                // animasi opacity. Yang di-fade cuma konten di dalamnya (teks/gambar biasa,
                // aman dianimasikan), sementara panel kacanya sendiri statis & selalu benar.
                <div
                  key={theme.key}
                  className="groove-glass-strong relative flex flex-col items-center text-center rounded-[2.5rem] transition-all duration-500 hover:-translate-y-2 p-8 sm:p-10"
                >
                  <ScrollReveal delay={i * 120} className="w-full flex flex-col items-center text-center">
                    {theme.isMostPopular && (
                      <span
                        className="absolute top-6 right-6 uppercase tracking-widest text-[10px] font-semibold px-3 py-1.5 rounded-full text-groove-ink"
                        style={{ backgroundImage: "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 100%)" }}
                      >
                        Most Popular
                      </span>
                    )}
                    {/* Nama tema — gradient emas solid, konsisten di semua tema
                        (dulu di-mask pakai screenshot sendiri, tapi warnanya jadi
                        acak/kusam tergantung crop foto yang kebetulan kena). */}
                    <h3
                      className="font-groove-display uppercase text-6xl sm:text-7xl leading-none mb-4"
                      style={{
                        fontWeight: 800,
                        backgroundImage: "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 45%, #8a6d2f 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {displayName}
                    </h3>

                    <div className="w-16 h-px bg-groove-primary-light/50 mb-6" />

                    <div className="flex items-end justify-center gap-3 mb-8">
                      <LaptopFrame
                        src={`/landing/thumbnails/${theme.key}-laptop.png`}
                        width={LAPTOP_WIDTH}
                      />
                      <PhoneFrame
                        src={`/landing/thumbnails/${theme.key}-phone.png`}
                        width={PHONE_WIDTH}
                      />
                    </div>

                    <p className="text-xs uppercase tracking-widest text-groove-primary-light mb-3">{theme.tagline}</p>
                    <p className="text-sm text-white/70 mb-6 min-h-[2.5em]">{theme.description}</p>
                    <ul className="w-full space-y-3 mb-8 text-left">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-groove-primary-light/15 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-groove-primary-light">
                              <path d="M20 6L9 17l-5-5" />
                            </svg>
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <a
                      href={`/theme-preview/${theme.key}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full px-8 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition"
                    >
                      Lihat Preview
                    </a>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="paket" className="max-w-5xl mx-auto px-6 py-24">
        <ScrollReveal className="text-center mb-12">
          <p className="uppercase tracking-[0.25em] text-xs text-groove-primary mb-3">Paket Harga</p>
          <h2 className="font-groove-display text-3xl md:text-4xl" style={{ fontWeight: 500 }}>
            Pilih Paket Sesuai Kebutuhan
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.id} delay={i * 120}>
              <div className="border border-groove-line rounded-2xl p-8 bg-white/50 flex flex-col h-full">
                <h3 className="font-groove-display text-2xl mb-1" style={{ fontWeight: 500 }}>{pkg.name}</h3>
                <p className="font-groove-display text-3xl mb-6" style={{ fontWeight: 600 }}>{formatRupiah(pkg.price)}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {(pkg.features as string[]).map((f) => (
                    <li key={f} className="text-sm text-groove-ink/75 flex items-start gap-2">
                      <span className="text-groove-primary mt-0.5">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href={buildWaLink(
                    CREATOR.whatsappNumber,
                    `Halo, saya mau pesan undangan digital paket ${pkg.name} (${formatRupiah(pkg.price)}) 🙏`
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="text-center px-6 py-3 rounded-full bg-groove-ink text-groove-bg text-sm tracking-wide hover:opacity-90 transition"
                >
                  Pilih Paket Ini
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Add-ons */}
        <ScrollReveal delay={240} className="max-w-3xl mx-auto mt-10">
          <div className="border border-groove-line rounded-2xl p-6 bg-white/40">
            <p className="text-xs uppercase tracking-widest text-groove-primary mb-4">Fitur Tambahan (Add-On)</p>
            <ul className="space-y-2">
              {ADDONS.map((a) => (
                <li key={a.label} className="flex items-center justify-between text-sm gap-4">
                  <span className="text-groove-ink/75">{a.label}</span>
                  <span className="text-groove-ink/50 whitespace-nowrap">{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer / contact */}
      <footer className="border-t border-groove-line">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center gap-5 text-center">
          <p className="font-groove-display text-lg" style={{ fontWeight: 500 }}>Punya pertanyaan?</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <a
              href={heroWaLink}
              target="_blank"
              rel="noreferrer"
              className="text-groove-ink/75 hover:text-groove-ink transition-colors"
            >
              WhatsApp {CREATOR.whatsappLabel}
            </a>
            <a
              href={`https://instagram.com/${CREATOR.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="text-groove-ink/75 hover:text-groove-ink transition-colors"
            >
              @{CREATOR.instagramHandle}
            </a>
          </div>
          <p className="text-xs text-groove-ink/40">© {new Date().getFullYear()} BaliInvitation — All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
