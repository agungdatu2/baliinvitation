import { DressCodeItem } from "@/types/invitation";

export default function DressCode({ items }: { items: DressCodeItem[] }) {
  if (!items?.length) return null;
  return (
    <section className="px-6 py-10 max-w-2xl mx-auto text-center">
      <div className="groove-glass rounded-2xl p-8 md:p-10">
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
