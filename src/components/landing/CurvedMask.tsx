// Masker putih melengkung di atas/bawah strip marquee, biar transisi dari
// section putih ke strip foto terasa seperti "tirai", bukan garis lurus tegas.
export default function CurvedMask({ position }: { position: "top" | "bottom" }) {
  const path =
    position === "top"
      ? "M0 0H1440V36C1440 36 1200 84 720 84C240 84 0 36 0 36V0Z"
      : "M0 84H1440V48C1440 48 1200 0 720 0C240 0 0 48 0 48V84Z";

  return (
    <svg
      viewBox="0 0 1440 84"
      preserveAspectRatio="none"
      className="absolute inset-x-0 w-full h-16 sm:h-20 pointer-events-none z-10"
      style={position === "top" ? { top: 0 } : { bottom: 0 }}
    >
      <path d={path} fill="#faf7ef" />
    </svg>
  );
}
