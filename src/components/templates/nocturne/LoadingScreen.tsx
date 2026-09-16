"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
  groomNickname: string;
  brideNickname: string;
  images?: string[]; // foto galeri — crossfade full-bleed di background
}

const DURATION_MS = 5500;
const COMPLETE_DELAY_MS = 500;
const PHASE_SWITCH_MS = 1800; // "THE WEDDING OF" tampil dulu, baru crossfade ke nama pasangan
const PHOTO_INTERVAL_MS = 1800;
const PHOTO_COUNT = 5;

const DEFAULT_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-loading-${i}/1200/1500`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Loading screen tema "Nocturne" — beda struktural dari Lume/Muse/Reverie:
// - Background foto galeri crossfade FULL-BLEED (bukan kartu/cincin kecil di
//   tengah) dengan overlay gelap, supaya foto tetap kelihatan "hidup" di
//   belakang teks nama pasangan.
// - Teks tampil 2 tahap: "THE WEDDING OF" dulu, baru crossfade ke nama
//   pasangan — groom rata kiri (nempel tepi kiri), bride rata kanan (nempel
//   tepi kanan), dipisah "&" kecil di tengah.
// - Logo BaliInvitation pojok kiri-atas, progress bar + persen TEPAT DI
//   BAWAHNYA (Lume/Muse taruh persen di pojok kanan-bawah, sengaja beda).
export default function LoadingScreen({ onComplete, groomNickname, brideNickname, images }: LoadingScreenProps) {
  // Background cuma bisa render foto — video (kalau ada di galeri) di-skip di sini,
  // ditampilkan di section Gallery nanti.
  const photoOnly = images?.filter((src) => !VIDEO_EXT_RE.test(src));
  const photos = photoOnly?.length
    ? Array.from({ length: PHOTO_COUNT }, (_, i) => photoOnly[i % photoOnly.length])
    : DEFAULT_PHOTOS;

  const [progress, setProgress] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [phase, setPhase] = useState<"intro" | "names">("intro");
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [photos.length]);

  useEffect(() => {
    const timeout = setTimeout(() => setPhase("names"), PHASE_SWITCH_MS);
    return () => clearTimeout(timeout);
  }, []);

  // Counter 0 -> 100% selama DURATION_MS via requestAnimationFrame, lalu onComplete setelah jeda.
  useEffect(() => {
    const start = performance.now();
    let rafId: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / DURATION_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => onCompleteRef.current(), COMPLETE_DELAY_MS);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const pctRounded = Math.round(progress);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] overflow-hidden bg-groove-stone"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      {/* Background — foto galeri crossfade full-bleed */}
      <AnimatePresence initial={false}>
        <motion.img
          key={photoIndex}
          src={photos[photoIndex]}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-groove-stone/70" />

      {/* Logo + progress bar — pojok kiri-atas */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 flex flex-col gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Image
          src="/brand/logo.webp"
          alt="BaliInvitation"
          width={220}
          height={65}
          className="w-24 md:w-28 h-auto"
          style={{ filter: "brightness(0) invert(1)" }}
        />
        <div className="flex items-center gap-2">
          <div className="w-24 md:w-28 h-[3px] bg-groove-bg/25 overflow-hidden rounded-full">
            <div className="h-full bg-groove-bg" style={{ width: `${progress}%` }} />
          </div>
          <span className="font-groove-label text-[11px] tabular-nums text-groove-bg/80">{pctRounded}%</span>
        </div>
      </motion.div>

      {/* Teks tengah — 2 tahap */}
      <div className="relative h-full w-full flex items-center justify-center px-6">
        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.p
              key="intro"
              className="font-nocturne-display italic text-2xl md:text-4xl tracking-[0.15em] text-groove-bg text-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              THE WEDDING OF
            </motion.p>
          ) : (
            <motion.div
              key="names"
              className="w-full flex items-center justify-between gap-3 md:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.h1
                className="flex-1 min-w-0 font-nocturne-display uppercase text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-groove-bg text-left leading-none truncate"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {groomNickname}
              </motion.h1>
              <span className="font-nocturne-display italic text-lg md:text-2xl text-groove-bg/70 shrink-0">&amp;</span>
              <motion.h1
                className="flex-1 min-w-0 font-nocturne-display uppercase text-3xl sm:text-4xl md:text-6xl lg:text-7xl text-groove-bg text-right leading-none truncate"
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {brideNickname}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
