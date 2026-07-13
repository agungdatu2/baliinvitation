export default function LiveStreaming({ url, note }: { url?: string; note?: string }) {
  if (!url) return null;
  return (
    <section className="px-6 py-10 max-w-md mx-auto text-center">
      <div className="groove-glass rounded-2xl p-8">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary mb-2">Live Streaming</p>
        <h2 className="font-groove-display italic text-2xl mb-4" style={{ fontWeight: 400 }}>
          Tak Bisa Hadir? Saksikan dari Rumah
        </h2>
        {note && <p className="font-groove-body text-sm text-groove-ink/70 mb-6">{note}</p>}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="font-groove-label inline-block px-8 py-2.5 rounded-full bg-groove-primary text-groove-bg text-sm tracking-wide uppercase hover:opacity-90 transition"
        >
          Tonton Live
        </a>
      </div>
    </section>
  );
}
