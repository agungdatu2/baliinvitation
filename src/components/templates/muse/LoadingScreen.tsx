"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  label: string; // eyebrow kiri-atas, mis. "Undangan Pernikahan"
  loadingText: string; // teks "Loading" / "Memuat" di pojok kanan bawah
  groomNickname: string;
  brideNickname: string;
  images?: string[]; // foto galeri — di-mask ke dalam teks nama, crossfade tiap PHOTO_INTERVAL_MS
}

const DURATION_MS = 3600;
const COMPLETE_DELAY_MS = 500;
const PHOTO_INTERVAL_MS = 1300;
const PHOTO_COUNT = 4;
const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const DEFAULT_PHOTOS = Array.from(
  { length: PHOTO_COUNT },
  (_, i) => `https://picsum.photos/seed/muse-loading-${i}/800/1000`
);

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
}

// Terinspirasi preloader fbridoux.com: nama pasangan raksasa dengan foto
// di-mask ke dalam huruf (bg-clip-text), huruf yang belum "terungkap" terus
// diacak sampai progress melewati posisinya (kiri ke kanan), persen di pojok
// kanan-bawah. Spasi & "&" sengaja tidak diacak supaya bentuk kata tetap
// terbaca sejak awal.
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
  // Math.random() dalam displayText di bawah harus tidak pernah dipakai di render
  // pertama (SSR & first client paint) — kalau dipakai, teks acaknya beda antara
  // HTML dari server dan hasil render client pertama, jadi hydration mismatch
  // (React buang seluruh SSR output & full client re-render). Baru "start" scramble
  // setelah mount (useEffect = client-only, dijamin sama dengan first paint).
  const [started, setStarted] = useState(false);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    setStarted(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhotoIndex((i) => (i + 1) % photos.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [photos.length]);

  // Counter 0 -> 100 via requestAnimationFrame — dipakai sekaligus untuk progress
  // bar (persen) dan untuk menentukan berapa huruf yang sudah "terkunci" (tidak
  // diacak lagi), jadi keduanya selalu sinkron.
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
  const revealCount = Math.floor((progress / 100) * targetText.length);
  const displayText = !started
    ? targetText
    : targetText
        .split("")
        .map((ch, i) => (ch === " " || ch === "&" || i < revealCount ? ch : randomChar()))
        .join("");

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
        <h1
          className="relative select-none whitespace-pre text-center font-groove-label font-semibold uppercase leading-[0.95] tracking-tight text-[12vw] md:text-[8vw] lg:text-[7vw]"
          aria-label={targetText}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={photoIndex}
              className="absolute inset-0 bg-clip-text text-transparent"
              style={{
                backgroundImage: `url(${photos[photoIndex]})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(1.7) contrast(1.1) saturate(1.15)",
                // Garis tepi tipis krem supaya bentuk huruf tetap kebaca walau
                // foto yang jadi isinya kebetulan gelap/low-contrast.
                WebkitTextStroke: "1.5px rgba(250,247,240,0.4)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            >
              {displayText}
            </motion.span>
          </AnimatePresence>
          {/* Placeholder tak terlihat supaya <h1> punya tinggi/lebar sesuai teks
              (span di atas absolute, tidak ikut menentukan ukuran parent). */}
          <span className="opacity-0">{targetText}</span>
        </h1>
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
