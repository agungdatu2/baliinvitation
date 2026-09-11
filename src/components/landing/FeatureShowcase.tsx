"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { MapPin, Pause, Play } from "lucide-react";
import { FRAME_SRC, SCREEN } from "./PhoneFrame";

// Mockup HP di section "Fitur" — bukan screenshot statis, tapi mini preview
// gaya tema Lume yang beneran bisa di-scroll. Tiap tombol fitur di kiri/kanan
// men-scroll ke section yang sesuai DI DALAM layar HP ini (bukan scroll halaman),
// supaya orang langsung lihat widget-nya, bukan cuma baca teks.
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
  "https://images.unsplash.com/photo-1615966650071-855b15f29ad1?auto=format&fit=crop&w=400&q=80",
];

const PHONE_WIDTH = 300;

type FeatureKey = "nama-tamu" | "rsvp" | "ucapan" | "maps" | "music" | "gallery";

const FEATURES: { key: FeatureKey; label: string; desc: string }[] = [
  { key: "nama-tamu", label: "Nama Tamu", desc: "Nama tamu otomatis tampil di undangan, jadi terasa personal buat setiap orang yang diundang." },
  { key: "rsvp", label: "RSVP", desc: "Tamu bisa konfirmasi kehadiran langsung dari undangan, memudahkan kalian menghitung jumlah tamu." },
  { key: "ucapan", label: "Ucapan", desc: "Ada kolom ucapan & doa buat tamu yang ingin menyampaikan pesan untuk kalian." },
  { key: "maps", label: "Google Maps", desc: "Lokasi acara terhubung ke Google Maps, jadi tamu gampang menemukan tempatnya." },
  { key: "music", label: "Backsound Music", desc: "Tambahkan lagu latar favorit kalian biar suasana undangan makin berkesan." },
  { key: "gallery", label: "Gallery", desc: "Bagikan momen kalian lewat galeri foto & video dengan kualitas terbaik." },
];

export default function FeatureShowcase({ waLink }: { waLink: string }) {
  const [active, setActive] = useState<FeatureKey | null>(null);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const sectionRefs = useRef<Record<FeatureKey, HTMLDivElement | null>>({
    "nama-tamu": null,
    rsvp: null,
    ucapan: null,
    maps: null,
    music: null,
    gallery: null,
  });
  const highlightTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goTo = (key: FeatureKey) => {
    sectionRefs.current[key]?.scrollIntoView({ behavior: "smooth", block: "start" });
    setActive(key);
    if (highlightTimeout.current) clearTimeout(highlightTimeout.current);
    highlightTimeout.current = setTimeout(() => setActive(null), 1200);
  };

  const phoneHeight = PHONE_WIDTH * (800 / 389);

  const renderButton = (f: (typeof FEATURES)[number]) => (
    <button
      key={f.key}
      onClick={() => goTo(f.key)}
      className="text-center md:text-left w-full group"
    >
      <p
        className={`font-groove-display text-lg sm:text-xl transition-colors ${
          active === f.key ? "text-groove-primary" : "text-groove-ink group-hover:text-groove-primary"
        }`}
        style={{ fontWeight: 600 }}
      >
        {f.label}
      </p>
      <p className="text-sm text-groove-ink/60 mt-1.5 leading-relaxed">{f.desc}</p>
    </button>
  );

  const left = FEATURES.slice(0, 3);
  const right = FEATURES.slice(3);

  return (
    <div className="grid md:grid-cols-3 gap-12 md:gap-8 items-center">
      <div className="order-2 md:order-1 space-y-10">{left.map(renderButton)}</div>

      <div className="order-1 md:order-2 flex flex-col items-center gap-8">
        <div className="relative" style={{ width: PHONE_WIDTH, height: phoneHeight }}>
          <div
            className="absolute overflow-hidden bg-[#faf7ef]"
            style={{
              left: `${SCREEN.left}%`,
              top: `${SCREEN.top}%`,
              width: `${SCREEN.width}%`,
              height: `${SCREEN.height}%`,
            }}
          >
            <div className="h-full w-full overflow-y-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="px-5 pt-7 pb-2 text-center">
                <p className="font-groove-label uppercase tracking-[0.25em] text-[8px] text-groove-primary-light mb-2">
                  The Wedding Of
                </p>
                <p className="font-groove-display italic text-2xl text-groove-ink" style={{ fontWeight: 500 }}>
                  Made &amp; Ayu
                </p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current["nama-tamu"] = el;
                }}
                className={`px-5 pt-6 pb-7 text-center border-b border-groove-line/60 transition-colors ${active === "nama-tamu" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-2">Tamu Undangan</p>
                <p className="font-groove-display text-base text-groove-ink" style={{ fontWeight: 700 }}>
                  Bapak I Komang Aditya
                </p>
                <p className="text-[9px] text-groove-ink/45 mt-1">Mohon maaf bila ada kesalahan nama/gelar</p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current.rsvp = el;
                }}
                className={`px-5 py-7 border-b border-groove-line/60 transition-colors ${active === "rsvp" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-3 text-center">RSVP</p>
                <p className="text-[10px] text-center text-groove-ink/60 mb-3">Konfirmasi kehadiran Anda</p>
                <div className="flex gap-2 justify-center">
                  <span className="px-3.5 py-1.5 rounded-full bg-groove-ink text-groove-bg text-[9px] font-semibold">Hadir</span>
                  <span className="px-3.5 py-1.5 rounded-full border border-groove-line text-groove-ink/50 text-[9px]">Tidak Hadir</span>
                </div>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current.ucapan = el;
                }}
                className={`px-5 py-7 border-b border-groove-line/60 transition-colors ${active === "ucapan" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-3 text-center">Ucapan &amp; Doa</p>
                <div className="space-y-2">
                  <div className="rounded-xl bg-white/70 p-2.5">
                    <p className="text-[10px] text-groove-ink/75 leading-relaxed">
                      &ldquo;Selamat menempuh hidup baru, semoga sakinah mawaddah warahmah.&rdquo;
                    </p>
                    <p className="text-[9px] text-groove-primary mt-1">— Dewi</p>
                  </div>
                  <div className="rounded-xl bg-white/70 p-2.5">
                    <p className="text-[10px] text-groove-ink/75 leading-relaxed">&ldquo;Bahagia terus buat kalian berdua!&rdquo;</p>
                    <p className="text-[9px] text-groove-primary mt-1">— Putu</p>
                  </div>
                </div>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current.maps = el;
                }}
                className={`px-5 py-7 border-b border-groove-line/60 text-center transition-colors ${active === "maps" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-3">Lokasi Acara</p>
                <div className="rounded-xl overflow-hidden border border-groove-line/60 bg-[#e9e3d6] h-20 flex items-center justify-center">
                  <MapPin size={20} className="text-groove-primary" strokeWidth={1.5} />
                </div>
                <p className="mt-2.5 text-[10px] font-semibold underline text-groove-ink">Buka di Google Maps</p>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current.music = el;
                }}
                className={`px-5 py-7 border-b border-groove-line/60 text-center transition-colors ${active === "music" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-3">Backsound Music</p>
                <button
                  onClick={() => setMusicPlaying((p) => !p)}
                  className="mx-auto flex items-center gap-2.5 rounded-full bg-groove-ink text-groove-bg px-4 py-2"
                >
                  {musicPlaying ? <Pause size={11} /> : <Play size={11} />}
                  <span className="text-[9px]">A Thousand Years — Piano Cover</span>
                </button>
              </div>

              <div
                ref={(el) => {
                  sectionRefs.current.gallery = el;
                }}
                className={`px-5 pt-7 pb-9 transition-colors ${active === "gallery" ? "bg-groove-primary-light/10" : ""}`}
              >
                <p className="text-[8px] uppercase tracking-[0.25em] text-groove-primary mb-3 text-center">Galeri</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {GALLERY_IMAGES.map((src) => (
                    <div key={src} className="aspect-square relative rounded-lg overflow-hidden">
                      <Image src={src} alt="" fill sizes="150px" className="object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <Image src={FRAME_SRC} alt="" fill sizes={`${PHONE_WIDTH}px`} className="pointer-events-none grayscale" />
        </div>

        <a
          href={waLink}
          target="_blank"
          rel="noreferrer"
          className="px-8 py-3 rounded-full border border-groove-ink text-groove-ink text-sm font-semibold uppercase tracking-wide hover:bg-groove-ink hover:text-groove-bg transition"
        >
          Buat Undangan
        </a>
      </div>

      <div className="order-3 space-y-10">{right.map(renderButton)}</div>
    </div>
  );
}
