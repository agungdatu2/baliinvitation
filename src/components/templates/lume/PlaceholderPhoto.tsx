// Dipakai saat client belum upload foto asli — blok gradien dekoratif, bukan foto
// sungguhan, supaya layout tetap terlihat lengkap sebelum aset final tersedia.
export default function PlaceholderPhoto({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div
      className={`relative flex items-end justify-center overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, #ded4bd 0, #ded4bd 2px, #e9e1cd 2px, #e9e1cd 22px)",
      }}
    >
      {label && <span className="pb-2 text-[0.6rem] uppercase tracking-widest text-groove-secondary">{label}</span>}
    </div>
  );
}

// Klip CC0 pendek dari MDN (dibuat khusus untuk contoh/prototipe) — dipakai sebagai
// video hero default kalau admin belum isi `heroVideoUrl` dengan footage venue asli.
export const DEFAULT_HERO_VIDEO_URL = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4";
