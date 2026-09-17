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

// Kembaran RSVPForm.tsx milik Reverie, restyle gelap Nocturne. Sama seperti
// Reverie: guestCount dikirim tetap 1 (field-nya sengaja tidak ada di UI),
// WishesSection digabung di layar yang sama di bawah form.
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

  // text-base (16px), bukan text-sm — di bawah 16px, Safari/Chrome mobile
  // auto-zoom begitu input di-focus.
  const fieldClass =
    "w-full border border-groove-bg/25 bg-transparent px-3 py-2.5 text-base md:text-sm text-groove-bg placeholder:text-groove-bg/40 focus:outline-none focus:border-groove-bg/70 transition-colors";
  const labelClass = "font-groove-label block text-[0.65rem] uppercase tracking-widest text-groove-bg/70 mb-1.5";
  const solidButtonClass =
    "w-full py-3 bg-groove-bg text-groove-stone font-groove-label text-xs tracking-[0.2em] uppercase disabled:opacity-50 transition hover:bg-groove-bg/85";

  return (
    // relative + z-50 SENGAJA — lihat komentar sama di SaveTheDateSection.tsx
    // (Hero sticky tanpa z-index menang lawan elemen statis manapun).
    <section className="relative z-50 bg-black px-6 py-24 text-groove-bg md:py-32">
      <div className="mx-auto w-full max-w-md">
        <h2 className="font-nocturne-display text-3xl leading-tight text-groove-bg md:text-4xl">{t.rsvpHeading}</h2>

        {sent ? (
          <p className="mt-6 font-groove-body text-sm text-groove-bg/90">{t.rsvpSuccess}</p>
        ) : (
          <form onSubmit={submit} className="mt-8 space-y-4 text-left">
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
                    className={`flex-1 py-2.5 border font-groove-label text-[0.65rem] tracking-wide uppercase transition-colors ${
                      form.attendance === opt.value
                        ? "border-groove-bg text-groove-bg"
                        : "border-groove-bg/25 text-groove-bg/50"
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
                rows={3}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={form.sendingGift}
                onChange={(e) => setForm({ ...form, sendingGift: e.target.checked })}
                className="h-3.5 w-3.5 accent-groove-bg"
              />
              <span className="font-groove-body text-xs text-groove-bg/70">{t.sendingGiftLabel}</span>
            </label>

            <button disabled={loading} className={solidButtonClass}>
              {loading ? t.sending : t.send}
            </button>
          </form>
        )}

        <div className="mt-14">
          <WishesSection invitationId={invitationId} lang={lang} initialWishes={initialWishes} />
        </div>
      </div>
    </section>
  );
}
