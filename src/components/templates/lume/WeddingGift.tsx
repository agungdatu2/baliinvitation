"use client";

import { useState } from "react";
import { BankAccountItem } from "@/types/invitation";

export default function WeddingGift({ accounts }: { accounts: BankAccountItem[] }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  if (!accounts?.length) return null;

  const copy = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1400);
  };

  return (
    <section className="px-6 py-20 max-w-md mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-groove-moss mb-2">Tanda Kasih</p>
      <h2 className="font-groove-display italic text-2xl mb-6" style={{ fontWeight: 500 }}>
        Wedding Gift
      </h2>
      <p className="text-sm text-groove-ink/70 mb-8">
        Ucapan dan doa sudah sangat berarti, namun jika ingin memberi hadiah, dapat melalui rekening berikut.
      </p>
      <div className="space-y-3">
        {accounts.map((acc, i) => (
          <div key={i} className="border border-groove-line rounded-sm p-4 flex items-center justify-between">
            <div className="text-left">
              <p className="text-xs uppercase tracking-widest text-groove-moss">{acc.bank}</p>
              <p className="font-groove-display text-lg mt-0.5" style={{ fontWeight: 600 }}>
                {acc.accountNumber}
              </p>
              <p className="text-xs text-groove-ink/60">a.n. {acc.accountName}</p>
            </div>
            <button
              onClick={() => copy(acc.accountNumber, i)}
              className={`text-xs uppercase tracking-wide border-b ${
                copiedIndex === i ? "text-groove-moss border-groove-moss" : "text-groove-clay border-groove-clay"
              }`}
            >
              {copiedIndex === i ? "Tersalin!" : "Salin"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
