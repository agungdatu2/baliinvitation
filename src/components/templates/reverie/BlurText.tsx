"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number; // ms stagger per word
}

// Judul yang muncul kata-per-kata dengan blur+geser dari bawah — re-arm setiap kali
// masuk/keluar viewport (IntersectionObserver, tanpa disconnect), jadi animasinya
// terpicu ulang tiap kali discroll, bukan cuma sekali di kunjungan pertama.
export default function BlurText({ text, className = "", delay = 100 }: BlurTextProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.3,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <h1 ref={ref} className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block"
          style={{ marginRight: "0.28em" }}
          animate={visible ? { filter: "blur(0px)", opacity: 1, y: 0 } : { filter: "blur(10px)", opacity: 0, y: 50 }}
          transition={{ duration: 0.35, delay: (i * delay) / 1000, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
