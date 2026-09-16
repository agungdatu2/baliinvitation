"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion, AnimatePresence } from "motion/react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Fade backdrop hitam + kutipan (yang bikin efek "Hero ketutup halus") tuntas
// di 12% pertama dari total scroll section ini (~60vh dari 500vh) — SEKALI
// jalan di awal saja. Sesudah itu backdrop dikunci solid (bukan ikut computed
// dari scroll lagi) supaya tidak pernah kelihatan transparan lagi walau
// scroll naik-turun di dalam section ini.
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
// berlangsung.
// - Backdrop hitam + kutipan fade-in SEKALI di awal (Hero ketutup halus),
//   lalu backdrop dikunci solid seterusnya (lihat `revealed` — begitu true,
//   tidak pernah balik false walau scroll ke atas).
// - Kartu foto kecil portrait di belakang kutipan, baru mulai tampil setelah
//   fade awal itu tuntas. SETIAP pergantian foto (bukan cuma yang pertama)
//   masuk dari kiri sambil fade-in, lalu keluar ke kanan sambil fade-out —
//   seperti conveyor/slider yang jalan terus tiap 1/5 dari total scroll.
export default function Verses({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const fadeIn = useTransform(scrollYProgress, [0, FADE_IN_END], [0, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(IMAGE_COUNT - 1, Math.max(0, Math.floor(v * IMAGE_COUNT)));
    setActiveIndex(idx);
    if (v >= FADE_IN_END) setRevealed(true);
  });

  return (
    <div ref={containerRef} className="relative z-10" style={{ height: `${IMAGE_COUNT * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* Backdrop hitam — fade-in halus sekali di awal (Hero melebur ke hitam),
            lalu dikunci bg-black solid (className, bukan style) begitu `revealed`
            true, supaya tidak pernah transparan lagi setelahnya. */}
        {revealed ? (
          <div className="absolute inset-0 bg-black" />
        ) : (
          <motion.div className="absolute inset-0 bg-black" style={{ opacity: fadeIn }} />
        )}

        {/* Kartu foto kecil portrait — di belakang kutipan, baru dirender setelah
            fade awal tuntas. Tiap ganti activeIndex: masuk dari kiri + fade-in,
            keluar ke kanan + fade-out (AnimatePresence, bukan cuma toggle opacity). */}
        {revealed && (
          <div className="relative w-36 sm:w-44 md:w-56 aspect-[3/4] overflow-hidden rounded-sm shrink-0">
            <AnimatePresence initial={true}>
              <motion.img
                key={activeIndex}
                src={images[activeIndex]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ x: "-100%", opacity: 0 }}
                animate={{ x: "0%", opacity: 1 }}
                exit={{ x: "100%", opacity: 0 }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-black/25" />
          </div>
        )}

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
