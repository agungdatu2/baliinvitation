import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildWaLink } from "@/lib/utils/whatsapp";
import ScrollReveal from "@/components/landing/ScrollReveal";
import PhoneMockup from "@/components/landing/PhoneMockup";
import FloatingWhatsApp from "@/components/landing/FloatingWhatsApp";
import PhoneFrame from "@/components/landing/PhoneFrame";
import LaptopFrame from "@/components/landing/LaptopFrame";

const CREATOR = {
  whatsappNumber: "085190090902",
  whatsappLabel: "+62 851-9009-0902",
  instagramHandle: "baliinvitation",
};

const THEMES = [
  { key: "lume", name: "Lume", tagline: "Elegant Minimalist", desc: "Kertas hangat & emas pudar — clean, timeless, cocok untuk gaya formal-klasik." },
  { key: "reverie", name: "Reverie", tagline: "Editorial Split", desc: "Panel foto besar sticky di samping konten yang scroll — dramatis & modern." },
  { key: "muse", name: "Muse", tagline: "Editorial Free Scroll", desc: "Turunan Reverie yang lebih santai, hero eyebrow-nama-tanggal yang bersih." },
];

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

  const heroWaLink = buildWaLink(
    CREATOR.whatsappNumber,
    "Halo, saya mau tanya-tanya soal paket undangan digital BaliInvitation 🙏"
  );

  return (
    <main className="min-h-screen bg-groove-bg text-groove-ink font-groove-body">
      <FloatingWhatsApp href={heroWaLink} />

      {/* Nav */}
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <p className="font-groove-display text-lg tracking-wide" style={{ fontWeight: 600 }}>
          BaliInvitation
        </p>
        <nav className="flex items-center gap-6 text-sm">
          <a href="#tema" className="hidden sm:inline text-groove-ink/70 hover:text-groove-ink transition-colors">Tema</a>
          <a href="#paket" className="hidden sm:inline text-groove-ink/70 hover:text-groove-ink transition-colors">Paket</a>
          <Link href="/admin" className="hidden sm:inline text-groove-ink/40 hover:text-groove-ink transition-colors text-xs">
            Admin
          </Link>
          <a
            href={heroWaLink}
            target="_blank"
            rel="noreferrer"
            className="px-5 py-2.5 rounded-full bg-groove-ink text-groove-bg text-sm tracking-wide hover:opacity-90 transition"
          >
            Buat Undangan
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260815_040604_43df3b7b-df84-42bf-8eeb-b8124f86a152.mp4"
        />
        <div className="absolute inset-0 bg-groove-bg/80" />
        <div className="relative max-w-6xl mx-auto px-6 pt-8 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left order-2 md:order-1">
          <p className="uppercase tracking-[0.3em] text-xs text-groove-primary mb-5">Undangan Online Premium</p>
          <h1 className="font-groove-display text-4xl md:text-5xl leading-tight mb-6" style={{ fontWeight: 500 }}>
            Bagikan momen bahagiamu lebih mudah{" "}
            <span className="font-script text-5xl md:text-6xl text-groove-primary" style={{ fontWeight: 600 }}>
              bersama
            </span>{" "}
            BaliInvitation
          </h1>
          <p className="text-groove-ink/70 max-w-md mx-auto md:mx-0 mb-8 text-base">
            Buat undangan pernikahan digital, kelola tamu &amp; RSVP, semuanya dari satu tempat.
          </p>
          <div className="flex flex-col sm:flex-row items-center md:items-start justify-center md:justify-start gap-4">
            <a
              href={heroWaLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-groove-ink text-groove-bg text-sm tracking-wide hover:opacity-90 transition"
            >
              Buat Undangan
            </a>
            <Link
              href="/contoh-undangan"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-groove-line text-groove-ink text-sm tracking-wide hover:bg-groove-line/30 transition text-center"
            >
              Lihat Contoh Undangan
            </Link>
          </div>
        </div>
        <div className="order-1 md:order-2 flex justify-center">
          <PhoneMockup src="/theme-preview/lume?intro=0" width={260} />
        </div>
        </div>
      </section>

      {/* Trust / features */}
      <section className="bg-white/50 border-y border-groove-line">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <ScrollReveal className="text-center mb-10">
            <h2 className="font-groove-display text-2xl md:text-3xl" style={{ fontWeight: 500 }}>
              Kenapa Pilih BaliInvitation
            </h2>
          </ScrollReveal>
          <ul className="grid sm:grid-cols-2 gap-x-8 gap-y-4">
            {FEATURES.map((f, i) => (
              <ScrollReveal key={f} delay={i * 60}>
                <li className="flex items-start gap-3 text-sm text-groove-ink/75">
                  <span className="text-groove-primary mt-0.5">✓</span>
                  <span>{f}</span>
                </li>
              </ScrollReveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Themes — judul sengaja tidak menyebut angka ("Tiga Gaya") karena
          daftar tema akan terus bertambah. Thumbnail pakai screenshot statis
          (bukan iframe live) supaya landing page tidak nge-load 3+ halaman
          penuh sekaligus — cukup regenerate lewat scripts/capture-screenshots.js
          tiap kali desain tema berubah. */}
      <section id="tema" className="max-w-5xl mx-auto px-6 py-24">
        <ScrollReveal className="text-center mb-12">
          <p className="uppercase tracking-[0.25em] text-xs text-groove-primary mb-3">Pilihan Tema</p>
          <h2 className="font-groove-display text-3xl md:text-4xl" style={{ fontWeight: 500 }}>
            Jelajahi Semua Tema
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-10">
          {THEMES.map((theme, i) => (
            <ScrollReveal key={theme.key} delay={i * 120}>
              <div className="flex flex-col items-center text-center border border-groove-line rounded-2xl bg-white/50 p-8 sm:p-10">
                <div className="flex items-end justify-center gap-3 mb-2">
                  <LaptopFrame
                    src={`/landing/thumbnails/${theme.key}-laptop.png`}
                    width={LAPTOP_WIDTH}
                  />
                  <PhoneFrame
                    src={`/landing/thumbnails/${theme.key}-phone.png`}
                    width={PHONE_WIDTH}
                  />
                </div>
                <h3 className="font-groove-display text-2xl mb-1" style={{ fontWeight: 500 }}>{theme.name}</h3>
                <p className="text-xs uppercase tracking-widest text-groove-primary mb-3">{theme.tagline}</p>
                <p className="text-sm text-groove-ink/70 mb-4">{theme.desc}</p>
                <a
                  href={`/theme-preview/${theme.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-groove-ink underline underline-offset-4 hover:text-groove-primary transition-colors"
                >
                  Lihat Preview →
                </a>
              </div>
            </ScrollReveal>
          ))}
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
