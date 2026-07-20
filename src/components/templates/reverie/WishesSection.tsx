"use client";

import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";

interface WishItem {
  id: string;
  guestName: string;
  message?: string | null;
  createdAt: string;
}

// 9 ucapan contoh — cuma dipakai theme-preview (invitationId "preview" tidak
// terhubung ke undangan asli di DB, jadi fetch API selalu balik array kosong)
// supaya section ini kelihatan terisi saat client/tim lihat demo tema, bukan
// kosong melompong.
const DEMO_WISHES: Record<"id" | "en", { guestName: string; message: string }[]> = {
  id: [
    { guestName: "Dewi Anjani", message: "Selamat menempuh hidup baru! Semoga selalu bahagia dan langgeng sampai kakek nenek." },
    { guestName: "Rangga Pratama", message: "Kalian pasangan yang sangat serasi. Turut berbahagia atas pernikahan kalian!" },
    { guestName: "Putu Ayu Lestari", message: "Selamat ya buat kalian berdua, semoga rumah tangganya sakinah mawaddah warahmah." },
    { guestName: "Kadek Wirawan", message: "Happy wedding! Semoga cinta kalian terus tumbuh setiap harinya." },
    { guestName: "Nadia Safitri", message: "Bahagia banget lihat kalian akhirnya menikah. Selamat menempuh hidup baru!" },
    { guestName: "Bayu Segara", message: "Selamat! Semoga jadi keluarga yang harmonis dan selalu diberkahi." },
    { guestName: "Made Suryani", message: "Wishing you both a lifetime of love and happiness. Congratulations!" },
    { guestName: "Agus Setiawan", message: "Selamat menikah! Sehat selalu dan cepat dikasih momongan ya hehe." },
    { guestName: "Intan Permatasari", message: "So happy for you two! May your marriage be filled with love and laughter." },
  ],
  en: [
    { guestName: "Dewi Anjani", message: "Congratulations on your new journey together! Wishing you a lifetime of happiness." },
    { guestName: "Rangga Pratama", message: "You two are such a perfect match. So happy for your wedding!" },
    { guestName: "Putu Ayu Lestari", message: "Congratulations to you both — may your marriage be filled with love and blessings." },
    { guestName: "Kadek Wirawan", message: "Happy wedding! May your love keep growing every single day." },
    { guestName: "Nadia Safitri", message: "So thrilled to see you two finally tie the knot. Congratulations!" },
    { guestName: "Bayu Segara", message: "Congrats! Wishing you a harmonious family and endless blessings." },
    { guestName: "Made Suryani", message: "Wishing you both a lifetime of love and happiness. Congratulations!" },
    { guestName: "Agus Setiawan", message: "Congratulations on your wedding! Stay healthy and happy always." },
    { guestName: "Intan Permatasari", message: "So happy for you two! May your marriage be filled with love and laughter." },
  ],
};

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
        .then((data: WishItem[]) => {
          const real = Array.isArray(data) ? data.filter((w) => w.message?.trim()) : [];
          if (real.length === 0 && invitationId === "preview") {
            const demo = DEMO_WISHES[lang === "en" ? "en" : "id"];
            setWishes(demo.map((w, i) => ({ id: `demo-${i}`, ...w, createdAt: new Date().toISOString() })));
          } else {
            setWishes(real);
          }
        })
        .catch(() => {});
    };
    loadWishes();
    window.addEventListener("rsvp-submitted", loadWishes);
    return () => window.removeEventListener("rsvp-submitted", loadWishes);
  }, [invitationId, lang]);

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
