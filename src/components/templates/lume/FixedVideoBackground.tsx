import { DEFAULT_HERO_VIDEO_URL } from "./PlaceholderPhoto";

// Satu video, fixed di belakang seluruh halaman (gate + semua section) — bukan
// per-section seperti sebelumnya, supaya video terasa jadi "latar" undangan,
// bukan cuma dekorasi hero.
export default function FixedVideoBackground({ src }: { src?: string }) {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={src || DEFAULT_HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-groove-stone/45" />
    </div>
  );
}
