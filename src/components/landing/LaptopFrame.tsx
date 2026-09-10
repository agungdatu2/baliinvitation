import Image from "next/image";

// Frame foto asli (MacBook Air), bukan gambar kita — free untuk pemakaian
// komersial tanpa atribusi wajib (sumber: webmobilefirst.com/en/mockups/macbook-air,
// "Personal and commercial use allowed, without mandatory attribution").
// Layar-nya transparan by design (dibuat khusus untuk ditumpuki screenshot),
// koordinat di bawah didapat dari analisis alpha channel file aslinya (800x460),
// bukan angka kira-kira — kalau frame-nya diganti, koordinat ini perlu dihitung ulang.
const FRAME_SRC = "/landing/frames/macbook-air-frame.png";
const SCREEN = { left: 11.125, top: 5.87, width: 77.5, height: 83.9 };

export default function LaptopFrame({ src, width, className = "" }: { src: string; width: number; className?: string }) {
  const height = width * (460 / 800);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      <div
        className="absolute overflow-hidden"
        style={{
          left: `${SCREEN.left}%`,
          top: `${SCREEN.top}%`,
          width: `${SCREEN.width}%`,
          height: `${SCREEN.height}%`,
        }}
      >
        <Image src={src} alt="" fill sizes={`${width}px`} className="object-cover object-top" />
      </div>
      <Image src={FRAME_SRC} alt="" fill sizes={`${width}px`} className="pointer-events-none" />
    </div>
  );
}
