"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/confetti";
import { Wave } from "./Decor";

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;
const TILTS = ["-rotate-3", "rotate-2", "rotate-3", "-rotate-2"];
const TAPE = ["bg-confetti-pink", "bg-confetti-blue", "bg-confetti-yellow", "bg-confetti-lavender"];

// Galeri ala polaroid miring dengan lakban berwarna; ketuk foto -> tampilan penuh
// dengan next/prev (portal ke body supaya tidak kena stacking/blur section lain).
export default function Gallery({ data, images: imagesProp }: { data: InvitationData; images?: string[] }) {
  const t = getDict(data.language);
  const images = useMemo(
    () => (imagesProp ?? data.galleryImages ?? []).filter((src) => src && !VIDEO_EXT_RE.test(src)),
    [imagesProp, data.galleryImages]
  );
  const [index, setIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setIndex(null), []);
  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [index, close, go]);

  if (!images.length) return null;
  let touchX = 0;

  return (
    <div className="bg-[#eaf5fd]">
      <Wave fill="#fff8ee" flip />
      <section id="gallery" className="bg-confetti-cream px-5 py-16 text-center text-confetti-ink md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.3 }}
          transition={{ duration: 0.9 }}
        >
          <h2 className="font-confetti-display text-4xl font-bold md:text-5xl">{t.galleryHeading}</h2>
          <p className="mt-2 font-groove-label text-xs uppercase tracking-[0.25em] text-confetti-ink/50">{t.clickForPreview}</p>
        </motion.div>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 md:gap-x-8 md:gap-y-12">
          {images.map((src, i) => (
            <motion.button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`${t.photo} ${i + 1}`}
              initial={{ opacity: 0, y: 30, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.7, delay: (i % 3) * 0.1 }}
              className={`group relative bg-white p-2 pb-6 shadow-lg transition-transform duration-300 hover:rotate-0 hover:scale-105 md:p-3 md:pb-10 ${TILTS[i % TILTS.length]}`}
            >
              <span className={`absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 rotate-2 opacity-80 ${TAPE[i % TAPE.length]}`} />
              <span className="block aspect-[4/5] overflow-hidden bg-confetti-pink/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {mounted &&
        index !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-confetti-ink/90"
            onClick={close}
            onTouchStart={(e) => {
              touchX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const delta = e.changedTouches[0].clientX - touchX;
              if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[index]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[86vh] max-w-[92vw] rounded-2xl border-4 border-white object-contain shadow-2xl"
            />
            <button
              type="button"
              aria-label="Close"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              className="absolute right-5 top-5 rounded-full bg-white/90 p-2 text-confetti-ink"
            >
              <X size={22} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  aria-label={t.previous}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-confetti-ink md:left-8"
                >
                  <ChevronLeft size={26} />
                </button>
                <button
                  type="button"
                  aria-label={t.next}
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-3 text-confetti-ink md:right-8"
                >
                  <ChevronRight size={26} />
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-groove-label text-xs tracking-[0.3em] text-white/80">
                  {index + 1} / {images.length}
                </span>
              </>
            )}
          </div>,
          document.body
        )}
    </div>
  );
}
