// Dipakai saat client belum upload foto asli — blok gradien dekoratif, bukan foto
// sungguhan, supaya layout tetap terlihat lengkap sebelum aset final tersedia.
export default function PlaceholderPhoto({ label, className = "" }: { label?: string; className?: string }) {
  return (
    <div className={`relative flex items-end justify-center overflow-hidden border border-groove-line ${className}`}>
      {label && <span className="pb-2 text-[0.6rem] uppercase tracking-widest text-groove-bg/70">{label}</span>}
    </div>
  );
}

// Klip stok gratis (Mixkit, no watermark), portrait 1080x1920 — bule kaca
// champagne bertoast, nuansa hangat golden & romantis — dipakai sebagai video
// hero default kalau admin belum isi `heroVideoUrl` dengan footage venue asli.
// Sengaja portrait (bukan landscape) karena di layout split kolom, video ini
// cuma kelihatan lewat kolom kanan 30% (lihat FixedBackground prop `column`)
// yang bentuknya sempit-memanjang — portrait crop lebih pas & center-nya benar.
export const DEFAULT_HERO_VIDEO_URL = "https://assets.mixkit.co/videos/22738/22738-720.mp4";
