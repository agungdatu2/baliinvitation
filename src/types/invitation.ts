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
  location: string;
  mapsUrl?: string;
}

export interface BankAccountItem {
  bank: string;
  accountNumber: string;
  accountName: string;
}

// Bentuk data lengkap 1 undangan — dipakai form admin & semua komponen template
export interface InvitationData {
  id?: string;
  slug: string;
  status: "draft" | "published";
  templateKey: string;

  clientName: string;
  clientPhone?: string;
  clientNotes?: string;

  groomNickname: string;
  groomFullName: string;
  groomParents: string;
  groomInstagram?: string;

  brideNickname: string;
  brideFullName: string;
  brideParents: string;
  brideInstagram?: string;

  coverImage?: string;
  quote?: string;
  greeting?: string;
  musicUrl?: string;

  eventDate: string; // ISO

  galleryImages: string[];
  loveStory: LoveStoryItem[];
  events: EventItem[];
  bankAccounts: BankAccountItem[];
}

// Props standar yang wajib diterima SETIAP komponen template
// agar template baru tinggal "plug-and-play" tanpa ubah admin/API
export interface TemplateProps {
  data: InvitationData;
  guestName?: string; // dari Guest.name (?g=) atau fallback query string ?to=Nama Tamu
  guestId?: string; // dari Guest yang resolve dari ?g= — dipakai RSVPForm untuk link balik ke Guest
}
