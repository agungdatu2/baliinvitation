import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85";
const MARQUEE_REPEAT = 4;

// Hero tema Nocturne — background video/foto full-bleed, eyebrow "THE WEDDING
// OF" kiri-atas + tanggal kanan-atas (persis referensi client), kutipan CENTER
// di tengah layar (revisi dari referensi yang rata kiri), dan nama pasangan
// RAKSASA berjalan sebagai marquee di PALING BAWAH (revisi — di referensi
// marquee ada di tengah, kutipan di bawahnya; di sini ditukar).
export default function Hero({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const nameTrack = `${data.groomNickname} – ${data.brideNickname}`;
  const track = Array.from({ length: MARQUEE_REPEAT }, () => nameTrack);
  const loopedTrack = [...track, ...track];

  return (
    <section id="hero" className="relative h-[100svh] w-full overflow-hidden text-groove-bg">
      {data.heroVideoUrl ? (
        <video
          src={data.heroVideoUrl}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={DEFAULT_BACKGROUND} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-groove-stone/45" />

      {/* Eyebrow + tanggal — bertumpuk (kiri) di mobile supaya tidak numpuk kalau
          teksnya kepanjangan, baru jadi kiri-kanan sejajar di desktop. Jarak kanan
          desktop disengaja lega (md:right-24) supaya tidak ketiban tombol
          hamburger NavMenu yang duduk di pojok kanan-atas juga. */}
      <div className="absolute top-6 md:top-10 left-6 right-6 md:left-12 md:right-24 flex flex-col md:flex-row md:items-start md:justify-between gap-1">
        <p className="font-groove-label text-xs md:text-sm uppercase tracking-[0.2em] text-groove-bg/90">
          {t.theWeddingOf}
        </p>
        <p className="font-groove-label text-xs md:text-sm uppercase tracking-[0.2em] text-groove-bg/90 md:text-right">
          {eventDateLabel}
        </p>
      </div>

      {/* Kutipan — center layar */}
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24">
        <p className="max-w-xl text-center font-groove-body text-sm md:text-base leading-relaxed text-groove-bg/90 whitespace-pre-line">
          {data.quote || t.defaultPrayerQuote}
        </p>
      </div>

      {/* Marquee nama pasangan — paling bawah */}
      <div className="absolute bottom-8 md:bottom-14 inset-x-0 overflow-hidden">
        <div className="flex w-max items-center gap-8 md:gap-12 whitespace-nowrap animate-nocturne-marquee">
          {loopedTrack.map((name, i) => (
            <span key={i} className="flex items-center gap-8 md:gap-12 shrink-0">
              <span className="font-nocturne-display italic text-5xl sm:text-6xl md:text-8xl leading-none">{name}</span>
              <span className="font-nocturne-display text-2xl md:text-4xl text-groove-bg/50">*</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
