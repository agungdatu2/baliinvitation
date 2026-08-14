"use client";

import { useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { WishItem } from "@/types/invitation";
import WishesSection from "./WishesSection";

interface RSVPFormProps {
  invitationId: string;
  guestName?: string;
  guestId?: string;
  lang?: Lang;
  initialWishes?: WishItem[];
}

// Section RSVP — TANPA foto background sendiri (sama pola dengan LoveStory/
// EventDetails/SaveTheDateSection), transparan supaya FixedVideoBackground yang
// sudah nge-blur (.groove-page-blur) tetap kelihatan di belakangnya. Satu
// langkah (nama, kehadiran, ucapan) -> kirim; guestCount dikirim tetap 1
// (default API) karena field jumlah tamu sengaja dihilangkan dari UI. Daftar
// ucapan yang sudah masuk (WishesSection) digabung di layar yang sama, di
// bawah form — semua ukuran dikecilkan supaya keduanya tetap muat satu layar.
export default function RSVPForm({ invitationId, guestName, guestId, lang, initialWishes }: RSVPFormProps) {
  const t = getDict(lang);
  const ATTEND_OPTIONS = [
    { value: "hadir", label: t.attendYes },
    { value: "tidak_hadir", label: t.attendNo },
  ];
  const [form, setForm] = useState({ guestName: guestName ?? "", attendance: "hadir", guestCount: 1, message: "", sendingGift: false });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/rsvp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invitationId, guestId, ...form }),
    });
    setLoading(false);
    setSent(true);
    window.dispatchEvent(new CustomEvent("rsvp-submitted"));
  };

  // text-base (16px) bukan text-sm — di bawah 16px, Safari/Chrome mobile auto-zoom
  // begitu input di-focus (mengganggu, harus di-pinch-zoom-out manual sesudahnya).
  // md:text-sm supaya di desktop tetap konsisten ukurannya dengan teks lain.
  const fieldClass =
    "w-full border border-groove-bg/40 bg-transparent px-3 py-2 text-base md:text-xs text-groove-bg placeholder:text-groove-bg/50 focus:outline-none focus:border-groove-bg transition-colors";
  const labelClass = "font-groove-label block text-[0.6rem] uppercase tracking-widest text-groove-bg/80 mb-1.5";
  const solidButtonClass =
    "w-full py-2.5 bg-groove-stone text-groove-bg text-[0.65rem] tracking-[0.2em] uppercase disabled:opacity-50 transition hover:bg-groove-stone/85";

  return (
    <section className="relative min-h-[100lvh] flex flex-col justify-center text-groove-bg px-6 py-14">
      <div className="max-w-md mx-auto w-full">
        <h2 className="font-reverie-display text-xl md:text-2xl leading-tight mb-5" style={{ fontWeight: 400 }}>
          {t.rsvpHeading}
        </h2>

        {sent ? (
          <p className="font-groove-body text-xs text-groove-bg/90 mb-5">{t.rsvpSuccess}</p>
        ) : (
          <form onSubmit={submit} className="space-y-3.5 text-left mb-6">
            <div>
              <label className={labelClass}>{t.nameLabel}</label>
              <input
                required
                placeholder={t.namePlaceholder}
                className={fieldClass}
                value={form.guestName}
                onChange={(e) => setForm({ ...form, guestName: e.target.value })}
              />
            </div>

            <div>
              <label className={labelClass}>{t.attendanceLabel}</label>
              <div className="flex gap-2">
                {ATTEND_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, attendance: opt.value })}
                    className={`flex-1 py-2 border text-[0.65rem] tracking-wide uppercase transition ${
                      form.attendance === opt.value
                        ? "border-groove-bg text-groove-bg"
                        : "border-groove-bg/40 text-groove-bg/60"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className={labelClass}>{t.wishesLabel}</label>
              <textarea
                className={fieldClass}
                rows={2}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.sendingGift}
                onChange={(e) => setForm({ ...form, sendingGift: e.target.checked })}
                className="w-3.5 h-3.5 accent-groove-bg"
              />
              <span className="font-groove-body text-[0.7rem] text-groove-bg/80">{t.sendingGiftLabel}</span>
            </label>

            <button disabled={loading} className={solidButtonClass}>
              {loading ? t.sending : t.send}
            </button>
          </form>
        )}

        <WishesSection invitationId={invitationId} lang={lang} initialWishes={initialWishes} />
      </div>
    </section>
  );
}
