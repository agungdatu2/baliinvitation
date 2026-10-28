"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Copy, MessageCircle, Printer } from "lucide-react";
import { formatRupiah } from "@/lib/utils/format";
import { BALI_TZ, toBaliDate } from "@/lib/utils/timezone";
import { buildWaLink } from "@/lib/utils/whatsapp";
import { INVOICE_ISSUER, InvoiceData, InvoiceStatus } from "@/lib/invoice";

const PAYMENT_INFO_KEY = "baliinvitation.invoice.paymentInfo";
const DUE_DAYS = 7;

const STATUS_STAMP: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: "LUNAS", className: "border-green-600 text-green-700" },
  partial: { label: "DIBAYAR SEBAGIAN", className: "border-amber-600 text-amber-700" },
  unpaid: { label: "BELUM LUNAS", className: "border-red-600 text-red-700" },
  none: { label: "TANPA TAGIHAN", className: "border-gray-400 text-gray-500" },
};

// "2026-10-18" -> tanggal Indonesia, dibaca sebagai tanggal Bali (bukan zona browser).
function formatDay(value: string) {
  if (!value) return "-";
  return new Date(`${value}T12:00:00+08:00`).toLocaleDateString("id-ID", {
    timeZone: BALI_TZ,
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function addDays(value: string, days: number) {
  return toBaliDate(new Date(new Date(`${value}T12:00:00+08:00`).getTime() + days * 86400000));
}

export default function InvoiceView({
  invoice,
  client,
  event,
}: {
  invoice: InvoiceData;
  client: { name: string; phone: string };
  event: { title: string; dateLabel: string };
}) {
  // Tanggal "hari ini" dihitung di browser (setelah mount) supaya tidak beda dengan server (UTC).
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentInfo, setPaymentInfo] = useState("");
  const [showPayments, setShowPayments] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const today = toBaliDate(new Date());
    setIssueDate(today);
    setDueDate(addDays(today, DUE_DAYS));
    try {
      setPaymentInfo(localStorage.getItem(PAYMENT_INFO_KEY) ?? "");
    } catch {
      /* localStorage bisa diblokir — abaikan */
    }
  }, []);

  const updatePaymentInfo = (value: string) => {
    setPaymentInfo(value);
    try {
      localStorage.setItem(PAYMENT_INFO_KEY, value);
    } catch {
      /* abaikan */
    }
  };

  const stamp = STATUS_STAMP[invoice.status];

  const waMessage = useMemo(() => {
    const lines = [
      `Halo ${client.name}, berikut invoice ${invoice.number} untuk undangan digital ${event.title}.`,
      "",
      `Total tagihan: ${formatRupiah(invoice.total)}`,
      `Sudah dibayar: ${formatRupiah(invoice.paid)}`,
      `Sisa tagihan: ${formatRupiah(invoice.balance)}`,
    ];
    if (invoice.balance > 0 && dueDate) lines.push(`Jatuh tempo: ${formatDay(dueDate)}`);
    if (invoice.balance > 0 && paymentInfo.trim()) lines.push("", "Pembayaran:", paymentInfo.trim());
    lines.push("", "Terima kasih.", `${INVOICE_ISSUER.name} - ${INVOICE_ISSUER.website}`);
    return lines.join("\n");
  }, [client.name, event.title, invoice, dueDate, paymentInfo]);

  const copyWa = async () => {
    try {
      await navigator.clipboard.writeText(waMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      <style>{`@media print { @page { size: A4; margin: 14mm; } body { background: #fff !important; } }`}</style>

      {/* Panel kontrol — tidak ikut tercetak */}
      <div className="space-y-4 rounded-xl border border-lume-line bg-white p-4 shadow-sm print:hidden">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="block text-sm">
            <span className="text-gray-700">Tanggal terbit</span>
            <input type="date" className="input" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} />
          </label>
          <label className="block text-sm">
            <span className="text-gray-700">Jatuh tempo</span>
            <input type="date" className="input" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </label>
          <label className="block text-sm md:col-span-2">
            <span className="text-gray-700">Catatan (opsional)</span>
            <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="mis. DP 50% di awal, pelunasan sebelum acara" />
          </label>
        </div>
        <label className="block text-sm">
          <span className="text-gray-700">Instruksi pembayaran (rekening dll, diingat di browser ini)</span>
          <textarea
            className="input"
            rows={3}
            value={paymentInfo}
            onChange={(e) => updatePaymentInfo(e.target.value)}
            placeholder={"BCA 1234567890 a.n. Nama Pemilik\nAtau via QRIS"}
          />
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-700">
          <input type="checkbox" className="h-4 w-4" checked={showPayments} onChange={(e) => setShowPayments(e.target.checked)} />
          Tampilkan riwayat pembayaran di invoice
        </label>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 rounded-lg bg-lume-ink px-4 py-2 text-sm text-white hover:opacity-90"
          >
            <Printer size={15} /> Cetak / Simpan PDF
          </button>
          <button
            type="button"
            onClick={copyWa}
            className="inline-flex items-center gap-1.5 rounded-lg border border-lume-line px-4 py-2 text-sm hover:bg-lume-bg/60"
          >
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? "Tersalin" : "Salin teks WhatsApp"}
          </button>
          {client.phone && (
            <a
              href={buildWaLink(client.phone, waMessage)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-lume-line px-4 py-2 text-sm hover:bg-lume-bg/60"
            >
              <MessageCircle size={15} /> Kirim via WhatsApp
            </a>
          )}
        </div>
        <p className="text-xs text-gray-500">
          Di jendela cetak pilih &quot;Save as PDF&quot; untuk menyimpan sebagai PDF.
        </p>
      </div>

      {/* Lembar invoice */}
      <article className="mx-auto max-w-[820px] rounded-xl border border-lume-line bg-white p-8 text-[#1c1c1c] shadow-sm md:p-12 print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
        <header className="flex flex-wrap items-start justify-between gap-6">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/brand/logo.webp" alt={INVOICE_ISSUER.name} className="h-12 w-auto" />
            <div className="mt-3 space-y-0.5 text-xs text-gray-500">
              <p>{INVOICE_ISSUER.tagline} · {INVOICE_ISSUER.location}</p>
              <p>{INVOICE_ISSUER.website}</p>
              <p>WhatsApp {INVOICE_ISSUER.whatsapp} · {INVOICE_ISSUER.instagram}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="font-serif text-4xl tracking-wide">INVOICE</h1>
            <p className="mt-1 text-sm tabular-nums text-gray-600">{invoice.number}</p>
            <span className={`mt-3 inline-block rounded border-2 px-3 py-1 text-xs font-semibold tracking-widest ${stamp.className}`}>
              {stamp.label}
            </span>
          </div>
        </header>

        <section className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-400">Ditagihkan kepada</p>
            <p className="mt-1 text-base font-medium">{client.name}</p>
            {client.phone && <p className="text-gray-600">{client.phone}</p>}
          </div>
          <div className="space-y-1 sm:text-right">
            <p>
              <span className="text-gray-400">Tanggal terbit: </span>
              {formatDay(issueDate)}
            </p>
            {invoice.balance > 0 && (
              <p>
                <span className="text-gray-400">Jatuh tempo: </span>
                {formatDay(dueDate)}
              </p>
            )}
            <p>
              <span className="text-gray-400">Acara: </span>
              {event.title}
            </p>
            <p className="text-gray-600">{event.dateLabel}</p>
          </div>
        </section>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-[#1c1c1c] text-left text-xs uppercase tracking-widest text-gray-500">
              <th className="w-10 py-2 font-medium">No</th>
              <th className="py-2 font-medium">Deskripsi</th>
              <th className="w-12 py-2 text-center font-medium">Qty</th>
              <th className="w-32 py-2 text-right font-medium">Harga</th>
              <th className="w-32 py-2 text-right font-medium">Jumlah</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {invoice.items.map((item, i) => (
              <tr key={i}>
                <td className="py-3 align-top text-gray-500">{i + 1}</td>
                <td className="py-3">
                  <p>{item.description}</p>
                  {item.detail && <p className="text-xs text-gray-500">{item.detail}</p>}
                </td>
                <td className="py-3 text-center tabular-nums">{item.qty}</td>
                <td className="py-3 text-right tabular-nums">{formatRupiah(item.price)}</td>
                <td className="py-3 text-right tabular-nums">{formatRupiah(item.qty * item.price)}</td>
              </tr>
            ))}
            {invoice.adjustment !== 0 && (
              <tr>
                <td className="py-3 align-top text-gray-500">{invoice.items.length + 1}</td>
                <td className="py-3">Penyesuaian harga</td>
                <td className="py-3 text-center">1</td>
                <td className="py-3 text-right tabular-nums">{formatRupiah(invoice.adjustment)}</td>
                <td className="py-3 text-right tabular-nums">{formatRupiah(invoice.adjustment)}</td>
              </tr>
            )}
            {invoice.items.length === 0 && invoice.adjustment === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-gray-400">
                  Belum ada rincian tagihan (undangan ini belum punya paket atau add-on).
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Total tagihan</span>
            <span className="tabular-nums">{formatRupiah(invoice.total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Sudah dibayar</span>
            <span className="tabular-nums">- {formatRupiah(invoice.paid)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-[#1c1c1c] pt-2 text-base font-semibold">
            <span>Sisa tagihan</span>
            <span className="tabular-nums">{formatRupiah(invoice.balance)}</span>
          </div>
        </div>

        {showPayments && invoice.payments.length > 0 && (
          <section className="mt-10">
            <p className="text-xs uppercase tracking-widest text-gray-400">Riwayat pembayaran</p>
            <table className="mt-2 w-full text-sm">
              <tbody className="divide-y divide-gray-200">
                {invoice.payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2 tabular-nums text-gray-600">{formatDay(toBaliDate(new Date(p.paidAt)))}</td>
                    <td className="py-2 text-gray-500">{p.note || "Pembayaran"}</td>
                    <td className="py-2 text-right tabular-nums">{formatRupiah(p.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {(paymentInfo.trim() || notes.trim()) && (
          <section className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
            {paymentInfo.trim() && invoice.balance > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Instruksi pembayaran</p>
                <p className="mt-1 whitespace-pre-line">{paymentInfo.trim()}</p>
              </div>
            )}
            {notes.trim() && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-400">Catatan</p>
                <p className="mt-1 whitespace-pre-line">{notes.trim()}</p>
              </div>
            )}
          </section>
        )}

        <footer className="mt-12 border-t border-gray-200 pt-4 text-center text-xs text-gray-400">
          Terima kasih telah mempercayakan undangan digital Anda kepada {INVOICE_ISSUER.name}.
        </footer>
      </article>
    </div>
  );
}
