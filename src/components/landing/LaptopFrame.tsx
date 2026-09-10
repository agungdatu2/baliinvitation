import Image from "next/image";

// Silhouette laptop minimalis (layar + dek keyboard tipis) membungkus
// screenshot statis versi desktop tiap tema. Pakai next/image supaya
// screenshot asli (1440px-wide, bisa 1MB+) di-resize & dikompres otomatis.
export default function LaptopFrame({ src, width, className = "" }: { src: string; width: number; className?: string }) {
  const screenHeight = width * (900 / 1440);

  return (
    <div className={className} style={{ width }}>
      <div
        className="relative rounded-t-lg border-[5px] border-groove-ink bg-groove-ink overflow-hidden shadow-xl"
        style={{ height: screenHeight }}
      >
        <Image src={src} alt="" fill sizes={`${width}px`} className="object-cover object-top" />
      </div>
      <div
        className="h-2.5 bg-groove-ink rounded-b-xl"
        style={{ width: width * 1.06, marginLeft: -(width * 0.03) }}
      />
    </div>
  );
}
