import { RefObject, useState } from "react";
import { useScroll, useMotionValueEvent, useTransform, useSpring, motion } from "motion/react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import { HERO_DIM_END } from "./Verses";

const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=85";
const MARQUEE_REPEAT = 4;

interface HeroProps {
  data: InvitationData;
  // Ref ke container Verses (di-lift dari NocturneTemplate) — dipakai buat
  // ngukur progress scroll masuk ke Verses, SUMBER YANG SAMA dengan yang
  // dipakai Verses sendiri untuk tahap "hero meredup"-nya (lihat HERO_DIM_END).
  versesContainerRef: RefObject<HTMLDivElement>;
}

// Hero tema Nocturne — background video/foto full-bleed, eyebrow "THE WEDDING
// OF" kiri-atas + tanggal kanan-atas (persis referensi client), kutipan CENTER
// di tengah layar (revisi dari referensi yang rata kiri), dan nama pasangan
// RAKSASA berjalan sebagai marquee di PALING BAWAH (revisi — di referensi
// marquee ada di tengah, kutipan di bawahnya; di sini ditukar).
export default function Hero({ data, versesContainerRef }: HeroProps) {
  const t = getDict(data.language);

  // Overlay hitam Hero SENDIRI (bukan titip ke backdrop section Verses) —
  // dulu peredupan cuma datang dari backdrop di dalam Verses' sticky viewport,
  // yang baru benar-benar menutup penuh SESAAT SETELAH Verses jadi sticky.
  // Pas transisi (terutama scroll cepat/momentum di HP), ada jeda singkat di
  // mana Verses belum menutup penuh tapi kontennya sudah ke-reveal, jadi
  // Hero kelihatan "nyempil" polos berdampingan dengan konten yang sudah
  // gelap — keliatan seperti sambungan/seam yang kasar.
  // Fix: taruh overlay peredupannya DI HERO SENDIRI (elemen sticky full-layar
  // yang sama terus, tidak pernah punya masalah timing dengan dirinya
  // sendiri), pakai sumber scroll-progress yang SAMA (containerRef Verses)
  // supaya waktunya identik dengan tahap 1 punya Verses.
  const { scrollYProgress: rawProgress } = useScroll({
    target: versesContainerRef,
    offset: ["start start", "end end"],
  });
  const scrollYProgress = useSpring(rawProgress, { stiffness: 60, damping: 20, mass: 0.5 });
  const heroDim = useTransform(scrollYProgress, [0, HERO_DIM_END], [0, 1]);
  // Sekali gelap total, DIKUNCI (sama seperti backdrop Verses) — supaya
  // scroll balik ke atas sedikit saja tidak langsung mengulang animasi
  // peredupan secara terbalik (dulu heroDim murni fungsi dari posisi scroll,
  // jadi scroll mundur bikin Hero "muncul lagi" pelan-pelan, kerasa seperti
  // animasinya mainan berulang).
  const [dimmed, setDimmed] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v >= HERO_DIM_END) setDimmed(true);
  });
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const nameTrack = `${t.theWeddingOf} ${data.groomNickname} – ${data.brideNickname}`;
  const track = Array.from({ length: MARQUEE_REPEAT }, () => nameTrack);
  const loopedTrack = [...track, ...track];

  return (
    // sticky (bukan cuma relative) — dibiarkan "nempel" di top:0 selama Verses
    // di-scroll, supaya section ini (+ overlay peredupannya di bawah) selalu
    // full-layar tanpa jeda, lalu akhirnya ketutup total begitu Verses (z-10,
    // urutan DOM belakangan) sudah solid hitam di atasnya.
    <section id="hero" className="sticky top-0 z-0 h-[100svh] w-full overflow-hidden text-groove-bg">
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

      {/* Tanggal — pojok kiri-atas (revisi: eyebrow "THE WEDDING OF" dihapus,
          sudah redundan karena kalimat itu sekarang ada di teks marquee). */}
      <p className="absolute top-6 md:top-10 left-6 md:left-12 font-groove-label text-xs md:text-sm uppercase tracking-[0.2em] text-groove-bg/90">
        {eventDateLabel}
      </p>

      {/* Kutipan — center layar */}
      <div className="absolute inset-0 flex items-center justify-center px-6 md:px-24">
        <p className="max-w-[250px] md:max-w-[290px] text-center font-groove-body text-sm md:text-base leading-relaxed text-groove-bg/90 whitespace-pre-line">
          {data.quote || t.defaultPrayerQuote}
        </p>
      </div>

      {/* Marquee nama pasangan — paling bawah. SENGAJA tanpa overflow di sini
          (browser menganggap "overflow-x: hidden" tanpa overflow-y eksplisit
          sebagai overflow-y: auto, yang tetap motong descender huruf italic
          mis. ekor "y") — horizontal clipping buat efek marquee-nya cukup
          diserahkan ke overflow-hidden section (jauh lebih tinggi, jadi aman). */}
      <div className="absolute bottom-8 md:bottom-14 inset-x-0">
        <div className="flex w-max items-center gap-8 md:gap-12 whitespace-nowrap animate-nocturne-marquee">
          {loopedTrack.map((name, i) => (
            <span key={i} className="flex items-center gap-8 md:gap-12 shrink-0">
              <span className="font-nocturne-display italic text-5xl sm:text-6xl md:text-8xl leading-none">{name}</span>
              <span className="font-nocturne-display text-2xl md:text-4xl text-groove-bg/50">*</span>
            </span>
          ))}
        </div>
      </div>

      {/* Overlay peredupan — di atas SEGALANYA di dalam Hero (background,
          tanggal, kutipan, marquee ikut meredup bareng), opacity 0 -> 1
          ngikutin scroll masuk ke Verses, lalu dikunci solid (div biasa,
          bukan motion) begitu `dimmed` true supaya tidak pernah "muncul lagi"
          walau scroll dibalik. pointer-events-none supaya nav/menu Hero tetap
          bisa diklik selama overlay belum solid. */}
      {dimmed ? (
        <div className="absolute inset-0 bg-black pointer-events-none" />
      ) : (
        <motion.div className="absolute inset-0 bg-black pointer-events-none" style={{ opacity: heroDim }} />
      )}
    </section>
  );
}
