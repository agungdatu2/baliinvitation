"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Copy, Check, X } from "lucide-react";
import { BankAccountItem } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";

export default function WeddingGift({
  accounts,
  image,
  lang,
}: {
  accounts: BankAccountItem[];
  image?: string;
  lang?: Lang;
}) {
  const t = getDict(lang);
  const [open, setOpen] = useState(false);
  if (!accounts?.length) return null;

  return (
    // relative + z-50 SENGAJA — lihat komentar sama di SaveTheDateSection.tsx
    // (Hero sticky tanpa z-index menang lawan elemen statis manapun).
    <section className="relative z-50 bg-black px-6 py-24 text-groove-bg md:py-32">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-10 text-center">
        <div className="max-w-md">
          <h2 className="font-nocturne-display italic text-4xl text-groove-bg md:text-5xl">{t.weddingGiftHeading}</h2>
          <p className="mx-auto mt-5 max-w-sm font-groove-body text-sm leading-relaxed text-groove-bg/70">
            {t.weddingGiftDescription}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="mt-8 inline-flex items-center gap-2 border-b border-groove-bg/60 pb-1 font-groove-label text-xs uppercase tracking-[0.2em] text-groove-bg/90 transition-colors hover:border-groove-bg hover:text-groove-bg"
          >
            {t.clickHere}
          </button>
        </div>

        {image && (
          <div className="aspect-[4/5] w-full max-w-sm overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={t.weddingGiftHeading} className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && <BankAccountsModal accounts={accounts} onClose={() => setOpen(false)} lang={lang} />}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}

function BankAccountsModal({
  accounts,
  onClose,
  lang,
}: {
  accounts: BankAccountItem[];
  onClose: () => void;
  lang?: Lang;
}) {
  const t = getDict(lang);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[9500] flex items-center justify-center px-6"
      style={{ backdropFilter: "blur(16px)", WebkitBackdropFilter: "blur(16px)" }}
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <motion.div
        className="relative w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 12 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-groove-bg/80 hover:text-groove-bg"
          aria-label={t.closeModal}
        >
          <X className="h-6 w-6" />
        </button>

        {accounts.map((acc, i) => (
          <div
            key={i}
            className="rounded-2xl p-6 text-groove-bg shadow-xl"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <p className="mb-6 font-groove-label text-xs uppercase tracking-[0.25em] text-groove-bg/70">{acc.bank}</p>
            <p className="mb-6 font-nocturne-display text-2xl tracking-widest text-groove-bg">{acc.accountNumber}</p>
            <div className="flex items-center justify-between">
              <p className="font-groove-body text-sm text-groove-bg/85">{acc.accountName}</p>
              <button
                onClick={() => copy(acc.accountNumber, i)}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-2 font-groove-label text-xs uppercase tracking-wide transition-colors hover:bg-white/20"
              >
                {copiedIndex === i ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> {t.copied}
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> {t.copy}
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}
