"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { DEFAULT_HERO_VIDEO_URL } from "./PlaceholderPhoto";
import { getYouTubeVideoId } from "@/lib/utils/youtube";

const DEFAULT_BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85";
const SLIDESHOW_INTERVAL_MS = 5000;

interface Props {
  type?: "video" | "image" | "slideshow";
  videoSrc?: string;
  imageSrc?: string;
  slideshowImages?: string[];
}

// Satu background, fixed di belakang seluruh halaman (gate + semua section) —
// admin pilih tipenya per undangan: video (default, backward-compatible dengan
// heroVideoUrl lama), foto tunggal, atau slideshow foto yang crossfade bergantian.
export default function FixedBackground({ type = "video", videoSrc, imageSrc, slideshowImages }: Props) {
  if (type === "image") {
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc || DEFAULT_BACKGROUND_IMAGE} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-groove-stone/45" />
      </div>
    );
  }

  if (type === "slideshow") {
    const images = slideshowImages?.length ? slideshowImages : [DEFAULT_BACKGROUND_IMAGE];
    return <SlideshowBackground images={images} />;
  }

  const youtubeId = videoSrc ? getYouTubeVideoId(videoSrc) : null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Video sendiri tetap tajam (gate & hero lihat video apa adanya). Blur untuk
          section sesudah hero dipasang lewat satu wrapper backdrop-filter di
          MuseTemplate (.groove-page-blur), bukan di sini. */}
      {youtubeId ? (
        // Iframe di-scale lebih besar dari viewport (via aspect-ratio + min-w/min-h)
        // supaya selalu cover penuh tanpa letterbox, meniru object-cover video biasa.
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1&disablekb=1&rel=0&playlist=${youtubeId}`}
          title="Background video"
          allow="autoplay; encrypted-media"
          frameBorder={0}
        />
      ) : (
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={videoSrc || DEFAULT_HERO_VIDEO_URL}
          autoPlay
          muted
          loop
          playsInline
        />
      )}
      <div className="absolute inset-0 bg-groove-stone/45" />
    </div>
  );
}

function SlideshowBackground({ images }: { images: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setIndex((i) => (i + 1) % images.length), SLIDESHOW_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <AnimatePresence initial={false}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <motion.img
          key={index}
          src={images[index]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-groove-stone/45" />
    </div>
  );
}
