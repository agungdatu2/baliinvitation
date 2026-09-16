"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "motion/react";
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
// Total geser track (dalam % lebar TRACK sendiri, bukan lebar jendela) supaya
// foto terakhir pas berhenti di jendela — track lebarnya IMAGE_COUNT x jendela,
// jadi tiap 1 foto = (100/IMAGE_COUNT)% dari track, total (IMAGE_COUNT-1) foto
// yang perlu digeser.
const TRACK_END_PCT = -((IMAGE_COUNT - 1) / IMAGE_COUNT) * 100;

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Verses" — scroll-driven: container-nya sengaja TINGGI (5x100vh),
// isinya cuma satu viewport "sticky" yang nempel di layar selama scroll itu
// berlangsung.
// - Backdrop hitam + kutipan fade-in SEKALI di awal (Hero ketutup halus),
//   lalu backdrop dikunci solid seterusnya (lihat `revealed` — begitu true,
//   tidak pernah balik false walau scroll ke atas).
// - Foto ditampilkan sebagai FILMSTRIP horizontal (kayak marquee) di jendela
//   kecil portrait di belakang kutipan — seluruh track digeser terus-menerus
//   mengikuti scroll (bukan potongan slide-masuk/slide-keluar per foto),
//   jadi kelihatan "mengalir" halus dari satu foto ke foto berikutnya.
export default function Verses({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const fadeIn = useTransform(scrollYProgress, [0, FADE_IN_END], [0, 1]);
  // Track filmstrip cuma mulai bergerak SETELAH fade awal tuntas, lalu mengalir
  // terus-menerus (bukan lompat per index) sampai akhir scroll section ini.
  const trackX = useTransform(scrollYProgress, [FADE_IN_END, 1], ["0%", `${TRACK_END_PCT}%`]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
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

        {/* Jendela kecil portrait — di belakang kutipan. Isinya filmstrip
            (track) selebar IMAGE_COUNT x jendela, digeser terus mengikuti
            scroll (style={{x: trackX}}) supaya kelihatan mengalir kayak marquee. */}
        <motion.div
          style={{ opacity: fadeIn }}
          className="relative w-36 sm:w-44 md:w-56 aspect-[3/4] overflow-hidden rounded-sm shrink-0"
        >
          <motion.div className="flex h-full" style={{ width: `${IMAGE_COUNT * 100}%`, x: trackX }}>
            {images.map((src, i) => (
              <div key={i} className="relative h-full shrink-0" style={{ width: `${100 / IMAGE_COUNT}%` }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
              </div>
            ))}
          </motion.div>
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />
        </motion.div>

        {/* Kutipan — overlay di atas jendela foto, center persis sama */}
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
