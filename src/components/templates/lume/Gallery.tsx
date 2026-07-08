import Image from "next/image";

export default function Gallery({ images, variant = "grid" }: { images: string[]; variant?: "grid" | "strip" }) {
  if (!images?.length) return null;

  if (variant === "strip") {
    return (
      <div className="flex gap-3 overflow-x-auto px-6 py-6 no-scrollbar">
        {images.map((src, i) => (
          <div key={i} className="relative w-40 h-56 shrink-0 rounded-lg overflow-hidden">
            <Image src={src} alt={`gallery-${i}`} fill className="object-cover" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="grid grid-cols-2 md:grid-cols-3 gap-2 px-4 py-8 max-w-3xl mx-auto">
      {images.map((src, i) => (
        <div key={i} className="relative aspect-[3/4] rounded-md overflow-hidden">
          <Image src={src} alt={`gallery-${i}`} fill className="object-cover" />
        </div>
      ))}
    </section>
  );
}
