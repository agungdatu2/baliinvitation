export interface LoveStoryItem {
  title: string;
  story: string;
}

export interface EventItem {
  name: string; // "Resepsi", "Memadik / Akad", dll — bebas diisi admin
  date: string; // ISO date
  timeStart: string; // "15:00"
  timeEnd?: string; // "Selesai" jika kosong
  timezone?: string; // "WITA" | "WIB" | "WIT"
  venueName?: string; // nama venue singkat, mis. "The Garden Grille" — dipisah dari `location` (alamat lengkap)
  location: string;
  mapsUrl?: string;
}

export interface BankAccountItem {
  bank: string;
  accountNumber: string;
  accountName: string;
}

export interface DressCodeItem {
  label: string; // "Cream", "Taupe", dst
  hex: string; // "#fbf9f5"
}

// Bentuk data lengkap 1 undangan — dipakai form admin & semua komponen template
export interface InvitationData {
  id?: string;
  slug: string;
  status: "draft" | "published";
  language: "id" | "en";
  templateKey: string;

  clientName: string;
  clientPhone?: string;
  clientNotes?: string;

  groomNickname: string;
  groomFullName: string;
  groomParents: string;
  groomInstagram?: string;
  groomPhoto?: string;

  brideNickname: string;
  brideFullName: string;
  brideParents: string;
  brideInstagram?: string;
  bridePhoto?: string;

  coverImage?: string;
  quote?: string;
  greeting?: string;
  musicUrl?: string;
  livestreamUrl?: string;
  livestreamNote?: string;
  heroVideoUrl?: string;
  reverieGateImage?: string; // foto background layar gate — khusus tema Reverie

  eventDate: string; // ISO

  galleryImages: string[];
  loveStory: LoveStoryItem[];
  events: EventItem[];
  bankAccounts: BankAccountItem[];
  dressCode: DressCodeItem[];

  // Gating dari Package yang dipilih (lihat src/app/[slug]/page.tsx) — default
  // true/unlimited kalau undangan tidak punya package terkait.
  hasIntro: boolean;
  maxGalleryImages: number | null;
}

// Props standar yang wajib diterima SETIAP komponen template
// agar template baru tinggal "plug-and-play" tanpa ubah admin/API
export interface TemplateProps {
  data: InvitationData;
  guestName?: string; // dari Guest.name (?g=) atau fallback query string ?to=Nama Tamu
  guestId?: string; // dari Guest yang resolve dari ?g= — dipakai RSVPForm untuk link balik ke Guest
}
