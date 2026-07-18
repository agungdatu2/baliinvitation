import { getDict, Lang } from "@/lib/i18n/lume";

export default function LiveStreaming({ url, note, lang }: { url?: string; note?: string; lang?: Lang }) {
  if (!url) return null;
  const t = getDict(lang);
  return (
    <section className="groove-overlay text-groove-bg py-12 px-6 text-center">
      <div className="max-w-5xl mx-auto">
      <div className="max-w-md mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-bg/70 mb-2">{t.liveStreamingTitle}</p>
        <h2 className="font-reverie-display italic text-2xl mb-4" style={{ fontWeight: 400 }}>
          {t.liveStreamingSubtitle}
        </h2>
        {note && <p className="font-groove-body text-sm text-groove-bg/80 mb-6">{note}</p>}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-groove-label inline-block px-8 py-2.5 rounded-full bg-groove-primary text-groove-bg text-sm tracking-wide uppercase hover:opacity-90 transition"
        >
          {t.watchLive}
        </a>
      </div>
      </div>
    </section>
  );
}
