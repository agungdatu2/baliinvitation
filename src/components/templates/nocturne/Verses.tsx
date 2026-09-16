"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, useSpring, motion } from "motion/react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// vh per foto — dinaikkan dari 100 supaya tiap lintasan foto butuh scroll
// lebih panjang (kerasa lebih pelan/halus), bukan lewat cuma dalam 1 gulungan
// scroll singkat.
const VH_PER_IMAGE = 160;
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
// - Kartu foto kecil portrait MELINTASI SELURUH LEBAR LAYAR (dari luar tepi
//   kiri ke luar tepi kanan, lewat tengah pas di belakang kutipan) — bukan
//   cuma bergeser sedikit di jendela kecil. Sisa scroll (setelah fade awal)
//   dibagi rata ke 5 foto; tiap foto dapat jatahnya sendiri buat melintas,
//   lalu foto berikutnya mulai dari kiri lagi — terus-menerus mengikuti
//   scroll (bukan animasi berbasis waktu), jadi kelihatan mengalir kayak
//   marquee raksasa selebar layar.
export default function Verses({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress: rawProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Spring, bukan langsung raw scroll — biar gerakannya halus (ada sedikit
  // "lag"/inertia mengejar posisi scroll), bukan lompat kaku 1:1 per pixel.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 90, damping: 25, mass: 0.5 });
  const fadeIn = useTransform(scrollYProgress, [0, FADE_IN_END], [0, 1]);

  // Posisi kartu foto: -35vw di awal jatahnya, 0vw (tengah layar, pas di
  // belakang kutipan) di pertengahan jatahnya, +35vw di akhir jatahnya — lalu
  // foto berikutnya mulai dari -35vw lagi. Sengaja TIDAK sampai ±100vw (luar
  // tepi layar) lagi supaya masuk/keluarnya tidak mentok banget ke pinggir.
  const imageX = useTransform(scrollYProgress, (v) => {
    const local = Math.max(0, (v - FADE_IN_END) / (1 - FADE_IN_END)) * IMAGE_COUNT;
    const frac = local - Math.floor(local);
    return `${frac * 70 - 35}vw`;
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= FADE_IN_END) setRevealed(true);
    const local = Math.max(0, (v - FADE_IN_END) / (1 - FADE_IN_END)) * IMAGE_COUNT;
    setActiveIndex(Math.min(IMAGE_COUNT - 1, Math.floor(local)));
  });

  return (
    <div ref={containerRef} className="relative z-10" style={{ height: `${IMAGE_COUNT * VH_PER_IMAGE}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden flex items-center justify-center">
        {/* Backdrop hitam — fade-in halus sekali di awal (Hero melebur ke hitam),
            lalu dikunci bg-black solid (className, bukan style) begitu `revealed`
            true, supaya tidak pernah transparan lagi setelahnya. */}
        {revealed ? (
          <div className="absolute inset-0 bg-black" />
        ) : (
          <motion.div className="absolute inset-0 bg-black" style={{ opacity: fadeIn }} />
        )}

        {/* Kartu foto kecil portrait — posisi rest-nya di tengah (flex child
            biasa, BUKAN absolute, supaya `x` di bawah ini murni jadi OFFSET
            dari posisi tengah itu, bukan ketiban logic centering lain). */}
        <motion.div
          style={{ x: imageX }}
          className="relative w-36 sm:w-44 md:w-56 aspect-[3/4] overflow-hidden rounded-sm shrink-0"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={images[activeIndex]} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/25" />
        </motion.div>

        {/* Kutipan — overlay di tengah layar, TIDAK ikut geser (posisinya tetap,
            foto yang lewat di belakangnya) */}
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
