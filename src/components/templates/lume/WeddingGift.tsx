"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import { BankAccountItem } from "@/types/invitation";

export default function WeddingGift({ accounts, image }: { accounts: BankAccountItem[]; image?: string }) {
  const [open, setOpen] = useState(false);
  if (!accounts?.length) return null;

  return (
    <section className="groove-overlay text-groove-bg">
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center px-6 py-16">
        {image && (
          <div className="w-full aspect-[4/5] overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} alt="Wedding gift" className="w-full h-full object-cover" />
          </div>
        )}

        <div className={image ? "" : "md:col-span-2 max-w-md"}>
          <h2 className="font-groove-display italic text-4xl md:text-5xl mb-5" style={{ fontWeight: 400 }}>
            Wedding gift
          </h2>
          <p className="font-groove-body text-sm text-groove-bg/80 leading-relaxed mb-6 max-w-sm">
            For those of you who want to give a token of love to the bride and groom, you can use the account number
            below:
          </p>
          <button
            onClick={() => setOpen(true)}
            className="font-groove-label inline-block px-8 py-2.5 rounded-full border border-groove-line-dark text-xs tracking-widest uppercase hover:bg-groove-bg hover:text-groove-stone transition"
          >
            Click Here
          </button>
        </div>
      </div>

      {open && <BankAccountsModal accounts={accounts} onClose={() => setOpen(false)} />}
    </section>
  );
}

function BankAccountsModal({ accounts, onClose }: { accounts: BankAccountItem[]; onClose: () => void }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 animate-fadeIn" onClick={onClose}>
      <div className="relative w-full max-w-sm space-y-4" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-groove-bg/80 hover:text-groove-bg"
          aria-label="Tutup"
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
            <p className="font-groove-display text-2xl tracking-widest mb-6" style={{ fontWeight: 600 }}>
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
                    <Check className="h-3.5 w-3.5" /> Tersalin
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" /> Salin
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
