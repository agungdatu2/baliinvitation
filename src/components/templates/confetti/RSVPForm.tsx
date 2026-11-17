"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getDict, Lang } from "@/lib/i18n/confetti";
import { Wave } from "./Decor";

interface WishItem {
  id: string;
  guestName: string;
  message?: string | null;
  createdAt: string;
}

const WISH_COLORS = ["bg-confetti-pink/40", "bg-confetti-blue/40", "bg-confetti-yellow/40", "bg-confetti-lavender/40"];

export default function RSVPForm({
  invitationId,
  guestName,
  guestId,
  lang,
}: {
  invitationId: string;
  guestName?: string;
  guestId?: string;
  lang?: Lang;
}) {
  const t = getDict(lang);
  const [form, setForm] = useState({ guestName: guestName ?? "", attendance: "hadir", guestCount: 1, message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [wishes, setWishes] = useState<WishItem[]>([]);

  const loadWishes = () => {
    fetch(`/api/rsvp?invitationId=${invitationId}`)
      .then((r) => r.json())
      .then((items: WishItem[]) => setWishes(Array.isArray(items) ? items.filter((w) => w.message?.trim()) : []))
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

  const field =
    "w-full rounded-2xl border-2 border-confetti-ink/15 bg-white px-4 py-3 font-groove-body text-sm text-confetti-ink placeholder:text-confetti-ink/40 focus:border-confetti-pink focus:outline-none";
  const label = "mb-1.5 block font-groove-label text-[0.7rem] uppercase tracking-widest text-confetti-ink/70";

  return (
    <div>
      <Wave from="#fff8ee" fill="#eaf5fd" />
      <section className="bg-[#eaf5fd] px-6 py-16 text-confetti-ink md:py-24">
        <div className="mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.9 }}
            className="text-center"
          >
            <h2 className="font-confetti-display text-4xl font-bold md:text-5xl">{t.rsvpHeading}</h2>
            <p className="mx-auto mt-3 max-w-md font-groove-body text-base text-confetti-ink/75">{t.rsvpSubtext}</p>
          </motion.div>

          <div className="mt-10 rounded-[2rem] border-4 border-white bg-white/70 p-6 shadow-lg md:p-10">
            {sent ? (
              <p className="text-center font-confetti-display text-xl font-medium">{t.rsvpSuccess}</p>
            ) : (
              <form onSubmit={submit} className="space-y-5 text-left">
                <div>
                  <label className={label}>{t.nameLabel}</label>
                  <input
                    required
                    placeholder={t.namePlaceholder}
                    className={field}
                    value={form.guestName}
                    onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  />
                </div>
                <div>
                  <label className={label}>{t.attendanceLabel}</label>
                  <div className="flex gap-3">
                    {[
                      { value: "hadir", label: t.attendYes },
                      { value: "tidak_hadir", label: t.attendNo },
                    ].map((opt) => (
                      <button
                        type="button"
                        key={opt.value}
                        onClick={() => setForm({ ...form, attendance: opt.value })}
                        className={`flex-1 rounded-full border-2 py-3 font-groove-label text-sm transition ${
                          form.attendance === opt.value
                            ? "border-confetti-ink bg-confetti-ink text-confetti-cream"
                            : "border-confetti-ink/20 bg-white text-confetti-ink/70"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className={label}>{t.guestCountLabel}</label>
                  <input
                    type="number"
                    min={1}
                    max={5}
                    className={field}
                    value={form.guestCount}
                    onChange={(e) => setForm({ ...form, guestCount: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className={label}>{t.wishesLabel}</label>
                  <textarea
                    className={field}
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </div>
                <button
                  disabled={loading}
                  className="w-full rounded-full bg-confetti-ink px-8 py-3.5 font-groove-label text-sm font-medium tracking-wide text-confetti-cream transition-transform hover:scale-[1.02] disabled:opacity-50"
                >
                  {loading ? t.sending : t.send}
                </button>
              </form>
            )}
          </div>

          {wishes.length > 0 && (
            <div className="mt-14">
              <h3 className="mb-5 text-center font-confetti-display text-2xl font-bold">{t.guestBookHeading}</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {wishes.map((w, i) => (
                  <div key={w.id} className={`rounded-3xl ${WISH_COLORS[i % WISH_COLORS.length]} p-5`}>
                    <p className="font-confetti-display text-lg font-semibold">{w.guestName}</p>
                    <p className="mt-1 font-groove-body text-sm leading-relaxed text-confetti-ink/80">{w.message}</p>
                    <p className="mt-3 font-groove-label text-[0.65rem] uppercase tracking-wide text-confetti-ink/50">
                      {new Date(w.createdAt).toLocaleDateString(t.dateLocale, { day: "2-digit", month: "short", year: "numeric" })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
