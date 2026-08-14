import { DressCodeItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80";

// Full-height section dengan foto framed-card di tengah (bukan full-bleed) —
// margin di sekeliling card, sudut rounded, foto + overlay gelap tipis, lalu
// heading + catatan + swatch warna (bulat, bukan kotak) ditumpuk di tengah card.
export default function DressCode({ items, image, lang }: { items: DressCodeItem[]; image?: string; lang?: Lang }) {
  if (!items?.length) return null;
  const t = getDict(lang);

  return (
    <section className="relative h-[100lvh] flex items-center justify-center px-6 py-10">
      <div className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image || DEFAULT_PHOTO} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-black/45" />

        <div className="relative h-full flex flex-col items-center justify-center text-center px-8 text-groove-bg">
          <h3 className="font-reverie-display italic text-5xl mb-6" style={{ fontWeight: 400 }}>
            {t.dresscode}
          </h3>
          <p className="font-groove-label text-xs uppercase tracking-widest text-groove-bg/90 mb-8 max-w-[26ch]">
            {t.dresscodeNote}
          </p>
          <div className="flex items-center gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full border border-groove-bg/50"
                style={{ backgroundColor: item.hex }}
                aria-hidden="true"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
