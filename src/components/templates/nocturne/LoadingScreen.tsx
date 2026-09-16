"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";

interface LoadingScreenProps {
  onComplete: () => void;
  groomNickname: string;
  brideNickname: string;
  images?: string[]; // foto galeri — crossfade di kartu portrait kecil tengah layar
}

const DURATION_MS = 3200;
const COMPLETE_DELAY_MS = 300;
const PHASE_SWITCH_MS = 1100; // "THE WEDDING OF" tampil dulu, baru crossfade ke nama pasangan
const PHOTO_INTERVAL_MS = 1300;
const PHOTO_COUNT = 4;

const DEFAULT_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `https://picsum.photos/seed/nocturne-loading-${i}/900/1200`
);

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;

// Loading screen tema "Nocturne" — beda struktural dari Lume/Muse/Reverie:
// - Kartu foto galeri KECIL, portrait, di tengah layar (crossfade), dengan teks
//   di bawahnya — bukan background full-bleed (revisi dari versi pertama, biar
//   nama pasangan tidak "menempel tepi layar" dan tetap terasa satu komposisi
//   dengan foto).
// - Teks tampil 2 tahap: "THE WEDDING OF" dulu, baru crossfade ke nama
//   pasangan — groom kiri, bride kanan, dipisah "&" kecil, TAPI rapat (gap
//   kecil tetap, bukan justify-between ke tepi layar).
// - Logo BaliInvitation pojok kiri-atas (sendiri). Progress bar + persen di
//   BAWAH LAYAR (revisi — sebelumnya di bawah logo).
export default function LoadingScreen({ onComplete, groomNickname, brideNickname, images }: LoadingScreenProps) {
  // Kartu foto cuma bisa render foto — video (kalau ada di galeri) di-skip di sini,
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
      {/* Logo — pojok kiri-atas, sendiri (progress bar sudah dipindah ke bawah layar) */}
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12"
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
      </motion.div>

      {/* Kartu foto kecil portrait + teks — tengah layar */}
      <div className="relative h-full w-full flex flex-col items-center justify-center gap-6 px-6">
        <div className="relative w-32 sm:w-36 md:w-44 aspect-[3/4] overflow-hidden rounded-sm">
          <AnimatePresence initial={false}>
            <motion.img
              key={photoIndex}
              src={photos[photoIndex]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            />
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          {phase === "intro" ? (
            <motion.p
              key="intro"
              className="font-nocturne-display italic text-xl md:text-2xl tracking-[0.15em] text-groove-bg text-center"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              THE WEDDING OF
            </motion.p>
          ) : (
            <motion.div
              key="names"
              className="flex items-center justify-center gap-3 md:gap-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
            >
              <motion.h1
                className="font-nocturne-display uppercase text-2xl sm:text-3xl md:text-4xl text-groove-bg leading-none"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {groomNickname}
              </motion.h1>
              <span className="font-nocturne-display italic text-base md:text-lg text-groove-bg/70 shrink-0">&amp;</span>
              <motion.h1
                className="font-nocturne-display uppercase text-2xl sm:text-3xl md:text-4xl text-groove-bg leading-none"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              >
                {brideNickname}
              </motion.h1>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Progress bar + persen — bawah layar */}
      <motion.div
        className="absolute bottom-10 md:bottom-14 inset-x-0 flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <div className="w-40 md:w-56 h-[3px] bg-groove-bg/25 overflow-hidden rounded-full">
          <div className="h-full bg-groove-bg" style={{ width: `${progress}%` }} />
        </div>
        <span className="font-groove-label text-[11px] tabular-nums text-groove-bg/80">{pctRounded}%</span>
      </motion.div>
    </motion.div>
  );
}
