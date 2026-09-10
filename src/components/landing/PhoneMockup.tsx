// Frame HP CSS murni membungkus iframe live ke halaman produk sungguhan
// (/theme-preview/[key] atau undangan asli) — jadi mockup selalu ikut update
// otomatis kalau tema berubah, tanpa perlu screenshot statis yang bisa basi.
//
// iframe di-render di lebar HP asli (NATIVE_WIDTH) lalu di-scale visual turun
// ke `width` yang diminta — supaya konten di dalamnya reflow seperti di HP
// sungguhan, bukan reflow aneh karena viewport iframe kekecilan.
const NATIVE_WIDTH = 390;
const NATIVE_HEIGHT = 844;

export default function PhoneMockup({
  src,
  width,
  className = "",
  interactive = true,
}: {
  src: string;
  width: number;
  className?: string;
  // false = iframe tidak menerima pointer event (dipakai di dalam marquee yang
  // bisa di-drag — kalau iframe tetap interactive, drag di atasnya "kemakan"
  // oleh iframe dan tidak sampai ke handler drag milik marquee).
  interactive?: boolean;
}) {
  const scale = width / NATIVE_WIDTH;
  const height = width * (NATIVE_HEIGHT / NATIVE_WIDTH);

  return (
    <div
      className={`relative rounded-[2rem] border-[6px] border-groove-ink bg-groove-ink shadow-2xl overflow-hidden ${className}`}
      style={{ width, height }}
    >
      <div className="absolute top-0 inset-x-0 h-5 flex items-center justify-center z-10">
        <div className="w-16 h-4 bg-groove-ink rounded-full" />
      </div>
      <iframe
        src={src}
        title="Preview undangan"
        loading="lazy"
        style={{
          width: NATIVE_WIDTH,
          height: NATIVE_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          border: 0,
          pointerEvents: interactive ? "auto" : "none",
        }}
      />
    </div>
  );
}
