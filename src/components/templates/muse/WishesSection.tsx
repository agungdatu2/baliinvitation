"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { WishItem } from "@/types/invitation";

// 1 ucapan ditampilkan per giliran (tombol "Next" buat lihat berikutnya) —
// section ini sekarang digabung ke dalam satu layar bersama RSVPForm (lihat
// RSVPForm.tsx), jadi tidak ada ruang untuk daftar panjang.
const PAGE_SIZE = 1;

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

function demoWishes(lang?: Lang): WishItem[] {
  return DEMO_WISHES[lang === "en" ? "en" : "id"].map((w, i) => ({
    id: `demo-${i}`,
    ...w,
    createdAt: new Date().toISOString(),
  }));
}

// Widget inline (bukan <section> sendiri) — dirender DI DALAM section RSVPForm
// supaya form + ucapan yang sudah masuk jadi satu layar, bukan dua section
// snap terpisah. State awal diisi dari `initialWishes` (SSR, lihat
// src/app/[slug]/page.tsx) atau demo (theme-preview) supaya tidak mulai kosong
// lalu tiba-tiba melompat jadi penuh setelah fetch client selesai. Fetch
// client tetap jalan untuk refresh diam-diam, lalu refetch lagi saat
// RSVPForm broadcast event "rsvp-submitted" (custom event, bukan lifting
// state, supaya keduanya tetap independen).
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
      <h3 className="font-reverie-display text-lg leading-tight mb-3" style={{ fontWeight: 400 }}>
        {t.wishesHeading}
      </h3>

      <div className="grid grid-cols-1 gap-2">
        {visibleWishes.map((w) => (
          <div key={w.id} className="border border-groove-bg/30 p-3 bg-black/25">
            <p className="font-groove-body text-xs text-groove-bg mb-0.5" style={{ fontWeight: 600 }}>
              {w.guestName}
            </p>
            <p className="font-groove-body text-xs text-groove-bg/85 leading-relaxed mb-1.5">{w.message}</p>
            <p className="font-groove-label text-[0.6rem] uppercase tracking-wide text-groove-bg/60">
              {new Date(w.createdAt).toLocaleDateString(t.dateLocale, { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        ))}
      </div>

      {/* Loop balik ke halaman pertama setelah halaman terakhir, supaya tombol
          ini tetap konsisten "Next" (bukan berubah jadi "kembali"/disabled). */}
      {hasNext && (
        <div className="mt-2.5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => (p + 1) % totalPages)}
            className="flex items-center gap-1.5 font-groove-label text-[0.65rem] uppercase tracking-[0.2em] text-groove-bg/90 border border-groove-bg/40 px-4 py-1.5 rounded-full hover:border-groove-bg transition"
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
