"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  label: string; // eyebrow kiri-atas, mis. "Undangan Pernikahan"
  words: string[]; // kata yang bergantian di tengah, mis. [groomNickname, "&", brideNickname]
  images?: string[]; // foto galeri — dipakai untuk cincin foto yang reveal mengelilingi nama
}

const DURATION_MS = 2700;
const WORD_INTERVAL_MS = 900;
const COMPLETE_DELAY_MS = 400;
const RING_COUNT = 6;

export default function LoadingScreen({ onComplete, label, words, images }: LoadingScreenProps) {
  const ringPhotos = Array.from({ length: RING_COUNT }, (_, i) => (images?.length ? images[i % images.length] : null));
  const [progress, setProgress] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Kata berganti tiap 900ms, berhenti di kata terakhir (tidak looping).
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((i) => {
        if (i >= words.length - 1) {
          clearInterval(interval);
          return i;
        }
        return i + 1;
      });
    }, WORD_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [words.length]);

  // Counter 000 -> 100 selama 2.7s via requestAnimationFrame, lalu onComplete setelah jeda 400ms.
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

  return (
    <motion.div
      className="fixed inset-0 z-[9999]"
      style={{ backgroundColor: "#0a0a0a" }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <motion.div
        className="absolute top-8 left-8 md:top-12 md:left-12 text-xs md:text-sm uppercase tracking-[0.3em]"
        style={{ color: "#888888" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {label}
      </motion.div>

      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ ["--ring-radius" as string]: "clamp(96px, 20vw, 190px)" }}
      >
        {ringPhotos.map((src, i) => {
          const angle = (360 / RING_COUNT) * i;
          return (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-11 h-11 md:w-16 md:h-16"
              style={{
                transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(calc(-1 * var(--ring-radius))) rotate(${-angle}deg)`,
              }}
            >
              <motion.div
                className="w-full h-full rounded-full overflow-hidden border"
                style={{ borderColor: "rgba(245,245,245,0.25)" }}
                initial={{ opacity: 0, scale: 0.3, filter: "blur(8px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.4 + i * 0.12, ease: [0.4, 0, 0.2, 1] }}
              >
                {src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={src} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{ backgroundColor: "rgba(245,245,245,0.06)" }} />
                )}
              </motion.div>
            </div>
          );
        })}

        <AnimatePresence mode="wait">
          <motion.span
            key={wordIndex}
            className="font-loading-display italic text-4xl md:text-6xl lg:text-7xl"
            style={{ color: "rgba(245,245,245,0.8)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
          >
            {words[wordIndex]}
          </motion.span>
        </AnimatePresence>
      </div>

      <motion.div
        className="absolute bottom-8 right-8 md:bottom-12 md:right-12 font-loading-display tabular-nums text-6xl md:text-8xl lg:text-9xl"
        style={{ color: "#f5f5f5" }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {Math.round(progress).toString().padStart(3, "0")}
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ backgroundColor: "rgba(31,31,31,0.5)" }}>
        <motion.div
          className="h-full origin-left"
          style={{
            background: "linear-gradient(90deg, #89AACC 0%, #4E85BF 100%)",
            boxShadow: "0 0 8px rgba(137, 170, 204, 0.35)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: progress / 100 }}
          transition={{ duration: 0.1, ease: "linear" }}
        />
      </div>
    </motion.div>
  );
}
