"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

// Foto real klien (couple) yang sudah pakai BaliInvitation — filename polanya
// "nama1-nama2.webp", nama tampilannya diturunkan otomatis dari situ (kapital +
// dipisah "&") supaya tambah klien baru cukup taruh file baru di folder ini.
// Urutan tampil sengaja diminta: Dion & Nindy, Ash & Orcid, Eno & Via duluan.
const CLIENT_FILES = [
  "dion-nindy",
  "ash-orcid",
  "eno-via",
  "ari-ana",
  "arik-eka",
  "bagas-wulan",
  "bawa-gekmas",
  "bayu-dewi",
  "dedek-gadis",
  "dekdi-bella",
  "dewa-virgin",
  "dharma-dewaayu",
  "dita-sonia",
  "eka-linda",
  "gusdeny-gegdwi",
  "lucky-novita",
  "medy-zonia",
  "putra-wulan",
  "ratna-adrian",
  "sujata-wija",
  "turah-gungistri",
  "alit-titin",
  "anton-mita",
];

function displayName(file: string) {
  return file
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" & ");
}

const AUTO_SCROLL_SPEED = 28; // px/detik, dibuat pelan & elegant
const RESUME_DELAY = 1200; // ms jeda sebelum auto-scroll lanjut lagi setelah user lepas drag/swipe

export default function ClientCarousel() {
  // Track diduplikasi 2x supaya scroll bisa di-wrap mulus (looping) tanpa jeda.
  const track = [...CLIENT_FILES, ...CLIENT_FILES];

  const scrollerRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, scrollLeft: 0 });
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    // Mulai dari tengah track pertama supaya ada ruang drag ke kiri & kanan
    // sebelum wrap-nya kepakai.
    el.scrollLeft = el.scrollWidth / 4;

    let raf: number;
    let last = performance.now();

    const wrap = () => {
      const half = el.scrollWidth / 2;
      if (el.scrollLeft < 0) el.scrollLeft += half;
      else if (el.scrollLeft >= half) el.scrollLeft -= half;
    };

    const step = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      if (!pausedRef.current && !draggingRef.current) {
        el.scrollLeft += AUTO_SCROLL_SPEED * dt;
      }
      wrap();
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, []);

  const scheduleResume = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, RESUME_DELAY);
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    // Sentuh (touch) dibiarkan pakai native swipe scroll bawaan browser.
    if (e.pointerType !== "mouse") return;
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragStartRef.current = { x: e.clientX, scrollLeft: el.scrollLeft };
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollLeft = dragStartRef.current.scrollLeft - (e.clientX - dragStartRef.current.x);
  };

  const handlePointerUp = () => {
    draggingRef.current = false;
    scheduleResume();
  };

  return (
    <div
      ref={scrollerRef}
      className="relative overflow-x-scroll overflow-y-hidden no-scrollbar cursor-grab active:cursor-grabbing select-none"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="flex w-max gap-6">
        {track.map((file, i) => (
          <div
            key={`${file}-${i}`}
            className="relative shrink-0 w-56 sm:w-72 md:w-80 aspect-[550/700] rounded-2xl overflow-hidden border border-groove-line"
          >
            <Image
              src={`/landing/clients/${file}.webp`}
              alt={displayName(file)}
              fill
              // Lazy loading (default Next.js) memantau posisi asli elemen di
              // viewport — karena track ini bisa digeser drag/scroll, sebagian
              // kartu dianggap "di luar viewport" duluan walau bakal kelihatan
              // sebentar lagi. Eager supaya semua foto (cuma 23 file unik)
              // langsung di-fetch dari awal, gak ada yang telat muncul.
              loading="eager"
              sizes="(min-width: 768px) 320px, (min-width: 640px) 288px, 224px"
              className="object-cover pointer-events-none"
              draggable={false}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pt-16 pb-4 px-4">
              <p className="text-white text-lg sm:text-xl font-groove-display text-center" style={{ fontWeight: 500 }}>
                {displayName(file)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
