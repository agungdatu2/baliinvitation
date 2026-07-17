"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  label: string; // eyebrow kiri-atas, mis. "Undangan Pernikahan"
  loadingText: string; // teks "Loading" / "Memuat" di indikator bawah
  images?: string[]; // foto galeri — crossfade di atas indikator progress
}

const DURATION_MS = 2700;
const COMPLETE_DELAY_MS = 400;
const PHOTO_INTERVAL_MS = 700;
const PHOTO_COUNT = 5;

// Foto placeholder (Lorem Picsum, seed tetap) — dipakai selama client belum upload galeri asli.
const DEFAULT_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `https://picsum.photos/seed/reverie-loading-${i}/240/300`
);

// Gaya minimal terinspirasi cc-balky.webflow.io: kanvas krem polos + indikator
// "Loading  NN%" kecil di bawah-tengah dengan garis progress tipis, ditambah
// satu foto kecil yang crossfade di atasnya — bukan lagi cincin foto + counter
// besar ala LumeTemplate.
export default function LoadingScreen({ onComplete, label, loadingText, images }: LoadingScreenProps) {
  const photos = images?.length
    ? Array.from({ length: PHOTO_COUNT }, (_, i) => images[i % images.length])
    : DEFAULT_PHOTOS;
  const [progress, setProgress] = useState(0);
  const [photoIndex, setPhotoIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Foto berganti tiap 700ms, looping selama loading berjalan.
  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [photos.length]);

  // Counter 0 -> 100 selama 2.7s via requestAnimationFrame, lalu onComplete setelah jeda 400ms.
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
      className="fixed inset-0 z-[9999] bg-groove-bg"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm uppercase tracking-[0.3em] text-groove-secondary"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {label}
      </motion.div>

      {/* Wrapper positioning (translate-x untuk center) dipisah dari motion.div animasi:
          framer-motion menulis `transform` langsung sebagai inline style, yang akan
          menimpa (bukan digabung dengan) class Tailwind `-translate-x-1/2` kalau
          dipasang di elemen yang sama. */}
      <div className="absolute bottom-10 md:bottom-12 left-1/2 -translate-x-1/2 w-[240px] sm:w-[280px] md:w-[320px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <div className="relative mb-4 h-40 md:h-48 w-full overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.img
                key={photoIndex}
                src={photos[photoIndex]}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              />
            </AnimatePresence>
          </div>

          <div className="flex items-baseline justify-between font-loading-display not-italic text-sm md:text-base text-groove-ink">
            <span>{loadingText}</span>
            <span className="tabular-nums">{pctRounded}%</span>
          </div>
          <div className="mt-2 h-[1.5px] w-full bg-groove-ink/10">
            <div className="h-full bg-groove-ink" style={{ width: `${pctRounded}%` }} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
