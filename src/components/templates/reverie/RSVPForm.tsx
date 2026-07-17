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

export default function RSVPForm({ invitationId, guestName, guestId, lang }: RSVPFormProps) {
  const t = getDict(lang);
  const ATTEND_OPTIONS = [
    { value: "hadir", label: t.attendYes },
    { value: "tidak_hadir", label: t.attendNo },
  ];
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
    "w-full border border-groove-line-dark bg-transparent px-4 py-2.5 text-sm text-groove-bg placeholder:text-groove-bg/40 focus:outline-none focus:border-groove-primary-light transition-colors";

  return (
    <section className="groove-overlay-dark text-groove-bg py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 mb-14">
          <div>
            <h2 className="font-groove-display text-3xl md:text-4xl leading-tight mb-5" style={{ fontWeight: 500 }}>
              {t.rsvpHeading}
            </h2>
            <p className="font-groove-body text-sm text-groove-bg/70 leading-relaxed max-w-sm">{t.rsvpSubtext}</p>
          </div>

          {sent ? (
            <p className="font-groove-body text-sm text-groove-bg/80">{t.rsvpSuccess}</p>
          ) : (
            <form onSubmit={submit} className="space-y-5 text-left">
              <div>
                <label className="font-groove-label block text-[0.68rem] uppercase tracking-widest text-groove-bg/70 mb-1.5">
                  {t.nameLabel}
                </label>
                <input
                  required
                  placeholder={t.namePlaceholder}
                  className={fieldClass}
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                />
              </div>

              <div>
                <label className="font-groove-label block text-[0.68rem] uppercase tracking-widest text-groove-bg/70 mb-2">
                  {t.attendanceLabel}
                </label>
                <div className="flex gap-3">
                  {ATTEND_OPTIONS.map((opt) => (
                    <button
                      type="button"
                      key={opt.value}
                      onClick={() => setForm({ ...form, attendance: opt.value })}
                      className={`flex-1 py-2.5 border text-xs tracking-wide uppercase transition ${
                        form.attendance === opt.value
                          ? "border-groove-bg text-groove-bg"
                          : "border-groove-line-dark text-groove-bg/60"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-groove-label block text-[0.68rem] uppercase tracking-widest text-groove-bg/70 mb-1.5">
                  {t.guestCountLabel}
                </label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  className={fieldClass}
                  value={form.guestCount}
                  onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                />
              </div>

              <div>
                <label className="font-groove-label block text-[0.68rem] uppercase tracking-widest text-groove-bg/70 mb-1.5">
                  {t.wishesLabel}
                </label>
                <textarea
                  className={fieldClass}
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              <button
                disabled={loading}
                className="px-8 py-2.5 bg-groove-bg text-groove-stone text-xs tracking-widest uppercase disabled:opacity-50"
              >
                {loading ? t.sending : t.send}
              </button>
            </form>
          )}
        </div>

        {wishes.length > 0 && (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {wishes.map((w) => (
              <div key={w.id} className="border border-groove-line-dark p-5 bg-groove-stone/30">
                <p className="font-groove-body text-sm text-groove-bg mb-1" style={{ fontWeight: 600 }}>
                  {w.guestName}
                </p>
                <p className="font-groove-body text-sm text-groove-bg/75 leading-relaxed mb-4">{w.message}</p>
                <p className="font-groove-label text-[0.65rem] uppercase tracking-wide text-groove-bg/50">
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
