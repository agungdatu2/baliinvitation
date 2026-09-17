"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const IMAGE_COUNT = 6;
// Jatah scroll per foto jauh lebih pendek dari marquee kartu kecil di Verses
// (160vh) — SENGAJA, supaya latar berganti "cepat" seperti diminta, bukan
// mengalir pelan.
const VH_PER_IMAGE = 70;
// Fraksi kecil di awal buat reveal masuk (judul + foto pertama fade-in) —
// pola sama seperti CONTENT_IN_END di Verses.tsx.
const REVEAL_END = 0.08;
// Tiap foto mulai ZOOM IN (scale > 1) lalu zoom-out ke ukuran normal — bukan
// langsung muncul ukuran final, mengulang tiap kali foto berganti.
const IMAGE_SCALE_START = 1.25;

const DEFAULT_IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-journey-${i}/1600/1200`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Love Story" (chapter title) — kembaran struktural Verses.tsx:
// outer tall wrapper + inner sticky viewport, foto latar full-screen
// berganti cepat sambil zoom-out, judul tetap diam di tengah di atasnya.
// Sama seperti Groom/Bride, backdrop-nya HARUS scroll-reactive (bukan
// bg-black/foto statis) — kalau tidak, section ini akan menutupi BrideSection
// sebelum waktunya saat masih di fase "meluncur naik" pra-sticky (bug yang
// sama persis dengan yang sudah diperbaiki di Groom/Bride).
export default function LoveStorySection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Reveal masuk (judul + foto pertama) — lokal ke container ini sendiri,
  // jadi responsif sejak scroll pertama, tanpa jeda.
  const reveal = useTransform(scrollYProgress, [0, REVEAL_END], [0, 1]);

  const lapFraction = (v: number) => {
    const local = Math.max(0, (v - REVEAL_END) / (1 - REVEAL_END)) * IMAGE_COUNT;
    return local - Math.floor(local);
  };
  const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

  // Zoom-out per foto: mulai IMAGE_SCALE_START di awal jatahnya, turun ke 1
  // di akhir jatahnya, lalu foto berikutnya (src beda) mulai zoom lagi dari
  // IMAGE_SCALE_START — potongan tegas antar-foto (bukan crossfade halus)
  // supaya kerasa "cepat"/energik, bukan mengalir lembut seperti Verses.
  const imageScale = useTransform(scrollYProgress, (v) => {
    const eased = easeOutCubic(lapFraction(v));
    return IMAGE_SCALE_START - (IMAGE_SCALE_START - 1) * eased;
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const local = Math.max(0, (v - REVEAL_END) / (1 - REVEAL_END)) * IMAGE_COUNT;
    setActiveIndex(Math.min(IMAGE_COUNT - 1, Math.floor(local)));
  });

  return (
    // marginTop negatif -100svh SENGAJA — mengkompensasi BrideSection (outer
    // wrapper tinggi + sticky di dalam) yang melepas stiky-nya SATU LAYAR
    // PENUH sebelum wrapper-nya sendiri benar-benar berakhir. Lihat komentar
    // yang sama di GroomSection.tsx/BrideSection.tsx.
    <div ref={containerRef} className="relative z-40 -mt-[100svh]" style={{ height: `${IMAGE_COUNT * VH_PER_IMAGE}vh` }}>
      <section className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black">
        <motion.div style={{ opacity: reveal }} className="absolute inset-0">
          <motion.img
            src={images[activeIndex]}
            alt=""
            style={{ scale: imageScale }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
        </motion.div>

        <motion.div
          style={{ opacity: reveal }}
          className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none"
        >
          <div className="flex items-center gap-3 md:gap-4">
            <h2 className="font-nocturne-display italic text-2xl sm:text-3xl md:text-5xl text-groove-bg text-center">
              {t.loveStoryHeading}
            </h2>
            <span className="hidden sm:flex items-center gap-1.5 text-groove-bg/60">
              <span className="flex gap-1">
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
                <span className="h-1 w-1 rounded-full bg-current" />
              </span>
              <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
            </span>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
