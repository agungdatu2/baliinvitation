"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface LoadingScreenProps {
  onComplete: () => void;
  label: string;
}

const DURATION_MS = 1800;
const COMPLETE_DELAY_MS = 300;
const BAR_STEPS = 10;

// Boot screen ala konsol 8-bit — "LOADING..." + progress bar chunky yang naik
// per-step (bukan smooth), lalu auto-lanjut ke title screen.
export default function LoadingScreen({ onComplete, label }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

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

  const filledSteps = Math.floor((progress / 100) * BAR_STEPS);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-pixel-bg flex flex-col items-center justify-center gap-8 px-6"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <p className="font-pixel-display text-[10px] md:text-xs text-pixel-ink/70 uppercase tracking-widest text-center">
        {label}
      </p>

      <motion.p
        className="font-pixel-display text-lg md:text-2xl text-pixel-yellow"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
      >
        LOADING...
      </motion.p>

      <div className="flex gap-1.5">
        {Array.from({ length: BAR_STEPS }, (_, i) => (
          <div
            key={i}
            className={`w-4 h-6 md:w-5 md:h-8 pixel-border ${i < filledSteps ? "bg-pixel-green" : "bg-pixel-panel"}`}
          />
        ))}
      </div>

      <p className="font-pixel-body text-xl text-pixel-ink/60 tabular-nums">
        {Math.round(progress).toString().padStart(3, "0")}%
      </p>
    </motion.div>
  );
}
