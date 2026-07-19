"use client";

import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";

interface WishItem {
  id: string;
  guestName: string;
  message?: string | null;
  createdAt: string;
}

// Section terpisah dari RSVPForm — sengaja dipisah karena daftar ucapan bisa
// tumbuh panjang dan akan merusak feel "satu section per scroll-snap" kalau
// digabung di kolom form yang sama. Fetch sendiri saat mount, lalu refetch saat
// RSVPForm broadcast event "rsvp-submitted" (custom event, bukan lifting state,
// supaya dua section ini tetap independen).
export default function WishesSection({ invitationId, lang }: { invitationId: string; lang?: Lang }) {
  const t = getDict(lang);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  useEffect(() => {
    const loadWishes = () => {
      fetch(`/api/rsvp?invitationId=${invitationId}`)
        .then((r) => r.json())
        .then((data: WishItem[]) => setWishes(Array.isArray(data) ? data.filter((w) => w.message?.trim()) : []))
        .catch(() => {});
    };
    loadWishes();
    window.addEventListener("rsvp-submitted", loadWishes);
    return () => window.removeEventListener("rsvp-submitted", loadWishes);
  }, [invitationId]);

  if (!wishes.length) return null;

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center text-groove-bg px-6 py-20">
      <div className="max-w-2xl mx-auto w-full">
        <h2 className="font-reverie-display text-3xl md:text-4xl leading-tight mb-10 text-center" style={{ fontWeight: 400 }}>
          {t.wishesHeading}
        </h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {wishes.map((w) => (
            <div key={w.id} className="border border-groove-bg/30 p-5 bg-black/25">
              <p className="font-groove-body text-sm text-groove-bg mb-1" style={{ fontWeight: 600 }}>
                {w.guestName}
              </p>
              <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed mb-4">{w.message}</p>
              <p className="font-groove-label text-[0.65rem] uppercase tracking-wide text-groove-bg/60">
                {new Date(w.createdAt).toLocaleDateString(t.dateLocale, { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
