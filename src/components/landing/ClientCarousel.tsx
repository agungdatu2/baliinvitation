"use client";

import { useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Foto real klien (couple) yang sudah pakai BaliInvitation — filename polanya
// "nama1-nama2.webp", nama tampilannya diturunkan otomatis dari situ (kapital +
// dipisah "&") supaya tambah klien baru cukup taruh file baru di folder ini.
const CLIENT_FILES = [
  "ari-ana",
  "arik-eka",
  "bagas-wulan",
  "bawa-gekmas",
  "bayu-dewi",
  "dedek-gadis",
  "dekdi-bella",
  "dewa-virgin",
  "dharma-dewaayu",
  "dion-nindy",
  "dita-sonia",
  "eka-linda",
  "eno-via",
  "gusdeny-gegdwi",
  "lucky-novita",
  "medy-zonia",
  "putra-wulan",
  "ratna-adrian",
  "sujata-wija",
  "turah-gungistri",
  "alit-titin",
  "anton-mita",
  "ash-orcid",
];

function displayName(file: string) {
  return file
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" & ");
}

// Drag state pakai ref (bukan state) supaya mousemove yang nembak puluhan kali per
// detik tidak memicu re-render — cuma scrollLeft elemen DOM yang diubah langsung.
interface DragState {
  isDown: boolean;
  startX: number;
  startScrollLeft: number;
}

export default function ClientCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<DragState>({ isDown: false, startX: 0, startScrollLeft: 0 });

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Touch/pen biarkan pakai swipe native browser (sudah "dragable" tanpa bantuan
    // JS) — custom drag ini cuma buat mouse, supaya tidak bentrok dengan momentum
    // scroll native di HP.
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    drag.current = { isDown: true, startX: e.clientX, startScrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el || !drag.current.isDown) return;
    el.scrollLeft = drag.current.startScrollLeft - (e.clientX - drag.current.startX);
  };

  const endDrag = () => {
    drag.current.isDown = false;
  };

  const scrollByCard = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-client-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth / 3;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative max-w-5xl mx-auto px-6">
      <div
        ref={scrollerRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        className="flex gap-5 overflow-x-auto snap-x snap-proximity scroll-smooth cursor-grab active:cursor-grabbing select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {CLIENT_FILES.map((file) => (
          <div
            key={file}
            data-client-card
            className="relative flex-none snap-start basis-[80%] sm:basis-[46%] md:basis-[31.5%] aspect-[550/700] rounded-2xl overflow-hidden border border-groove-line"
          >
            <Image
              src={`/landing/clients/${file}.webp`}
              alt={displayName(file)}
              fill
              draggable={false}
              sizes="(min-width: 768px) 320px, (min-width: 640px) 46vw, 80vw"
              className="object-cover pointer-events-none"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pt-16 pb-4 px-4">
              <p className="text-white text-lg sm:text-xl font-groove-display text-center" style={{ fontWeight: 500 }}>
                {displayName(file)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => scrollByCard(-1)}
        aria-label="Sebelumnya"
        className="hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-groove-bg border border-groove-line shadow-md hover:bg-groove-line/30 transition"
      >
        <ChevronLeft className="h-5 w-5 text-groove-ink" />
      </button>
      <button
        onClick={() => scrollByCard(1)}
        aria-label="Berikutnya"
        className="hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 items-center justify-center rounded-full bg-groove-bg border border-groove-line shadow-md hover:bg-groove-line/30 transition"
      >
        <ChevronRight className="h-5 w-5 text-groove-ink" />
      </button>
    </div>
  );
}
