export default function LiveStreaming({ url, note }: { url?: string; note?: string }) {
  if (!url) return null;
  return (
    <section className="px-6 py-14 max-w-md mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2">Live Streaming</p>
      <h2 className="font-serif text-2xl mb-4">Saksikan Momen Bahagia Kami</h2>
      {note && <p className="text-sm text-gray-600 mb-6">{note}</p>}
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="inline-block px-8 py-2 rounded-full border border-lume-ink text-sm hover:bg-lume-ink hover:text-white transition"
      >
        Tonton Live
      </a>
    </section>
  );
}
