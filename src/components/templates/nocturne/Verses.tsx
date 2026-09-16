"use client";

import { useRef, useState } from "react";
import { useScroll, useMotionValueEvent } from "motion/react";
import { InvitationData } from "@/types/invitation";

const IMAGE_COUNT = 5;
// Placeholder generik (bukan kutipan client) — dipakai kalau admin belum isi
// `quote`. Beda dari kutipan di Hero supaya dua section berdekatan ini tidak
// menampilkan kalimat yang sama persis.
const DEFAULT_VERSE = "Two are better than one, for they have a good return for their labor.";
const DEFAULT_IMAGES = Array.from(
  { length: IMAGE_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-verse-${i}/1200/1500`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Section "Verses" — scroll-driven: container-nya sengaja TINGGI (5x100vh),
// isinya cuma satu viewport "sticky" yang nempel di layar selama scroll itu
// berlangsung, sementara foto di belakangnya berganti tiap 1/5 dari total
// scroll (5 foto). Section ini dirender TEPAT SESUDAH Hero (yang sticky-nya
// di-set di Hero.tsx) supaya background gelap section ini menutupi Hero saat
// scroll masuk ke sini (lihat komentar di Hero.tsx).
export default function Verses({ data }: { data: InvitationData }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const photoOnly = (data.galleryImages ?? []).filter((src) => !VIDEO_EXT_RE.test(src));
  const images = photoOnly.length
    ? Array.from({ length: IMAGE_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_IMAGES;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(IMAGE_COUNT - 1, Math.max(0, Math.floor(v * IMAGE_COUNT)));
    setActiveIndex(idx);
  });

  return (
    <div ref={containerRef} className="relative z-10" style={{ height: `${IMAGE_COUNT * 100}vh` }}>
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-black flex items-center justify-center">
        {images.map((src, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={i}
            src={src}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out"
            style={{ opacity: i === activeIndex ? 0.3 : 0 }}
          />
        ))}
        <div className="absolute inset-0 bg-black/70" />

        <p className="relative max-w-4xl text-center font-nocturne-display italic text-3xl sm:text-4xl md:text-6xl leading-tight text-groove-primary-light px-6 md:px-10">
          {data.quote || DEFAULT_VERSE}
        </p>
      </div>
    </div>
  );
}
