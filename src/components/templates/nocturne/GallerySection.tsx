"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;
// Minimal item per "salinan" baris. Baris dibuat dari 3 salinan identik supaya
// bisa digeser dan di-wrap mulus; tiap salinan HARUS lebih lebar dari layar.
const MIN_ITEMS_PER_COPY = 8;
const PARALLAX_FACTOR = 0.3;

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: false, amount: 0.3 },
  transition: { duration: 0.9, delay, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
});

// Ulang daftar foto sampai minimal MIN_ITEMS_PER_COPY, simpan index foto aslinya
// (untuk lightbox) di tiap item.
function buildCopy(images: string[], shift: number) {
  const count = Math.max(MIN_ITEMS_PER_COPY, images.length);
  return Array.from({ length: count }, (_, i) => {
    const index = (i + shift) % images.length;
    return { src: images[index], index };
  });
}

// Section "Gallery" — dua baris foto yang bergeser berlawanan arah mengikuti
// scroll (baris atas ke kanan, bawah ke kiri), terinspirasi pola "Scroll Marquee"
// (Motionsites), plus bisa digeser manual (drag/swipe/trackpad) per baris dengan
// momentum. Klik foto -> tampilan penuh dengan next/prev.
export default function GallerySection({ data, images: imagesProp }: { data: InvitationData; images?: string[] }) {
  const t = getDict(data.language);
  const images = useMemo(
    () => (imagesProp ?? data.galleryImages ?? []).filter((src) => src && !VIDEO_EXT_RE.test(src)),
    [imagesProp, data.galleryImages]
  );

  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const row1 = useMemo(() => buildCopy(images, 0), [images]);
  const row2 = useMemo(() => buildCopy(images, Math.floor(images.length / 2) + 1), [images]);

  useEffect(() => setMounted(true), []);

  // Posisi baris = parallax scroll (p) + geseran manual user per baris (u).
  // Semua ditulis langsung ke transform lewat ref (bukan state) supaya 60fps.
  const motionRef = useRef({ copy: 0, p: 0, u: [0, 0] as [number, number] });
  const dragRef = useRef({ active: false, row: 0 as 0 | 1, lastX: 0, lastT: 0, v: 0, moved: 0, raf: 0 });

  const apply = useCallback(() => {
    const m = motionRef.current;
    if (!m.copy) return;
    // Periode salinan = copy, jadi lompatan wrap sebesar tepat satu salinan tidak terlihat.
    const mod = (v: number) => ((v % m.copy) + m.copy) % m.copy;
    if (row1Ref.current) row1Ref.current.style.transform = `translate3d(${-m.copy + mod(m.p + m.u[0])}px,0,0)`;
    if (row2Ref.current) row2Ref.current.style.transform = `translate3d(${-mod(m.p - m.u[1])}px,0,0)`;
  }, []);

  useEffect(() => {
    if (!images.length) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const m = motionRef.current;

    const measure = () => {
      if (row1Ref.current) m.copy = row1Ref.current.scrollWidth / 3;
    };
    const onScroll = () => {
      const section = sectionRef.current;
      if (!section || !m.copy || reduceMotion) return;
      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const scrolled = window.scrollY - sectionTop + window.innerHeight;
      m.p = scrolled * PARALLAX_FACTOR;
      apply();
    };
    const onResize = () => {
      measure();
      onScroll();
      apply();
    };

    measure();
    onScroll();
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Foto baru selesai di-load bisa mengubah lebar baris — ukur ulang sesudah load.
    const timer = window.setTimeout(onResize, 1200);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.clearTimeout(timer);
    };
  }, [images, apply]);

  // Geser manual: pointer (mouse & sentuh) + momentum setelah dilepas. Listener
  // move/up dipasang di window (bukan pointer capture) supaya event click di kartu
  // tetap sampai ke tombolnya.
  const startDrag = (row: 0 | 1) => (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const d = dragRef.current;
    cancelAnimationFrame(d.raf);
    d.active = true;
    d.row = row;
    d.lastX = e.clientX;
    d.lastT = performance.now();
    d.v = 0;
    d.moved = 0;

    const onMove = (ev: PointerEvent) => {
      if (!d.active) return;
      const now = performance.now();
      const dx = ev.clientX - d.lastX;
      d.moved += Math.abs(dx);
      motionRef.current.u[d.row] += dx;
      d.v = 0.8 * d.v + 0.2 * (dx / Math.max(1, now - d.lastT)) * 16;
      d.lastX = ev.clientX;
      d.lastT = now;
      apply();
    };
    const onUp = () => {
      d.active = false;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      const glide = () => {
        if (Math.abs(d.v) < 0.05) return;
        motionRef.current.u[d.row] += d.v;
        d.v *= 0.94;
        apply();
        d.raf = requestAnimationFrame(glide);
      };
      d.raf = requestAnimationFrame(glide);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  };

  // Trackpad / mouse horizontal wheel.
  const onRowWheel = (row: 0 | 1) => (e: React.WheelEvent) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
    motionRef.current.u[row] -= e.deltaX;
    apply();
  };

  useEffect(() => () => cancelAnimationFrame(dragRef.current.raf), []);

  const close = useCallback(() => setLightboxIndex(null), []);
  const go = useCallback(
    (dir: 1 | -1) => setLightboxIndex((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length]
  );

  useEffect(() => {
    if (lightboxIndex === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxIndex, close, go]);

  if (!images.length) return null;

  let touchStartX = 0;

  const renderRow = (items: { src: string; index: number }[], ref: React.RefObject<HTMLDivElement>, row: 0 | 1) => (
    <div
      className="w-full cursor-grab touch-pan-y select-none overflow-hidden active:cursor-grabbing"
      onPointerDown={startDrag(row)}
      onWheel={onRowWheel(row)}
      onDragStart={(e) => e.preventDefault()}
    >
      <div ref={ref} className="flex w-max gap-3 will-change-transform">
        {[0, 1, 2].flatMap((copy) =>
          items.map((item, i) => (
            <button
              key={`${copy}-${i}`}
              type="button"
              onClick={() => {
                // Setelah menggeser, jangan buka lightbox.
                if (dragRef.current.moved > 6) return;
                setLightboxIndex(item.index);
              }}
              aria-label={`${t.photo} ${item.index + 1}`}
              className="group relative aspect-[14/9] w-[72vw] shrink-0 overflow-hidden rounded-2xl bg-white/5 sm:w-[420px] lg:w-[24vw]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.src}
                alt=""
                loading="lazy"
                draggable={false}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </button>
          ))
        )}
      </div>
    </div>
  );

  return (
    // relative + z-50 SENGAJA — lihat komentar sama di SaveTheDateSection.tsx.
    <section ref={sectionRef} id="gallery" className="relative z-50 overflow-hidden bg-black pb-16 pt-24 text-groove-bg md:pb-24 md:pt-40">
      <div className="mb-12 px-6 text-center md:mb-[5vw]">
        <motion.h2
          {...fadeIn(0)}
          className="font-nocturne-display text-4xl italic leading-tight md:text-[4.4vw] md:leading-[1.1]"
        >
          {t.galleryHeading}
        </motion.h2>
        <motion.p
          {...fadeIn(0.15)}
          className="mt-4 font-groove-label text-[0.7rem] uppercase tracking-[0.3em] text-groove-bg/50 md:text-[0.8vw]"
        >
          {t.clickForPreview}
        </motion.p>
      </div>

      <motion.div {...fadeIn(0.25)} className="flex flex-col gap-3">
        {renderRow(row1, row1Ref, 0)}
        {renderRow(row2, row2Ref, 1)}
      </motion.div>

      {mounted &&
        lightboxIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95"
            onClick={close}
            onTouchStart={(e) => {
              touchStartX = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const delta = e.changedTouches[0].clientX - touchStartX;
              if (Math.abs(delta) > 50) go(delta < 0 ? 1 : -1);
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={images[lightboxIndex]}
              alt=""
              onClick={(e) => e.stopPropagation()}
              className="max-h-[86vh] max-w-[92vw] object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                close();
              }}
              aria-label="Close"
              className="absolute right-5 top-5 rounded-full p-2 text-white/80 transition-colors hover:text-white"
            >
              <X size={26} />
            </button>
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(-1);
                  }}
                  aria-label={t.previous}
                  className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full p-3 text-white/80 transition-colors hover:text-white md:left-8"
                >
                  <ChevronLeft size={34} />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    go(1);
                  }}
                  aria-label={t.next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-3 text-white/80 transition-colors hover:text-white md:right-8"
                >
                  <ChevronRight size={34} />
                </button>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-groove-label text-xs tracking-[0.3em] text-white/60">
                  {lightboxIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>,
          document.body
        )}
    </section>
  );
}
