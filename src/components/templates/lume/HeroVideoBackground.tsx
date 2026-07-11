import { DEFAULT_HERO_VIDEO_URL } from "./PlaceholderPhoto";

export default function HeroVideoBackground({ src }: { src?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src={src || DEFAULT_HERO_VIDEO_URL}
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-b from-groove-stone/30 via-groove-stone/50 to-groove-stone/90" />
    </div>
  );
}
