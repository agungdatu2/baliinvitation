"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "motion/react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Fade backdrop hitam (yang bikin efek "Hero ketutup halus") tuntas di 12%
// pertama dari total scroll section ini (~60vh dari 500vh) — sisanya (88%)
// dipakai buat gilir 5 foto dengan tenang.
const FADE_IN_END = 0.12;
// Placeholder generik (bukan kutipan client) — dipakai kalau admin belum isi
// `quote`. Beda dari kutipan di Hero supaya dua section berdekatan ini tidak
// menampilkan kalimat yang sama persis.
const DEFAULT_VERSE = "Two are better than one, for they have a good return for their labor.";
const DEFAULT_IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-verse-${i}/900/1200`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Verses" — scroll-driven: container-nya sengaja TINGGI (5x100vh),
// isinya cuma satu viewport "sticky" yang nempel di layar selama scroll itu
// berlangsung. Dua lapis animasi dikontrol scroll-progress yang sama:
// 1. Backdrop hitam + kutipan fade-in halus di awal (bikin Hero yang sticky
//    di section sebelumnya kelihatan "melebur" ke hitam, bukan ketutup mendadak).
// 2. Kartu foto KECIL portrait (bukan full-bleed) di belakang kutipan, gantian
//    tiap 1/5 dari total scroll (5 foto) — seperti slide.
export default function Verses({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const fadeIn = useTransform(scrollYProgress, [0, FADE_IN_END], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(IMAGE_COUNT - 1, Math.max(0, Math.floor(v * IMAGE_COUNT)));
    setActiveIndex(idx);
  });

  return (
    <div ref={containerRef} className="relative z-10" style={{ height: `${IMAGE_COUNT * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* Backdrop hitam — fade-in halus, BUKAN langsung opaque, supaya Hero
            di baliknya kelihatan melebur pelan-pelan alih-alih ketutup mendadak. */}
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: fadeIn }} />

        {/* Kartu foto kecil portrait — di belakang kutipan (layered, bukan full-bleed) */}
        <div className="relative w-36 sm:w-44 md:w-56 aspect-[3/4] overflow-hidden rounded-sm shrink-0">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
              style={{ opacity: i === activeIndex ? 1 : 0 }}
            />
          ))}
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Kutipan — overlay di atas kartu foto, center persis sama */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          <motion.p
            style={{ opacity: fadeIn }}
            className="max-w-xs sm:max-w-sm md:max-w-lg text-center font-nocturne-display italic text-xl sm:text-2xl md:text-4xl leading-snug text-groove-primary-light"
          >
            {data.quote || DEFAULT_VERSE}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
