"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85";
// Tinggi container lebih dari 100vh — extra 100vh dipakai buat reveal masuk
// (foto zoom-out + fade konten), sisanya cuma "menahan" tampilan sticky-nya
// sampai user selesai scroll ke section berikutnya (BrideSection).
const SECTION_VH = 200;
const REVEAL_END = 0.85;
// Foto mulai zoom-in (scale > 1) lalu zoom-out ke ukuran normal (scale 1)
// ngikutin scroll masuk — bukan langsung muncul ukuran final.
const IMAGE_SCALE_START = 1.35;

// Section "The Groom" — kembaran BrideSection.tsx, tampil DULUAN (sebelum
// Bride). Struktur sama persis dengan Verses/BrideSection (outer tall wrapper
// + inner sticky viewport) supaya section ini otomatis "menutupi" Verses,
// dan nanti ikut ketutup oleh BrideSection sesudahnya, dengan cara yang sama
// persis seperti Verses menutupi Hero.
//
// PENTING: backdrop hitamnya HARUS scroll-reactive (opacity: reveal), BUKAN
// className bg-black statis. Section sesudahnya (BrideSection) — sebelum
// benar-benar "nempel" (sticky aktif) — sempat lewat fase "meluncur naik dari
// bawah" dalam posisi normal flow, dan kalau backdrop-nya SUDAH solid hitam
// sejak fase itu (z-index Bride lebih tinggi), itu akan menutupi SEBAGIAN
// section ini sebelum waktunya — kelihatan seperti foto/konten "terpotong"
// tiba-tiba di tengah (sudah pernah kejadian, foto Groom kelihatan cuma
// setengah sebelum fix ini).
export default function GroomSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Reveal ini lokal ke container section ini sendiri (bukan progress dari
  // section lain) — jadi otomatis responsif sejak scroll pertama masuk ke
  // section ini, sama seperti overlay Hero, tanpa jeda "beberapa scroll dulu".
  const reveal = useTransform(scrollYProgress, [0, REVEAL_END], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, REVEAL_END], [IMAGE_SCALE_START, 1]);

  // `groomParents` satu string gabungan (mis. "Bapak X & Ibu Y") — dipecah jadi
  // baris terpisah kalau ada "&", supaya tampilannya dua baris seperti referensi
  // (tanpa perlu field terpisah untuk nama ayah/ibu).
  const parentLines = data.groomParents
    .split("&")
    .map((line) => line.trim())
    .filter(Boolean);
  const instagramHandle = data.groomInstagram?.replace("@", "");

  return (
    // marginTop negatif -100svh SENGAJA — outer wrapper Verses sebelum ini
    // (pola sama: wrapper tinggi + sticky di dalam) melepas stiky-nya SATU
    // LAYAR PENUH sebelum wrapper-nya sendiri benar-benar berakhir. Tanpa
    // margin ini ada jeda ~1 layar penuh scroll yang terasa "mati" sebelum
    // section ini muncul — lihat komentar sama di BrideSection.tsx.
    <div ref={containerRef} className="relative z-20 -mt-[100svh]" style={{ height: `${SECTION_VH}vh` }}>
      <section className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden px-6 md:px-16">
        <motion.div className="absolute inset-0 bg-black" style={{ opacity: reveal }} />

        <div className="relative mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24">
          <motion.p
            style={{ opacity: reveal }}
            className="shrink-0 font-groove-label text-xs uppercase tracking-[0.35em] text-groove-bg/60"
          >
            {t.theGroom}
          </motion.p>

          <motion.div
            style={{ opacity: reveal }}
            className="relative aspect-[3/4] w-56 shrink-0 overflow-hidden sm:w-64 md:w-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={data.groomPhoto || DEFAULT_PHOTO}
              alt={data.groomFullName}
              style={{ scale: imageScale }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>

          <motion.div style={{ opacity: reveal }} className="text-center md:text-left">
            <h2 className="font-nocturne-display text-3xl leading-[1.15] text-groove-bg/90 sm:text-4xl md:text-6xl">
              ({data.groomNickname})
              <br />
              {data.groomFullName}
            </h2>

            <div className="mt-8 space-y-1 font-groove-body text-sm text-groove-bg/70 md:mt-14">
              <p>{t.sonOf}</p>
              {parentLines.map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>

            {instagramHandle && (
              <a
                href={`https://instagram.com/${instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="mt-6 inline-flex items-center gap-3 rounded-full bg-white/10 py-1.5 pl-5 pr-1.5 font-groove-label text-xs uppercase tracking-wide text-groove-bg/90 transition-colors hover:bg-white/20"
              >
                @{instagramHandle}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
