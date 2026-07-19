"use client";

import { useEffect, useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";

interface RSVPFormProps {
  invitationId: string;
  guestName?: string;
  guestId?: string;
  lang?: Lang;
}

interface WishItem {
  id: string;
  guestName: string;
  message?: string | null;
  createdAt: string;
}

// Section RSVP — TANPA foto background sendiri (sama pola dengan LoveStory/
// EventDetails/SaveTheDateSection), transparan supaya FixedVideoBackground yang
// sudah nge-blur (.groove-page-blur) tetap kelihatan di belakangnya. Form
// dua-langkah: Step 1 (nama, kehadiran, jumlah tamu) -> tombol NEXT -> Step 2
// (ucapan + kirim).
export default function RSVPForm({ invitationId, guestName, guestId, lang }: RSVPFormProps) {
  const t = getDict(lang);
  const ATTEND_OPTIONS = [
    { value: "hadir", label: t.attendYes },
    { value: "tidak_hadir", label: t.attendNo },
  ];
  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ guestName: guestName ?? "", attendance: "hadir", guestCount: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  const loadWishes = () => {
    fetch(`/api/rsvp?invitationId=${invitationId}`)
      .then((r) => r.json())
      .then((data: WishItem[]) => setWishes(Array.isArray(data) ? data.filter((w) => w.message?.trim()) : []))
      .catch(() => {});
  };

  useEffect(() => {
    loadWishes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [invitationId]);

  const goNext = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

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
    loadWishes();
  };

  const fieldClass =
    "w-full border border-groove-bg/40 bg-transparent px-4 py-3 text-sm text-groove-bg placeholder:text-groove-bg/50 focus:outline-none focus:border-groove-bg transition-colors";
  const labelClass = "font-groove-label block text-[0.68rem] uppercase tracking-widest text-groove-bg/80 mb-2";
  const solidButtonClass =
    "w-full py-3.5 bg-groove-stone text-groove-bg text-xs tracking-[0.25em] uppercase disabled:opacity-50 transition hover:bg-groove-stone/85";

  return (
    <section className="relative min-h-[100svh] flex flex-col justify-center text-groove-bg px-6 py-20">
      <div className="max-w-md">
        <h2 className="font-reverie-display text-3xl md:text-4xl leading-tight mb-5" style={{ fontWeight: 400 }}>
          {t.rsvpHeading}
        </h2>
        <p className="font-groove-body text-sm text-groove-bg/80 leading-relaxed mb-10">{t.rsvpSubtext}</p>

        {sent ? (
          <p className="font-groove-body text-sm text-groove-bg/90">{t.rsvpSuccess}</p>
        ) : step === 1 ? (
          <form onSubmit={goNext} className="space-y-6 text-left">
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
              <div className="flex gap-3">
                {ATTEND_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    onClick={() => setForm({ ...form, attendance: opt.value })}
                    className={`flex-1 py-3 border text-xs tracking-wide uppercase transition ${
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
              <label className={labelClass}>{t.guestCountLabel}</label>
              <input
                type="number"
                min={1}
                max={5}
                className={fieldClass}
                value={form.guestCount}
                onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
              />
            </div>

            <button className={solidButtonClass}>{t.rsvpNext}</button>
          </form>
        ) : (
          <form onSubmit={submit} className="space-y-6 text-left">
            <div>
              <label className={labelClass}>{t.wishesLabel}</label>
              <textarea
                className={fieldClass}
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3.5 border border-groove-bg/40 text-groove-bg text-xs tracking-[0.25em] uppercase transition hover:border-groove-bg"
              >
                {t.rsvpBack}
              </button>
              <button disabled={loading} className={`flex-1 ${solidButtonClass}`}>
                {loading ? t.sending : t.send}
              </button>
            </div>
          </form>
        )}

        {wishes.length > 0 && (
          <div className="grid sm:grid-cols-2 gap-4 mt-14">
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
        )}
      </div>
    </section>
  );
}
