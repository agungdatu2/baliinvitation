import { ADDON_PRICES, AddonFlags } from "@/lib/addons";
import { toBaliDate } from "@/lib/utils/timezone";

// Identitas penerbit invoice. Nomor rekening sengaja TIDAK di-hardcode di sini —
// diisi admin sekali di halaman invoice (tersimpan di browser) sebagai
// "Instruksi pembayaran".
export const INVOICE_ISSUER = {
  name: "BaliInvitation",
  tagline: "Undangan Digital",
  website: "www.baliinvitation.com",
  whatsapp: "+62 851-9009-0902",
  instagram: "@baliinvitation",
  location: "Bali, Indonesia",
};

export interface InvoiceItem {
  description: string;
  detail?: string;
  qty: number;
  price: number;
}

export type InvoiceStatus = "paid" | "partial" | "unpaid" | "none";

export interface InvoiceSource {
  id: string;
  createdAt: Date;
  isAddon: boolean;
  coverVideoAddon: boolean;
  extraGalleryAddon: boolean;
  bilingualEnabled: boolean;
  neverExpires: boolean;
  totalPrice: number | null;
  package: { name: string; price: number } | null;
  templateName: string;
  payments: { id: string; amount: number; paidAt: Date; note: string | null }[];
}

export interface InvoiceData {
  number: string;
  items: InvoiceItem[];
  itemsTotal: number;
  adjustment: number;
  total: number;
  paid: number;
  balance: number;
  status: InvoiceStatus;
  payments: { id: string; amount: number; paidAt: string; note: string | null }[];
}

const ADDON_LABELS: { key: keyof AddonFlags; label: string; price: number }[] = [
  { key: "isAddon", label: "Tambahan sesi acara / 2 link jadwal berbeda", price: ADDON_PRICES.eventSession },
  { key: "coverVideoAddon", label: "Ubah cover asli jadi video", price: ADDON_PRICES.coverVideo },
  { key: "extraGalleryAddon", label: "Tambah kuota galeri foto", price: ADDON_PRICES.galleryQuota },
  { key: "bilingualEnabled", label: "Undangan multi-bahasa (ID/EN)", price: ADDON_PRICES.bilingual },
  { key: "neverExpires", label: "Link aktif seumur hidup", price: ADDON_PRICES.lifetime },
];

// Nomor invoice stabil (tidak perlu tabel baru): tanggal undangan dibuat (WITA) + 4 karakter id.
export function invoiceNumber(id: string, createdAt: Date) {
  return `INV-${toBaliDate(createdAt).replace(/-/g, "")}-${id.slice(-4).toUpperCase()}`;
}

export function getPaymentState(total: number, paid: number): InvoiceStatus {
  if (total <= 0) return "none";
  if (paid >= total) return "paid";
  return paid > 0 ? "partial" : "unpaid";
}

// Susun invoice dari data undangan. Total SELALU = Invitation.totalPrice (yang juga
// dipakai tab Income/Outstanding); kalau rincian paket+add-on tidak persis sama
// (mis. undangan lama), selisihnya muncul sebagai baris "Penyesuaian".
export function buildInvoice(src: InvoiceSource): InvoiceData {
  const items: InvoiceItem[] = [];
  if (src.package && !src.isAddon) {
    items.push({ description: `Paket ${src.package.name}`, detail: `Tema ${src.templateName}`, qty: 1, price: src.package.price });
  }
  for (const a of ADDON_LABELS) {
    if (src[a.key as keyof InvoiceSource] === true) items.push({ description: a.label, qty: 1, price: a.price });
  }

  const itemsTotal = items.reduce((sum, it) => sum + it.qty * it.price, 0);
  const total = src.totalPrice ?? itemsTotal;
  const paid = src.payments.reduce((sum, p) => sum + p.amount, 0);

  return {
    number: invoiceNumber(src.id, src.createdAt),
    items,
    itemsTotal,
    adjustment: total - itemsTotal,
    total,
    paid,
    balance: Math.max(0, total - paid),
    status: getPaymentState(total, paid),
    payments: [...src.payments]
      .sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime())
      .map((p) => ({ id: p.id, amount: p.amount, paidAt: p.paidAt.toISOString(), note: p.note })),
  };
}
