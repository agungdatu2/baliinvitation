"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number; // ms stagger per word
}

// Judul yang muncul kata-per-kata dengan blur+geser dari bawah — dipicu sekali
// saat scroll masuk viewport (IntersectionObserver), lalu tiap kata dianimasikan
// oleh motion/react dengan delay bertahap.
export default function BlurText({ text, className = "", delay = 100 }: BlurTextProps) {
  const words = text.split(" ");
  const ref = useRef<HTMLHeadingElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
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
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={visible ? { filter: "blur(0px)", opacity: 1, y: 0 } : undefined}
          transition={{ duration: 0.35, delay: (i * delay) / 1000, ease: "easeOut" }}
        >
          {word}
        </motion.span>
      ))}
    </h1>
  );
}
