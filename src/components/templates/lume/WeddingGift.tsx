"use client";

import { useState } from "react";
import { Copy, Landmark } from "lucide-react";
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
    <section className="groove-overlay text-groove-bg py-16 px-6 text-center">
      <div className="max-w-md mx-auto">
        <p className="font-groove-label uppercase tracking-widest text-xs text-groove-primary mb-2">Tanda Kasih</p>
        <h2 className="font-groove-display italic text-2xl mb-6" style={{ fontWeight: 400 }}>
          Wedding Gift
        </h2>
        <p className="font-groove-body text-sm text-groove-bg/80 mb-8">
          Ucapan dan doa sudah sangat berarti, namun jika ingin memberi hadiah, dapat melalui rekening berikut.
        </p>
        <div className="space-y-3">
          {accounts.map((acc, i) => (
            <div key={i} className="border border-groove-line rounded-lg p-4 flex items-center justify-between text-left">
              <div className="flex items-start gap-3">
                <Landmark className="h-6 w-6 text-groove-primary shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="font-groove-label text-xs uppercase tracking-widest text-groove-primary">{acc.bank}</p>
                  <p className="font-groove-display text-lg mt-0.5 text-groove-bg" style={{ fontWeight: 600 }}>
                    {acc.accountNumber}
                  </p>
                  <p className="font-groove-body text-xs text-groove-bg/70">a.n. {acc.accountName}</p>
                </div>
              </div>
              <button
                onClick={() => copy(acc.accountNumber, i)}
                className={`font-groove-label shrink-0 flex items-center gap-1 text-xs uppercase tracking-wide ${
                  copiedIndex === i ? "text-groove-primary" : "text-groove-bg/75"
                }`}
              >
                <Copy className="h-3.5 w-3.5" /> {copiedIndex === i ? "Tersalin!" : "Salin"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
