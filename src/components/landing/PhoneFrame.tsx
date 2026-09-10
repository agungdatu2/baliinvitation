import Image from "next/image";

// Frame foto asli (iPhone 17 Pro), bukan gambar kita — free untuk pemakaian
// komersial tanpa atribusi wajib (sumber: webmobilefirst.com/en/mockups/apple-iphone-17-pro-2025,
// "Personal and commercial use allowed, without mandatory attribution").
// Layar-nya transparan by design (dibuat khusus untuk ditumpuki screenshot),
// koordinat di bawah didapat dari analisis alpha channel file aslinya (389x800),
// bukan angka kira-kira — kalau frame-nya diganti, koordinat ini perlu dihitung ulang.
const FRAME_SRC = "/landing/frames/iphone-17-pro-frame.png";
const SCREEN = { left: 4.37, top: 1.625, width: 91, height: 96.625 };

export default function PhoneFrame({ src, width, className = "" }: { src: string; width: number; className?: string }) {
  const height = width * (800 / 389);

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
        <Image src={src} alt="" fill sizes={`${width}px`} className="object-cover" />
      </div>
      {/* Unit foto aslinya warna copper/orange — di-grayscale supaya netral
          (hitam/silver) biar konsisten sama tema brand, tapi screenshot di
          dalamnya (di atas) TIDAK ikut kena filter ini. */}
      <Image
        src={FRAME_SRC}
        alt=""
        fill
        sizes={`${width}px`}
        className="pointer-events-none grayscale"
      />
    </div>
  );
}
