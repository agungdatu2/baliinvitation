import { InvitationData } from "@/types/invitation";

export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  return (
    <section className="px-6 py-10 max-w-2xl mx-auto text-center">
      <div className="groove-glass rounded-2xl p-8 md:p-10">
        <p className="text-xs uppercase tracking-widest text-groove-moss mb-2">Perjalanan Kami</p>
        <h2 className="font-groove-display italic text-3xl mb-10" style={{ fontWeight: 500 }}>
          {data.groomNickname} &amp; {data.brideNickname}
        </h2>
        <div>
          {data.loveStory.map((item, i) => (
            <div key={i} className={`text-left py-6 ${i > 0 ? "border-t border-groove-line" : ""}`}>
              <div className="flex items-start gap-4">
                <span className="mt-1.5 w-1.5 h-1.5 rotate-45 bg-groove-clay shrink-0" aria-hidden="true" />
                <div>
                  <h4 className="font-groove-display text-lg mb-1" style={{ fontWeight: 600 }}>
                    {item.title}
                  </h4>
                  <p className="text-sm text-groove-ink/75 leading-relaxed whitespace-pre-line">{item.story}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
