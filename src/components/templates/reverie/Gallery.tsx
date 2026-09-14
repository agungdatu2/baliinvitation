"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/lume";
import PlaceholderPhoto from "./PlaceholderPhoto";

export type GalleryStyle = "default" | "masonry" | "grid";

const PLACEHOLDER_COUNT = 8;
// Variasi tinggi supaya placeholder masonry terlihat sungguhan sebelum ada foto asli.
const MASONRY_PLACEHOLDER_HEIGHTS = ["h-56", "h-72", "h-64", "h-80", "h-60", "h-72", "h-52", "h-68"];

const VIDEO_EXT_RE = /\.(mp4|webm|mov|m3u8)(\?.*)?$/i;
function isVideoUrl(url: string) {
  return VIDEO_EXT_RE.test(url);
}

// Dispatcher gaya galeri — admin pilih di Form (lihat `galleryStyle` di
// InvitationData). "default" = slideshow satu-per-satu (style asli tema ini,
// TIDAK berubah supaya undangan lama yang belum isi field ini tetap sama
// persis), "masonry" & "grid" adalah varian tambahan yang tampilkan semua
// foto sekaligus.
export default function Gallery({ images, lang, style = "default" }: { images: string[]; lang?: Lang; style?: GalleryStyle }) {
  if (style === "masonry") return <TiledGallery images={images} lang={lang} variant="masonry" />;
  if (style === "grid") return <TiledGallery images={images} lang={lang} variant="grid" />;
  return <SlideshowGallery images={images} lang={lang} />;
}

// Full-height section, satu framed card (sama pola dengan DressCode) berisi
// slideshow: video pre-wedding (kalau ada) selalu jadi slide pertama, disusul
// foto-foto lain. Kalau tidak ada video, langsung mulai dari foto pertama.
function SlideshowGallery({ images, lang }: { images: string[]; lang?: Lang }) {
  const t = getDict(lang);
  const [index, setIndex] = useState(0);
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
    setPreviewOpen(false);
  };

  return (
    <section className="relative h-[100lvh] flex items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden bg-groove-stone">
        {current ? (
          isVideoSlide ? (
            <>
              <video
                src={current}
                muted
                loop
                autoPlay
                playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
              <button
                onClick={() => setPreviewOpen(true)}
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
          {current && <p className="font-groove-body text-xs text-groove-bg/80">{isVideoSlide ? t.playVideo : t.clickForPreview}</p>}
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

        <p className="absolute bottom-14 left-8 right-8 font-reverie-display italic text-3xl text-groove-bg" style={{ fontWeight: 400 }}>
          {t.galleryHeading}
        </p>
      </div>

      {/* Portal ke document.body — Reveal (parent) pakai `transform` buat animasi
          fade-in, dan itu bikin `position: fixed` di dalamnya jadi ke-contain di
          box Reveal alih-alih viewport sungguhan (sama masalah & fix seperti
          WeddingGift's BankAccountsModal). */}
      {typeof document !== "undefined" &&
        createPortal(
          previewOpen && current ? (
            <div
              className="fixed inset-0 z-50 bg-groove-stone/95 flex items-center justify-center animate-fadeIn"
              onClick={() => setPreviewOpen(false)}
            >
              <button onClick={() => setPreviewOpen(false)} className="absolute top-4 right-4 text-groove-bg/80" aria-label={t.close}>
                <X className="h-6 w-6" />
              </button>
              <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
                {isVideoSlide ? (
                  <video src={current} controls autoPlay playsInline className="h-full w-full object-contain" />
                ) : (
                  <Image src={current} alt={`gallery-${index}`} fill className="object-contain" />
                )}
              </div>
            </div>
          ) : null,
          document.body
        )}
    </section>
  );
}

// "masonry" (kolom CSS, tinggi natural per foto) & "grid" (kotak seragam
// aspect-square) — dua-duanya tampilkan SEMUA foto+video sekaligus (bukan
// satu-per-satu seperti slideshow), klik salah satu buka lightbox dengan
// navigasi prev/next. Section transparan (bukan foto opaque sendiri) supaya
// FixedBackground blur di baliknya tetap kelihatan, konsisten dengan section
// lain sesudah hero (lihat .groove-page-blur di Template).
function TiledGallery({ images, lang, variant }: { images: string[]; lang?: Lang; variant: "masonry" | "grid" }) {
  const t = getDict(lang);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const usingPlaceholders = !images?.length;
  const items: (string | null)[] = usingPlaceholders ? Array.from({ length: PLACEHOLDER_COUNT }, () => null) : images;
  const total = items.length;
  const current = lightboxIndex !== null ? items[lightboxIndex] : null;

  const goTo = (delta: number) => setLightboxIndex((i) => (i === null ? null : (i + delta + total) % total));

  return (
    <section className="relative min-h-[100lvh] flex flex-col justify-center text-groove-bg px-6 md:px-14 py-20">
      <div className="max-w-3xl mx-auto md:mx-0 w-full">
        <h2 className="font-reverie-display italic text-4xl md:text-5xl leading-tight mb-8" style={{ fontWeight: 400 }}>
          {t.galleryHeading}
        </h2>

        <div className={variant === "grid" ? "grid grid-cols-2 md:grid-cols-3 gap-2" : "columns-2 md:columns-3 gap-2"}>
          {items.map((src, i) =>
            src ? (
              <button
                key={i}
                onClick={() => setLightboxIndex(i)}
                className={
                  variant === "grid"
                    ? "relative block w-full aspect-square overflow-hidden rounded-sm"
                    : "relative block w-full mb-2 break-inside-avoid overflow-hidden rounded-sm"
                }
              >
                {isVideoUrl(src) ? (
                  <>
                    {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                    <video
                      src={src}
                      muted
                      className={variant === "grid" ? "absolute inset-0 h-full w-full object-cover" : "w-full h-auto object-cover"}
                    />
                    <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                      <span className="w-9 h-9 rounded-full border border-groove-bg/90 flex items-center justify-center">
                        <span
                          className="w-0 h-0 border-y-[6px] border-y-transparent border-l-[9px] border-l-groove-bg ml-0.5"
                          aria-hidden="true"
                        />
                      </span>
                    </span>
                  </>
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={src}
                    alt={`gallery-${i}`}
                    className={variant === "grid" ? "absolute inset-0 h-full w-full object-cover" : "w-full h-auto object-cover"}
                  />
                )}
              </button>
            ) : (
              <PlaceholderPhoto
                key={i}
                label={`${t.photo} ${i + 1}`}
                className={
                  variant === "grid"
                    ? "relative w-full aspect-square"
                    : `w-full mb-2 break-inside-avoid ${MASONRY_PLACEHOLDER_HEIGHTS[i % MASONRY_PLACEHOLDER_HEIGHTS.length]}`
                }
              />
            )
          )}
        </div>
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          current ? (
            <div
              className="fixed inset-0 z-50 bg-groove-stone/95 flex items-center justify-center animate-fadeIn"
              onClick={() => setLightboxIndex(null)}
            >
              <button onClick={() => setLightboxIndex(null)} className="absolute top-4 right-4 text-groove-bg/80" aria-label={t.close}>
                <X className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(-1);
                }}
                aria-label={t.previous}
                className="absolute left-2 md:left-6 text-groove-bg/70 hover:text-groove-bg transition-colors"
              >
                <ChevronLeft className="h-7 w-7" strokeWidth={1.5} />
              </button>
              <div className="relative w-full h-full max-w-2xl max-h-[80vh] mx-8" onClick={(e) => e.stopPropagation()}>
                {isVideoUrl(current) ? (
                  <video src={current} controls autoPlay playsInline className="h-full w-full object-contain" />
                ) : (
                  <Image src={current} alt={`gallery-${lightboxIndex}`} fill className="object-contain" />
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(1);
                }}
                aria-label={t.next}
                className="absolute right-2 md:right-6 text-groove-bg/70 hover:text-groove-bg transition-colors"
              >
                <ChevronRight className="h-7 w-7" strokeWidth={1.5} />
              </button>
              <p className="absolute bottom-4 text-groove-bg/50 text-xs">
                {(lightboxIndex as number) + 1} / {total}
              </p>
            </div>
          ) : null,
          document.body
        )}
    </section>
  );
}
