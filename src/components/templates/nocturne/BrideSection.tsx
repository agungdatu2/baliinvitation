"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85";
// Tinggi container lebih dari 100vh — extra 100vh dipakai buat reveal masuk
// (foto zoom-out + fade konten). Sebelumnya cuma 60vh extra & REVEAL_END
// 0.35 (~145px reveal) — jauh lebih pendek/buru-buru dibanding peredupan
// Hero (~625px, ~0.9 layar) jadi kerasa gak sehalus Hero. Dinaikkan supaya
// jarak reveal-nya sepadan (~0.85 x 100vh extra ≈ 1 layar, mirip Hero).
const SECTION_VH = 200;
const REVEAL_END = 0.85;
// Foto mulai zoom-in (scale > 1) lalu zoom-out ke ukuran normal (scale 1)
// ngikutin scroll masuk — bukan langsung muncul ukuran final.
const IMAGE_SCALE_START = 1.35;

// Section "The Bride" — kembaran struktur Verses.tsx (outer tall wrapper +
// inner sticky viewport) supaya section ini otomatis "menutupi" Verses
// dengan cara yang SAMA PERSIS seperti Verses menutupi Hero (DOM order lebih
// belakang + z-index lebih tinggi + sticky), tanpa perlu kode tambahan di
// Verses sendiri.
export default function BrideSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  // Reveal ini lokal ke container section ini sendiri (bukan progress dari
  // section lain) — jadi otomatis responsif sejak scroll pertama masuk ke
  // section ini, sama seperti overlay Hero, tanpa jeda "beberapa scroll dulu".
  const reveal = useTransform(scrollYProgress, [0, REVEAL_END], [0, 1]);
  const imageScale = useTransform(scrollYProgress, [0, REVEAL_END], [IMAGE_SCALE_START, 1]);

  // `brideParents` satu string gabungan (mis. "Bapak X & Ibu Y") — dipecah jadi
  // baris terpisah kalau ada "&", supaya tampilannya dua baris seperti referensi
  // (tanpa perlu field terpisah untuk nama ayah/ibu).
  const parentLines = data.brideParents
    .split("&")
    .map((line) => line.trim())
    .filter(Boolean);
  const instagramHandle = data.brideInstagram?.replace("@", "");

  return (
    // marginTop negatif -100svh SENGAJA — outer wrapper Verses sebelum ini
    // (pola sama: wrapper tinggi + sticky di dalam) melepas stiky-nya SATU
    // LAYAR PENUH sebelum wrapper-nya sendiri benar-benar berakhir (begitu
    // cara kerja sticky-dalam-wrapper: berhenti nempel begitu sisa tinggi
    // wrapper cuma sepanjang tingginya sendiri lagi). Tanpa margin ini, ada
    // jeda ~1 layar penuh scroll yang terasa "mati" (Verses sudah lepas &
    // geser pergi, tapi section ini belum mulai) sebelum section ini muncul.
    // Menarik section ini naik pas di titik itu membuat section ini langsung
    // menutupi pas Verses mulai lepas, tanpa jeda.
    <div ref={containerRef} className="relative z-20 -mt-[100svh]" style={{ height: `${SECTION_VH}vh` }}>
      <section className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden bg-black px-6 md:px-16">
        <div className="mx-auto flex w-full max-w-5xl flex-col items-center gap-10 md:flex-row md:items-center md:gap-16 lg:gap-24">
          <motion.p
            style={{ opacity: reveal }}
            className="shrink-0 font-groove-label text-xs uppercase tracking-[0.35em] text-groove-bg/60"
          >
            {t.theBride}
          </motion.p>

          <motion.div
            style={{ opacity: reveal }}
            className="relative aspect-[3/4] w-56 shrink-0 overflow-hidden sm:w-64 md:w-80"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img
              src={data.bridePhoto || DEFAULT_PHOTO}
              alt={data.brideFullName}
              style={{ scale: imageScale }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </motion.div>

          <motion.div style={{ opacity: reveal }} className="text-center md:text-left">
            <h2 className="font-nocturne-display text-3xl leading-[1.15] text-groove-bg/90 sm:text-4xl md:text-6xl">
              ({data.brideNickname})
              <br />
              {data.brideFullName}
            </h2>

            <div className="mt-8 space-y-1 font-groove-body text-sm text-groove-bg/70 md:mt-14">
              <p>{t.daughterOf}</p>
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
