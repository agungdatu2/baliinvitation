import { DEFAULT_HERO_VIDEO_URL } from "./PlaceholderPhoto";
import { getYouTubeVideoId } from "@/lib/utils/youtube";

// Satu video, fixed di belakang seluruh halaman (gate + semua section) — bukan
// per-section seperti sebelumnya, supaya video terasa jadi "latar" undangan,
// bukan cuma dekorasi hero.
export default function FixedVideoBackground({ src }: { src?: string }) {
  const youtubeId = src ? getYouTubeVideoId(src) : null;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
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
          src={src || DEFAULT_HERO_VIDEO_URL}
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
