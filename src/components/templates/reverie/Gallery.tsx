"use client";

import { useState } from "react";
import Image from "next/image";
import { getDict, Lang } from "@/lib/i18n/lume";
import PlaceholderPhoto from "./PlaceholderPhoto";

const PLACEHOLDER_COUNT = 6;
// Variasi tinggi supaya placeholder terlihat seperti masonry sungguhan sebelum ada foto asli.
const PLACEHOLDER_HEIGHTS = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-72"];

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;
function isVideoUrl(url: string) {
  return VIDEO_EXT_RE.test(url);
}

export default function Gallery({ images, lang }: { images: string[]; lang?: Lang }) {
  const t = getDict(lang);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  const usingPlaceholders = !images?.length;

  // Video (kalau ada) selalu jadi featured item pertama dengan thumbnail besar +
  // tombol play; kalau tidak ada video, foto pertama yang jadi featured item.
  const videoIndex = usingPlaceholders ? -1 : images.findIndex(isVideoUrl);
  const featuredSrc = usingPlaceholders ? null : videoIndex >= 0 ? images[videoIndex] : images[0];
  const featuredIsVideo = videoIndex >= 0;
  const restImages = usingPlaceholders
    ? Array.from({ length: PLACEHOLDER_COUNT }, () => null)
    : images.filter((_, i) => i !== (videoIndex >= 0 ? videoIndex : 0));

  return (
    <section className="groove-overlay text-groove-bg py-10 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-groove-display uppercase text-3xl md:text-4xl leading-tight mb-6" style={{ fontWeight: 500 }}>
          {t.galleryHeading}
        </h2>

        {/* Featured item — video (kalau ada) atau foto pertama */}
        {featuredSrc && (
          <div className="relative w-full aspect-video mb-3 overflow-hidden bg-groove-stone">
            {featuredIsVideo ? (
              videoPlaying ? (
                <video src={featuredSrc} controls autoPlay className="w-full h-full object-cover" />
              ) : (
                <button
                  onClick={() => setVideoPlaying(true)}
                  className="absolute inset-0 w-full h-full flex items-center justify-center bg-groove-stone/30"
                  aria-label={t.playVideo}
                >
                  <span className="w-16 h-16 rounded-full border-2 border-groove-bg/90 flex items-center justify-center">
                    <span
                      className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-groove-bg ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              )
            ) : (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={featuredSrc} alt="featured" className="w-full h-full object-cover" />
            )}
          </div>
        )}

        {/* Masonry (CSS columns, break-inside-avoid) untuk sisa foto */}
        <div className="columns-2 md:columns-3 gap-2">
          {restImages.map((src, i) =>
            src ? (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className="block w-full mb-2 break-inside-avoid"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`gallery-${i}`} className="w-full h-auto object-cover" />
              </button>
            ) : (
              <PlaceholderPhoto
                key={i}
                label={`${t.photo} ${i + 1}`}
                className={`w-full mb-2 break-inside-avoid ${PLACEHOLDER_HEIGHTS[i % PLACEHOLDER_HEIGHTS.length]}`}
              />
            )
          )}
        </div>
      </div>
      {lightboxIndex !== null && (
        <Lightbox
          images={usingPlaceholders ? [] : (restImages as string[])}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onIndexChange={setLightboxIndex}
          lang={lang}
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
  lang,
}: {
  images: string[];
  index: number;
  onClose: () => void;
  onIndexChange: (i: number) => void;
  lang?: Lang;
}) {
  const t = getDict(lang);
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
        aria-label={t.previous}
      >
        &#8249;
      </button>
      <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
        {images[index] ? (
          <Image src={images[index]} alt={`gallery-${index}`} fill className="object-contain" />
        ) : (
          <PlaceholderPhoto label={`${t.photo} ${index + 1}`} className="w-full h-full rounded-sm" />
        )}
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          goTo(1);
        }}
        className="absolute right-2 md:right-6 text-groove-bg/70 text-3xl px-2"
        aria-label={t.next}
      >
        &#8250;
      </button>
      <p className="absolute bottom-4 text-groove-bg/50 text-xs">
        {index + 1} / {total}
      </p>
    </div>
  );
}
