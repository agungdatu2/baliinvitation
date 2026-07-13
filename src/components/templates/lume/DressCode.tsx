import { DressCodeItem } from "@/types/invitation";

export default function DressCode({ items }: { items: DressCodeItem[] }) {
  if (!items?.length) return null;
  return (
    <section className="groove-overlay py-16 px-6 text-center">
      <div className="max-w-2xl mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary mb-3">Dress Code</p>
        <h3 className="font-groove-body italic text-base md:text-lg text-groove-ink mb-8">
          Kami mengharapkan tamu undangan mengenakan warna-warna berikut untuk hari spesial kami
        </h3>
        <div className="flex justify-center flex-wrap gap-6">
          {items.map((item, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className="w-14 h-14 rounded-lg border border-groove-line shadow-sm"
                style={{ backgroundColor: item.hex }}
                aria-hidden="true"
              />
              <span className="font-groove-label text-[10px] uppercase tracking-wider text-groove-ink/70">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
