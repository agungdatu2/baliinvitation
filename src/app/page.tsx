import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildWaLink } from "@/lib/utils/whatsapp";
import { DEFAULT_HERO_VIDEO_URL } from "@/components/templates/lume/PlaceholderPhoto";
import ScrollReveal from "@/components/landing/ScrollReveal";

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

const ADDONS = [
  { label: "Tambahan sesi acara / 2 link jadwal berbeda", price: "Rp 100.000" },
  { label: "Ubah cover asli jadi video", price: "Rp 30.000" },
  { label: "Tambah kuota galeri foto", price: "Rp 35.000" },
  { label: "Undangan multi-bahasa (ID/EN)", price: "Rp 100.000" },
  { label: "Link aktif seumur hidup", price: "Rp 100.000" },
];

const EXAMPLE_SLUG = "agung-sintia";

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
    <main className="min-h-screen bg-groove-ink text-groove-bg font-groove-body">
      {/* Hero — video full-bleed + nav overlay + tipografi raksasa */}
      <section className="relative min-h-screen flex flex-col overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={DEFAULT_HERO_VIDEO_URL}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/55 to-black/85" />

        <header className="relative z-10 max-w-6xl mx-auto w-full px-6 py-6 flex items-center justify-between">
          <p className="font-groove-display text-lg tracking-wide" style={{ fontWeight: 600 }}>
            BaliInvitation
          </p>
          <nav className="flex items-center gap-6 text-sm">
            <a href="#tema" className="hidden sm:inline text-groove-bg/70 hover:text-groove-bg transition-colors">Tema</a>
            <a href="#paket" className="hidden sm:inline text-groove-bg/70 hover:text-groove-bg transition-colors">Paket</a>
            <Link href="/admin" className="text-groove-bg/50 hover:text-groove-bg transition-colors">
              Admin
            </Link>
          </nav>
        </header>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6">
          <p className="uppercase tracking-[0.35em] text-xs text-groove-primary-light mb-6">
            Undangan Pernikahan Digital
          </p>
          <h1
            className="font-groove-display uppercase leading-[0.92] mb-8 text-6xl sm:text-8xl md:text-9xl"
            style={{ fontWeight: 500 }}
          >
            Undangan
            <br />
            Digital
          </h1>
          <p className="text-groove-bg/75 max-w-xl mx-auto mb-10 text-base md:text-lg">
            Elegan &amp; berkesan — buat undangan, kelola tamu &amp; RSVP, semuanya dari satu tempat.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={heroWaLink}
              target="_blank"
              rel="noreferrer"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-groove-bg text-groove-ink text-sm tracking-wide hover:opacity-90 transition"
            >
              Pesan via WhatsApp
            </a>
            <Link
              href={`/${EXAMPLE_SLUG}`}
              target="_blank"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border border-groove-bg/40 text-groove-bg text-sm tracking-wide hover:bg-groove-bg/10 transition"
            >
              Lihat Contoh Undangan
            </Link>
          </div>
        </div>

        <div className="relative z-10 pb-8 flex flex-col items-center gap-2 text-groove-bg/50">
          <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
          <span className="w-px h-8 bg-groove-bg/30 animate-pulse" />
        </div>
      </section>

      {/* Themes */}
      <section id="tema" className="max-w-5xl mx-auto px-6 py-24">
        <ScrollReveal className="text-center mb-12">
          <p className="uppercase tracking-[0.25em] text-xs text-groove-primary-light mb-3">Pilihan Tema</p>
          <h2 className="font-groove-display text-3xl md:text-4xl" style={{ fontWeight: 500 }}>
            Tiga Gaya, Satu Standar Elegan
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-3 gap-6">
          {THEMES.map((theme, i) => (
            <ScrollReveal key={theme.key} delay={i * 120}>
              <div className="border border-groove-line-dark rounded-2xl p-6 bg-groove-bg/5 flex flex-col h-full">
                <h3 className="font-groove-display text-2xl mb-1" style={{ fontWeight: 500 }}>{theme.name}</h3>
                <p className="text-xs uppercase tracking-widest text-groove-primary-light mb-4">{theme.tagline}</p>
                <p className="text-sm text-groove-bg/70 mb-6 flex-1">{theme.desc}</p>
                <a
                  href={`/theme-preview/${theme.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-groove-bg underline underline-offset-4 hover:text-groove-primary-light transition-colors"
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
          <p className="uppercase tracking-[0.25em] text-xs text-groove-primary-light mb-3">Paket Harga</p>
          <h2 className="font-groove-display text-3xl md:text-4xl" style={{ fontWeight: 500 }}>
            Pilih Paket Sesuai Kebutuhan
          </h2>
        </ScrollReveal>
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {packages.map((pkg, i) => (
            <ScrollReveal key={pkg.id} delay={i * 120}>
              <div className="border border-groove-line-dark rounded-2xl p-8 bg-groove-bg/5 flex flex-col h-full">
                <h3 className="font-groove-display text-2xl mb-1" style={{ fontWeight: 500 }}>{pkg.name}</h3>
                <p className="font-groove-display text-3xl mb-6" style={{ fontWeight: 600 }}>{formatRupiah(pkg.price)}</p>
                <ul className="space-y-2.5 mb-8 flex-1">
                  {(pkg.features as string[]).map((f) => (
                    <li key={f} className="text-sm text-groove-bg/70 flex items-start gap-2">
                      <span className="text-groove-primary-light mt-0.5">✓</span>
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
                  className="text-center px-6 py-3 rounded-full bg-groove-bg text-groove-ink text-sm tracking-wide hover:opacity-90 transition"
                >
                  Pilih Paket Ini
                </a>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Add-ons */}
        <ScrollReveal delay={240} className="max-w-3xl mx-auto mt-10">
          <div className="border border-groove-line-dark rounded-2xl p-6 bg-groove-bg/5">
            <p className="text-xs uppercase tracking-widest text-groove-primary-light mb-4">Fitur Tambahan (Add-On)</p>
            <ul className="space-y-2">
              {ADDONS.map((a) => (
                <li key={a.label} className="flex items-center justify-between text-sm gap-4">
                  <span className="text-groove-bg/70">{a.label}</span>
                  <span className="text-groove-bg/40 whitespace-nowrap">{a.price}</span>
                </li>
              ))}
            </ul>
          </div>
        </ScrollReveal>
      </section>

      {/* Footer / contact */}
      <footer className="border-t border-groove-line-dark">
        <div className="max-w-5xl mx-auto px-6 py-12 flex flex-col items-center gap-5 text-center">
          <p className="font-groove-display text-lg" style={{ fontWeight: 500 }}>Punya pertanyaan?</p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <a
              href={heroWaLink}
              target="_blank"
              rel="noreferrer"
              className="text-groove-bg/70 hover:text-groove-bg transition-colors"
            >
              WhatsApp {CREATOR.whatsappLabel}
            </a>
            <a
              href={`https://instagram.com/${CREATOR.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="text-groove-bg/70 hover:text-groove-bg transition-colors"
            >
              @{CREATOR.instagramHandle}
            </a>
          </div>
          <p className="text-xs text-groove-bg/40">© {new Date().getFullYear()} BaliInvitation — All rights reserved</p>
        </div>
      </footer>
    </main>
  );
}
