// Dipakai saat client belum upload foto asli — blok gradien dekoratif, bukan foto
// sungguhan, supaya layout tetap terlihat lengkap sebelum aset final tersedia.
export default function PlaceholderPhoto({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`relative flex items-end justify-center overflow-hidden border border-groove-line ${className}`}>
      {label && <span className="pb-2 text-[0.6rem] uppercase tracking-widest text-groove-bg/70">{label}</span>}
    </div>
  );
}

// Klip stok gratis (Mixkit, no watermark) — sinar matahari menembus dedaunan pohon,
// nuansa lebih related ke wedding — dipakai sebagai video hero default kalau admin
// belum isi `heroVideoUrl` dengan footage venue asli.
export const DEFAULT_HERO_VIDEO_URL = "https://assets.mixkit.co/videos/34371/34371-720.mp4";
