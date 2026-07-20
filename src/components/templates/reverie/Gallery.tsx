"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/lume";
import PlaceholderPhoto from "./PlaceholderPhoto";

const PLACEHOLDER_COUNT = 8;

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;
function isVideoUrl(url: string) {
  return VIDEO_EXT_RE.test(url);
}

// Full-height section, satu framed card (sama pola dengan DressCode) berisi
// slideshow: video pre-wedding (kalau ada) selalu jadi slide pertama, disusul
// foto-foto lain. Kalau tidak ada video, langsung mulai dari foto pertama.
export default function Gallery({ images, lang }: { images: string[]; lang?: Lang }) {
  const t = getDict(lang);
  const [index, setIndex] = useState(0);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const usingPlaceholders = !images?.length;
  const videoSrc = usingPlaceholders ? null : images.find(isVideoUrl) ?? null;
  const photoSrcs = usingPlaceholders ? [] : images.filter((src) => !isVideoUrl(src));
  const slides: (string | null)[] = usingPlaceholders
    ? Array.from({ length: PLACEHOLDER_COUNT }, () => null)
    : videoSrc
      ? [videoSrc, ...photoSrcs]
      : photoSrcs;

  const total = slides.length;
  const current = slides[index];
  const isVideoSlide = Boolean(videoSrc) && current === videoSrc;

  const goTo = (delta: number) => {
    setIndex((i) => (i + delta + total) % total);
    setVideoPlaying(false);
  };

  return (
    <section className="relative h-[100svh] flex items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-groove-stone">
        {current ? (
          isVideoSlide ? (
            <>
              <video
                src={current}
                controls={videoPlaying}
                autoPlay={videoPlaying}
                muted={!videoPlaying}
                loop={!videoPlaying}
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              {!videoPlaying && (
                <button
                  onClick={() => setVideoPlaying(true)}
                  className="absolute inset-0 flex items-center justify-center bg-black/20"
                  aria-label={t.playVideo}
                >
                  <span className="w-16 h-16 rounded-full border-2 border-groove-bg/90 flex items-center justify-center">
                    <span
                      className="w-0 h-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-groove-bg ml-1"
                      aria-hidden="true"
                    />
                  </span>
                </button>
              )}
            </>
          ) : (
            <button onClick={() => setPreviewOpen(true)} className="absolute inset-0" aria-label={t.clickForPreview}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current} alt={`gallery-${index}`} className="h-full w-full object-cover" />
            </button>
          )
        ) : (
          <PlaceholderPhoto label={`${t.photo} ${index + 1}`} className="absolute inset-0 h-full w-full" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/25 pointer-events-none" />

        <div className="absolute top-6 inset-x-0 flex flex-col items-center gap-1 text-groove-bg pointer-events-none">
          <p className="font-groove-body text-sm">
            {index + 1} / {total}
          </p>
          {!isVideoSlide && current && <p className="font-groove-body text-xs text-groove-bg/80">{t.clickForPreview}</p>}
        </div>

        {total > 1 && (
          <>
            <button
              onClick={() => goTo(-1)}
              aria-label={t.previous}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-groove-bg/80 hover:text-groove-bg transition-colors"
            >
              <ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => goTo(1)}
              aria-label={t.next}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-groove-bg/80 hover:text-groove-bg transition-colors"
            >
              <ChevronRight className="h-7 w-7" strokeWidth={1.5} />
            </button>
          </>
        )}

        <p className="absolute bottom-8 left-8 right-8 font-reverie-display italic text-3xl text-groove-bg" style={{ fontWeight: 400 }}>
          {t.galleryHeading}
        </p>
      </div>

      {/* Portal ke document.body — Reveal (parent) pakai `transform` buat animasi
          fade-in, dan itu bikin `position: fixed` di dalamnya jadi ke-contain di
          box Reveal alih-alih viewport sungguhan (sama masalah & fix seperti
          WeddingGift's BankAccountsModal). */}
      {typeof document !== "undefined" &&
        createPortal(
          previewOpen && current && !isVideoSlide ? (
            <div
              className="fixed inset-0 z-50 bg-groove-stone/95 flex items-center justify-center animate-fadeIn"
              onClick={() => setPreviewOpen(false)}
            >
              <button onClick={() => setPreviewOpen(false)} className="absolute top-4 right-4 text-groove-bg/80" aria-label={t.close}>
                <X className="h-6 w-6" />
              </button>
              <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
                <Image src={current} alt={`gallery-${index}`} fill className="object-contain" />
              </div>
            </div>
          ) : null,
          document.body
        )}
    </section>
  );
}
