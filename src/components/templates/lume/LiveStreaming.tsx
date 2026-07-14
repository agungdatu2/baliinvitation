export default function LiveStreaming({ url, note }: { url?: string; note?: string }) {
  if (!url) return null;
  return (
    <section className="groove-overlay text-groove-bg py-12 px-6 text-center">
      <div className="max-w-md mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary mb-2">Live Streaming</p>
        <h2 className="font-groove-display italic text-2xl mb-4" style={{ fontWeight: 400 }}>
          Tak Bisa Hadir? Saksikan dari Rumah
        </h2>
        {note && <p className="font-groove-body text-sm text-groove-bg/80 mb-6">{note}</p>}
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
