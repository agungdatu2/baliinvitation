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
    <section className="groove-overlay text-groove-bg">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-6 py-16">
        {image && (
          <div className="w-full aspect-[4/5] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt={t.weddingGiftHeading} className="w-full h-full object-cover" />
          </div>
        )}

        <div className={image ? "" : "md:col-span-2 max-w-md"}>
          <h2 className="font-reverie-display italic text-4xl md:text-5xl mb-5" style={{ fontWeight: 400 }}>
            {t.weddingGiftHeading}
          </h2>
          <p className="font-groove-body text-sm text-groove-bg/80 leading-relaxed mb-6 max-w-sm">
            {t.weddingGiftDescription}
          </p>
          <button
            onClick={() => setOpen(true)}
            className="font-groove-label inline-block px-8 py-2.5 rounded-full border border-groove-line-dark text-xs tracking-widest uppercase hover:bg-groove-bg hover:text-groove-stone transition"
          >
            {t.clickHere}
          </button>
        </div>
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
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
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
              background: "rgba(255,255,255,0.1)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          >
            <p className="font-groove-label text-xs uppercase tracking-[0.25em] text-groove-bg/70 mb-6">{acc.bank}</p>
            <p className="font-reverie-display text-2xl tracking-widest mb-6" style={{ fontWeight: 600 }}>
              {acc.accountNumber}
            </p>
            <div className="flex items-center justify-between">
              <p className="font-groove-body text-sm text-groove-bg/85">{acc.accountName}</p>
              <button
                onClick={() => copy(acc.accountNumber, i)}
                className="font-groove-label inline-flex items-center gap-1.5 text-xs uppercase tracking-wide bg-groove-bg/15 border border-groove-line-dark rounded-full px-4 py-2 hover:bg-groove-bg/25 transition"
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
