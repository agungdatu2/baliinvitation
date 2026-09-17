"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { WishItem } from "@/types/invitation";

const PAGE_SIZE = 1;

const DEMO_WISHES: Record<"id" | "en", { guestName: string; message: string }[]> = {
  id: [
    { guestName: "Dewi Anjani", message: "Selamat menempuh hidup baru! Semoga selalu bahagia dan langgeng sampai kakek nenek." },
    { guestName: "Rangga Pratama", message: "Kalian pasangan yang sangat serasi. Turut berbahagia atas pernikahan kalian!" },
    { guestName: "Putu Ayu Lestari", message: "Selamat ya buat kalian berdua, semoga rumah tangganya sakinah mawaddah warahmah." },
  ],
  en: [
    { guestName: "Dewi Anjani", message: "Congratulations on your new journey together! Wishing you a lifetime of happiness." },
    { guestName: "Rangga Pratama", message: "You two are such a perfect match. So happy for your wedding!" },
    { guestName: "Putu Ayu Lestari", message: "Congratulations to you both — may your marriage be filled with love and blessings." },
  ],
};

function demoWishes(lang?: Lang): WishItem[] {
  return DEMO_WISHES[lang === "en" ? "en" : "id"].map((w, i) => ({
    id: `demo-${i}`,
    ...w,
    createdAt: new Date().toISOString(),
  }));
}

// Kembaran WishesSection.tsx milik Reverie — daftar ucapan yang sudah masuk,
// satu ucapan per giliran (tombol "Next"). Dirender di dalam RSVPForm.tsx
// Nocturne, di bawah form-nya.
export default function WishesSection({
  invitationId,
  lang,
  initialWishes,
}: {
  invitationId: string;
  lang?: Lang;
  initialWishes?: WishItem[];
}) {
  const t = getDict(lang);
  const [wishes, setWishes] = useState<WishItem[]>(
    () => initialWishes ?? (invitationId === "preview" ? demoWishes(lang) : [])
  );
  const [page, setPage] = useState(0);

  useEffect(() => {
    const loadWishes = () => {
      fetch(`/api/rsvp?invitationId=${invitationId}`)
        .then((r) => r.json())
        .then((data: WishItem[]) => {
          const real = Array.isArray(data) ? data.filter((w) => w.message?.trim()) : [];
          if (real.length === 0 && invitationId === "preview") {
            setWishes(demoWishes(lang));
          } else {
            setWishes(real);
          }
          setPage(0);
        })
        .catch(() => {});
    };
    loadWishes();
    window.addEventListener("rsvp-submitted", loadWishes);
    return () => window.removeEventListener("rsvp-submitted", loadWishes);
  }, [invitationId, lang]);

  if (!wishes.length) return null;

  const totalPages = Math.ceil(wishes.length / PAGE_SIZE);
  const visibleWishes = wishes.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const hasNext = totalPages > 1;

  return (
    <div>
      <h3 className="font-nocturne-display text-lg leading-tight text-groove-bg">{t.wishesHeading}</h3>

      <div className="mt-3 grid grid-cols-1 gap-2">
        {visibleWishes.map((w) => (
          <div key={w.id} className="border border-groove-bg/15 bg-white/[0.03] p-4">
            <p className="mb-1 font-groove-body text-sm font-semibold text-groove-bg">{w.guestName}</p>
            <p className="mb-2 font-groove-body text-sm leading-relaxed text-groove-bg/80">{w.message}</p>
            <p className="font-groove-label text-[0.6rem] uppercase tracking-wide text-groove-bg/50">
              {new Date(w.createdAt).toLocaleDateString(t.dateLocale, { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>

      {hasNext && (
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="flex items-center gap-1.5 rounded-full border border-groove-bg/30 px-4 py-1.5 font-groove-label text-[0.65rem] uppercase tracking-[0.2em] text-groove-bg/90 transition-colors hover:border-groove-bg"
          >
            {t.rsvpNext} <ArrowRight className="h-3 w-3" />
          </button>
          <p className="font-groove-label text-[0.6rem] uppercase tracking-widest text-groove-bg/50">
            {page + 1} / {totalPages}
          </p>
        </div>
      )}
    </div>
  );
}
