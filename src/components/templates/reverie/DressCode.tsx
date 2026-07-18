import { DressCodeItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";

export default function DressCode({ items, lang }: { items: DressCodeItem[]; lang?: Lang }) {
  if (!items?.length) return null;
  const t = getDict(lang);
  return (
    <section className="groove-overlay-dark text-groove-bg py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <h3 className="font-reverie-display text-4xl md:text-5xl mb-3" style={{ fontWeight: 500 }}>
          {t.dresscode}
        </h3>
        <p className="font-groove-body text-sm md:text-base text-groove-bg/80 mb-8">{t.dresscodeNote}</p>
        <div className="grid grid-cols-3 gap-0">
          {items.map((item, i) => (
            <div key={i} className="aspect-[4/3]" style={{ backgroundColor: item.hex }} aria-hidden="true" />
          ))}
        </div>
      </div>
    </section>
  );
}
