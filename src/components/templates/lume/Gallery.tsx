"use client";

import { useState } from "react";
import Image from "next/image";
import PlaceholderPhoto from "./PlaceholderPhoto";

const PLACEHOLDER_COUNT = 6;
// Variasi tinggi supaya placeholder terlihat seperti masonry sungguhan sebelum ada foto asli.
const PLACEHOLDER_HEIGHTS = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-72"];

export default function Gallery({ images, variant = "grid" }: { images: string[]; variant?: "grid" | "strip" }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Belum ada foto asli — tampilkan placeholder supaya layout tetap terasa lengkap.
  const usingPlaceholders = !images?.length;
  const items = usingPlaceholders ? Array.from({ length: PLACEHOLDER_COUNT }, () => null) : images;

  if (variant === "strip") {
    return (
      <div className="flex gap-3 overflow-x-auto px-6 py-6 no-scrollbar">
        {items.map((src, i) =>
          src ? (
            <button key={i} onClick={() => setLightboxIndex(i)} className="relative w-40 h-56 shrink-0 rounded-sm overflow-hidden">
              <Image src={src} alt={`gallery-${i}`} fill className="object-cover" />
            </button>
          ) : (
            <PlaceholderPhoto key={i} label={`Photo ${i + 1}`} className="w-40 h-56 shrink-0 rounded-sm" />
          )
        )}
        {lightboxIndex !== null && (
          <Lightbox
            images={usingPlaceholders ? [] : images}
            index={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onIndexChange={setLightboxIndex}
          />
        )}
      </div>
    );
  }

  // Masonry (CSS columns, break-inside-avoid) — tinggi tiap foto natural, bukan seragam.
  return (
    <section className="px-6 py-10 max-w-3xl mx-auto">
      <div className="groove-glass rounded-2xl p-4 md:p-6">
        <div className="columns-2 md:columns-3 gap-2">
          {items.map((src, i) =>
            src ? (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="block w-full mb-2 border-4 border-groove-bg shadow-sm break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`gallery-${i}`} className="w-full h-auto object-cover" />
              </button>
            ) : (
              <PlaceholderPhoto
                key={i}
                label={`Photo ${i + 1}`}
                className={`w-full mb-2 border-4 border-groove-bg shadow-sm break-inside-avoid ${PLACEHOLDER_HEIGHTS[i % PLACEHOLDER_HEIGHTS.length]}`}
              />
            )
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={usingPlaceholders ? [] : images}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
        />
      )}
    </section>
  );
}

function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
}) {
  const total = images.length || PLACEHOLDER_COUNT;
  const goTo = (delta: number) => onIndexChange((index + delta + total) % total);

  let touchStartX = 0;
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 50) goTo(delta < 0 ? 1 : -1);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-groove-stone/95 flex items-center justify-center animate-fadeIn"
      onClick={onClose}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <button onClick={onClose} className="absolute top-4 right-4 text-groove-bg/80 text-2xl leading-none">
        &times;
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goTo(-1);
        }}
        className="absolute left-2 md:left-6 text-groove-bg/70 text-3xl px-2"
        aria-label="Sebelumnya"
      >
        &#8249;
      </button>
      <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
        {images[index] ? (
          <Image src={images[index]} alt={`gallery-${index}`} fill className="object-contain" />
        ) : (
          <PlaceholderPhoto label={`Photo ${index + 1}`} className="w-full h-full rounded-sm" />
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goTo(1);
        }}
        className="absolute right-2 md:right-6 text-groove-bg/70 text-3xl px-2"
        aria-label="Selanjutnya"
      >
        &#8250;
      </button>
      <p className="absolute bottom-4 text-groove-bg/50 text-xs">
        {index + 1} / {total}
      </p>
    </div>
  );
}
