"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  label: string; // eyebrow kiri-atas, mis. "Undangan Pernikahan"
  loadingText: string; // teks "Loading" / "Memuat" di pojok kanan bawah
  groomNickname: string;
  brideNickname: string;
  images?: string[]; // foto galeri — kartu foto di belakang teks, crossfade tiap PHOTO_INTERVAL_MS
}

const DURATION_MS = 3600;
const COMPLETE_DELAY_MS = 500;
const PHOTO_INTERVAL_MS = 1300;
const PHOTO_COUNT = 4;

const DEFAULT_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `https://picsum.photos/seed/muse-loading-${i}/800/1000`
);

// Terinspirasi preloader fbridoux.com: kartu foto persegi di tengah yang
// crossfade, dengan nama pasangan raksasa warna solid menimpa di atasnya
// (bukan teks ter-mask foto) — reveal teksnya polos (fade+scale sekali saat
// mount), TANPA efek acak/glitch huruf. Persen loading tetap di pojok
// kanan-bawah.
export default function LoadingScreen({
  onComplete,
  label,
  loadingText,
  groomNickname,
  brideNickname,
  images,
}: LoadingScreenProps) {
  const photos = images?.length
    ? Array.from({ length: PHOTO_COUNT }, (_, i) => images[i % images.length])
    : DEFAULT_PHOTOS;
  const targetText = `${groomNickname} & ${brideNickname}`.toUpperCase();

  const [progress, setProgress] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [photos.length]);

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
      className="fixed inset-0 z-[9999] bg-groove-ink overflow-hidden"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm uppercase tracking-[0.3em] text-groove-bg/60"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {label}
      </motion.div>

      <div className="relative flex h-full w-full items-center justify-center px-4">
        {/* Kartu foto — ukuran tetap (bukan selebar teks), di belakang teks */}
        <div className="relative w-[220px] sm:w-[280px] md:w-[340px] aspect-[3/4] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.img
              key={photoIndex}
              src={photos[photoIndex]}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            />
          </AnimatePresence>
        </div>

        {/* Teks nama — warna solid, menimpa kartu foto, reveal polos sekali saat mount */}
        <motion.h1
          className="absolute select-none whitespace-pre text-center font-groove-label font-semibold uppercase leading-[0.95] tracking-tight text-groove-bg text-[13vw] md:text-[9vw] lg:text-[7vw]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
          {targetText}
        </motion.h1>
      </div>

      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex items-baseline gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 }}
      >
        <span className="font-groove-label text-xs uppercase tracking-[0.25em] text-groove-bg/50">{loadingText}</span>
        <span className="font-groove-label text-2xl md:text-3xl font-semibold tabular-nums text-groove-bg">
          {pctRounded}%
        </span>
      </motion.div>
    </motion.div>
  );
}
