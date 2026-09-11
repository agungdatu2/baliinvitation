"use client";

import { useEffect, useState } from "react";
import { getYouTubeVideoId } from "@/lib/utils/youtube";

const SLIDESHOW_INTERVAL_MS = 5000;

interface Props {
  type?: "video" | "image" | "slideshow" | "color";
  videoSrc?: string;
  imageSrc?: string;
  slideshowImages?: string[];
  color?: string;
}

// Beda dari FixedBackground Reverie/Muse: kalau admin tidak isi
// video/foto/slideshow sama sekali (wajar untuk klien non-wedding yang belum
// punya aset visual), fallback-nya BUKAN video/foto stock pernikahan — tapi
// gradient gelap elegan polos, supaya tetap terlihat premium tanpa aset apa pun.
// "color" beda dari fallback itu — itu warna solid yang SENGAJA dipilih admin,
// bukan cuma jaring pengaman kalau lupa isi.
export default function FixedBackground({ type = "video", videoSrc, imageSrc, slideshowImages, color }: Props) {
  const fallback = <div className="fixed inset-0 -z-10 groove-opening-gradient" />;

  if (type === "color") {
    if (!color) return fallback;
    return <div className="fixed inset-0 -z-10" style={{ backgroundColor: color }} />;
  }

  if (type === "image") {
    if (!imageSrc) return fallback;
    return (
      <div className="fixed inset-0 -z-10 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageSrc} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/55" />
      </div>
    );
  }

  if (type === "slideshow") {
    if (!slideshowImages?.length) return fallback;
    return <SlideshowBackground images={slideshowImages} />;
  }

  if (!videoSrc) return fallback;
  const youtubeId = getYouTubeVideoId(videoSrc);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {youtubeId ? (
        <iframe
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[177.77vh] h-[56.25vw] min-w-full min-h-full pointer-events-none"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&controls=0&showinfo=0&modestbranding=1&playsinline=1&disablekb=1&rel=0&playlist=${youtubeId}`}
          title="Background video"
          allow="autoplay; encrypted-media"
          frameBorder={0}
        />
      ) : (
        <video className="absolute inset-0 w-full h-full object-cover" src={videoSrc} autoPlay muted loop playsInline />
      )}
      <div className="absolute inset-0 bg-black/55" />
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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[index]} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" />
      <div className="absolute inset-0 bg-black/55" />
    </div>
  );
}
