"use client";

import { useEffect, useMemo, useState } from "react";
import ScrollReveal from "@/components/landing/ScrollReveal";
import LaptopFrame from "@/components/landing/LaptopFrame";
import PhoneFrame from "@/components/landing/PhoneFrame";

// Ukuran mockup laptop+HP di section Tema — ditampilkan berdampingan
// (bukan tumpang tindih) supaya kedua device kelihatan utuh.
const LAPTOP_WIDTH = 220;
const PHONE_WIDTH = 65;

export interface LandingTheme {
  key: string;
  name: string;
  tagline: string | null;
  description: string | null;
  features: string[];
  isMostPopular: boolean;
  category: string;
}

// Urutan & label tab di landing (label sengaja lebih ramah dari label admin).
const TABS: { category: string; label: string }[] = [
  { category: "wedding", label: "Wedding" },
  { category: "ulang-tahun", label: "Birthday" },
  { category: "melaspas", label: "Melaspas & Bisnis" },
  { category: "potong-gigi", label: "Potong Gigi" },
];

// Tab kategori + grid kartu tema. Tab hanya muncul untuk kategori yang punya tema
// aktif, jadi kategori baru otomatis ikut begitu ada tema pertamanya.
export default function ThemeTabs({ themes }: { themes: LandingTheme[] }) {
  const tabs = useMemo(
    () =>
      TABS.map((t) => ({ ...t, count: themes.filter((th) => th.category === t.category).length })).filter((t) => t.count > 0),
    [themes]
  );
  const [active, setActive] = useState(tabs[0]?.category ?? "wedding");

  // Link langsung ke tab tertentu: /?kategori=ulang-tahun
  useEffect(() => {
    const wanted = new URLSearchParams(window.location.search).get("kategori");
    if (wanted && tabs.some((t) => t.category === wanted)) setActive(wanted);
  }, [tabs]);

  const visible = themes.filter((th) => th.category === active);

  return (
    <div>
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Kategori tema" className="mb-10 flex flex-wrap justify-center gap-3">
          {tabs.map((t) => {
            const selected = t.category === active;
            return (
              <button
                key={t.category}
                role="tab"
                aria-selected={selected}
                type="button"
                onClick={() => setActive(t.category)}
                className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  selected
                    ? "text-groove-ink shadow-lg"
                    : "border border-white/40 text-white/80 hover:bg-white/10 hover:text-white"
                }`}
                style={selected ? { backgroundImage: "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 100%)" } : undefined}
              >
                {t.label}
              </button>
            );
          })}
        </div>
      )}

      <div key={active} role="tabpanel" className="grid animate-fadeIn gap-8 sm:grid-cols-2">
        {visible.map((theme, i) => {
          // Template.name disimpan lengkap ("Lume - Elegant Minimalist") untuk
          // dropdown admin; kartu di sini cuma perlu nama pendeknya.
          const displayName = theme.name.split(" - ")[0];
          return (
            // Kartu kaca beneran — pakai .groove-glass-strong (tint tipis + blur) supaya
            // video di section ini tetap kelihatan tembus. Panel kaca ini SENGAJA tidak
            // dibungkus ScrollReveal (opacity/transform animasi) — backdrop-filter di atas
            // video akan "ngebug"/gak ke-apply blurnya di Safari kalau ancestor-nya lagi
            // animasi opacity. Yang di-fade cuma konten di dalamnya.
            <div
              key={theme.key}
              className="groove-glass-strong relative flex flex-col items-center rounded-[2.5rem] p-8 text-center transition-all duration-500 hover:-translate-y-2 sm:p-10"
            >
              <ScrollReveal delay={i * 120} className="flex w-full flex-col items-center text-center">
                {theme.isMostPopular && (
                  <span
                    className="absolute right-6 top-6 rounded-full px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-groove-ink"
                    style={{ backgroundImage: "linear-gradient(135deg, #e8cd8a 0%, #c9a45c 100%)" }}
                  >
                    Most Popular
                  </span>
                )}
                {/* Nama tema — gradient emas solid, konsisten di semua tema. */}
                <h3
                  className="mb-4 font-groove-display text-6xl uppercase leading-none sm:text-7xl"
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

                <div className="mb-6 h-px w-16 bg-groove-primary-light/50" />

                <div className="mb-8 flex items-end justify-center gap-3">
                  <LaptopFrame src={`/landing/thumbnails/${theme.key}-laptop.png`} width={LAPTOP_WIDTH} />
                  <PhoneFrame src={`/landing/thumbnails/${theme.key}-phone.png`} width={PHONE_WIDTH} />
                </div>

                <p className="mb-3 text-xs uppercase tracking-widest text-groove-primary-light">{theme.tagline}</p>
                <p className="mb-6 min-h-[2.5em] text-sm text-white/70">{theme.description}</p>
                <ul className="mb-8 w-full space-y-3 text-left">
                  {theme.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-white/80">
                      <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-groove-primary-light/15">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 text-groove-primary-light">
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
                  className="block w-full rounded-full border border-white/40 px-8 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Lihat Preview
                </a>
              </ScrollReveal>
            </div>
          );
        })}
      </div>
    </div>
  );
}
