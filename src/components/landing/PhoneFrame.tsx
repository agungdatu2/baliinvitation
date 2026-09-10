import Image from "next/image";

// Frame HP membungkus screenshot statis (bukan iframe live) — dipakai di
// grid "Pilihan Tema" supaya thumbnail-nya tidak ikut nge-load 3 halaman
// penuh sekaligus tiap landing page dibuka. Pakai next/image (bukan <img>)
// supaya PNG screenshot asli (ratusan KB-1MB+) di-resize & dikompres
// otomatis oleh Next ke ukuran render yang jauh lebih kecil.
export default function PhoneFrame({ src, width, className = "" }: { src: string; width: number; className?: string }) {
  const height = width * (844 / 390);

  return (
    <div
      className={`relative rounded-[1.5rem] border-[5px] border-groove-ink bg-groove-ink shadow-xl overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div className="absolute top-0 inset-x-0 h-4 flex items-center justify-center z-10">
        <div className="w-10 h-2.5 bg-groove-ink rounded-full" />
      </div>
      <Image src={src} alt="" fill sizes={`${width}px`} className="object-cover" />
    </div>
  );
}
