import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

// Full-viewport, TANPA foto background sendiri (beda dari GroomSection/BrideSection/
// PrayerSection) — sengaja dibiarkan transparan supaya FixedVideoBackground yang
// sudah nge-blur (lihat .groove-page-blur di ReverieTemplate) tetap kelihatan di
// belakangnya.
export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  const t = getDict(data.language);
  return (
    <section className="relative h-[100svh] flex items-center text-groove-bg px-6 md:px-14">
      <div className="max-w-2xl mx-auto md:mx-0">
        <h2 className="font-reverie-display italic text-4xl md:text-5xl leading-tight mb-10" style={{ fontWeight: 500 }}>
          {t.loveStoryHeading}
        </h2>

        <div className="space-y-6">
          {data.loveStory.map((item, i) => (
            <div key={i}>
              <h4 className="font-groove-label text-xs uppercase tracking-widest text-groove-bg/70 mb-1.5">
                {item.title}
              </h4>
              <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed whitespace-pre-line">
                {item.story}
              </p>
            </div>
          ))}
        </div>

        <p className="font-reverie-display italic text-xl mt-10 text-right">
          {data.groomNickname} &amp; {data.brideNickname}
        </p>
      </div>
    </section>
  );
}
