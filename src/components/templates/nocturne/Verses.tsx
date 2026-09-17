"use client";

import { RefObject, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, useSpring, motion } from "motion/react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// vh per foto — dinaikkan dari 100 supaya tiap lintasan foto butuh scroll
// lebih panjang (kerasa lebih pelan/halus), bukan lewat cuma dalam 1 gulungan
// scroll singkat.
const VH_PER_IMAGE = 160;
// Transisi masuk section ini dipecah 2 tahap berurutan (bukan barengan):
// 1) Hero meredup pelan-pelan sampai BENAR-BENAR HITAM (0 -> HERO_DIM_END).
//    Kutipan & foto masih disembunyikan total di tahap ini.
// 2) Baru SESUDAH hitam penuh, kutipan (dan foto pertama) fade-in di atas
//    layar hitam itu (HERO_DIM_END -> CONTENT_IN_END).
// Keduanya SEKALI jalan di awal saja — sesudah itu backdrop dikunci solid
// (lihat `revealed`) supaya tidak pernah kelihatan transparan lagi walau
// scroll naik-turun di dalam section ini.
// Diekspor supaya Hero bisa pakai titik yang SAMA persis buat overlay
// peredupannya sendiri (lihat komentar di Hero.tsx).
export const HERO_DIM_END = 0.07;
const CONTENT_IN_END = 0.15;
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
interface VersesProps {
  data: InvitationData;
  // Ref ke container luar (yang tinggi, non-sticky) di-lift ke NocturneTemplate
  // supaya Hero.tsx bisa pakai sumber scroll-progress yang SAMA PERSIS untuk
  // overlay peredupannya sendiri — lihat komentar di Hero.tsx kenapa ini
  // penting (dulu overlay hidup di sini, foto Hero-nya masih sempat kelihatan
  // "nyempil" sesaat sebelum section ini benar-benar menutup penuh).
  containerRef: RefObject<HTMLDivElement>;
}

export default function Verses({ data, containerRef }: VersesProps) {
  const [revealed, setRevealed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress: rawProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Spring lebih lembut (stiffness lebih rendah, damping tinggi = overdamped,
  // tidak mantul) — biar gerakannya kerasa mengalir/elastis, bukan lompat
  // kaku 1:1 per pixel scroll.
  const scrollYProgress = useSpring(rawProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  // Tahap 1 — Hero meredup jadi hitam. Ini SATU-SATUNYA yang menggerakkan
  // opacity backdrop, jadi kutipan/foto belum ikut nongol di tahap ini.
  const heroDim = useTransform(scrollYProgress, [0, HERO_DIM_END], [0, 1]);
  // Tahap 2 — kutipan & foto pertama fade-in, baru mulai SETELAH layar sudah
  // hitam penuh (clamp default useTransform bikin ini 0 selama v < HERO_DIM_END).
  const contentFade = useTransform(scrollYProgress, [HERO_DIM_END, CONTENT_IN_END], [0, 1]);

  // Fraksi 0..1 per lintasan foto (dipakai bersama oleh posisi & opacity di
  // bawah supaya keduanya selalu sinkron persis).
  const lapFraction = (v: number) => {
    const local = Math.max(0, (v - CONTENT_IN_END) / (1 - CONTENT_IN_END)) * IMAGE_COUNT;
    return local - Math.floor(local);
  };
  // Ease in-out kubik — supaya foto melambat di ujung lintasan dan cepat di
  // tengah, kerasa "mengalir" alih-alih kecepatan konstan yang terasa mekanis.
  const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - Math.pow(-2 * t + 2, 3) / 2);

  // Posisi kartu foto: -35vw di awal jatahnya, 0vw (tengah layar, pas di
  // belakang kutipan) di pertengahan jatahnya, +35vw di akhir jatahnya — lalu
  // foto berikutnya mulai dari -35vw lagi. Sengaja TIDAK sampai ±100vw (luar
  // tepi layar) lagi supaya masuk/keluarnya tidak mentok banget ke pinggir.
  const imageX = useTransform(scrollYProgress, (v) => `${easeInOutCubic(lapFraction(v)) * 70 - 35}vw`);

  // Opacity foto = gabungan dua hal:
  // (1) `contentFade` — supaya foto TIDAK "muncul duluan": baru ikut fade-in
  //     bareng kutipan, sesudah Hero benar-benar hitam (tahap 2 di atas).
  // (2) `lapOpacity` — turun ke 0 sesaat sebelum foto sampai ujung lintasan
  //     dan baru naik lagi sesaat setelah lintasan berikutnya mulai, supaya
  //     "teleport" balik dari +35vw ke -35vw (dan pergantian src foto) terjadi
  //     saat foto tak kasat mata — pergantian jadi terasa halus, bukan patah.
  const EDGE = 0.1;
  const lapOpacity = useTransform(scrollYProgress, (v) => {
    const frac = lapFraction(v);
    if (frac < EDGE) return frac / EDGE;
    if (frac > 1 - EDGE) return (1 - frac) / EDGE;
    return 1;
  });
  const imageOpacity = useTransform([contentFade, lapOpacity], (values) => {
    const [a, b] = values as number[];
    return a * b;
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= HERO_DIM_END) setRevealed(true);
    const local = Math.max(0, (v - CONTENT_IN_END) / (1 - CONTENT_IN_END)) * IMAGE_COUNT;
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
          <motion.div className="absolute inset-0 bg-black" style={{ opacity: heroDim }} />
        )}

        {/* Kartu foto kecil portrait — posisi rest-nya di tengah (flex child
            biasa, BUKAN absolute, supaya `x` di bawah ini murni jadi OFFSET
            dari posisi tengah itu, bukan ketiban logic centering lain). */}
        <motion.div
          style={{ x: imageX, opacity: imageOpacity }}
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
            style={{ opacity: contentFade }}
            className="max-w-xs sm:max-w-sm md:max-w-lg text-center font-nocturne-display italic text-xl sm:text-2xl md:text-4xl leading-snug text-groove-primary-light"
          >
            {data.quote || DEFAULT_VERSE}
          </motion.p>
        </div>
      </div>
    </div>
  );
}
