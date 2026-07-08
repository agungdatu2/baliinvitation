"use client";

import { BankAccountItem } from "@/types/invitation";

export default function WeddingGift({ accounts }: { accounts: BankAccountItem[] }) {
  if (!accounts?.length) return null;

  const copy = (text: string) => navigator.clipboard.writeText(text);

  return (
    <section className="px-6 py-14 max-w-md mx-auto text-center">
      <p className="text-xs uppercase tracking-widest text-lume-gold mb-2">Wedding Gift</p>
      <h2 className="font-serif text-2xl mb-6">Tanda Kasih</h2>
      <p className="text-sm text-gray-600 mb-8">
        Ucapan dan doa sudah sangat berarti, namun jika ingin memberi hadiah, dapat melalui rekening berikut.
      </p>
      <div className="space-y-4">
        {accounts.map((acc, i) => (
          <div key={i} className="border rounded-xl p-4 flex items-center justify-between">
            <div className="text-left">
              <p className="font-medium">{acc.bank}</p>
              <p className="text-sm text-gray-600">{acc.accountNumber}</p>
              <p className="text-xs text-gray-500">a.n. {acc.accountName}</p>
            </div>
            <button onClick={() => copy(acc.accountNumber)} className="text-xs text-lume-gold underline">
              Salin
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
