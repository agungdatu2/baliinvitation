export type Lang = "id" | "en";

// Dictionary tema "Confetti" (ulang tahun anak). Tidak ada teks UI yang
// di-hardcode di komponen — semuanya lewat getDict().
export const CONFETTI_DICT = {
  id: {
    dateLocale: "id-ID",

    // Gate
    invitationLabel: "Kamu diundang ke pesta",
    dear: "Kepada Yth.",
    defaultGuestName: "Tamu Undangan",
    openInvitation: "Buka Undangan",

    // Hero
    birthdayTitle: "Ulang Tahun ke-{n}",
    birthdayTitleNoAge: "Ulang Tahun",
    defaultGreeting: "Dengan penuh syukur dan cinta, kami mengundang Anda untuk ikut merayakan hari bahagia si kecil.",

    // Details
    saveTheDate: "Simpan Tanggal",
    days: "Hari",
    hours: "Jam",
    minutes: "Menit",
    seconds: "Detik",
    when: "Kapan",
    where: "Di mana",
    at: "Pukul",
    openMaps: "Buka Maps",
    addToCalendar: "Tambah ke Kalender",

    // Gallery
    galleryHeading: "Momen Manis",
    clickForPreview: "Ketuk foto untuk memperbesar",
    photo: "Foto",
    previous: "Sebelumnya",
    next: "Selanjutnya",

    // RSVP
    rsvpHeading: "Konfirmasi Kehadiran",
    rsvpSubtext: "Beri tahu kami apakah Anda bisa hadir, dan tinggalkan ucapan manis untuk si kecil.",
    rsvpSuccess: "Terima kasih! Konfirmasi Anda sudah kami terima.",
    attendYes: "Hadir",
    attendNo: "Tidak Hadir",
    nameLabel: "Nama",
    namePlaceholder: "Nama Anda",
    attendanceLabel: "Kehadiran",
    guestCountLabel: "Jumlah Tamu (maks. 5)",
    wishesLabel: "Ucapan & Doa",
    sending: "Mengirim...",
    send: "Kirim",
    guestBookHeading: "Ucapan dari Tamu",

    // Closing
    thankYou: "Terima Kasih",
    withLove: "Dengan cinta,",
    closingText: "Kehadiran dan doa Anda adalah hadiah terindah di hari spesial ini.",
  },
  en: {
    dateLocale: "en-US",

    invitationLabel: "You're invited to the party",
    dear: "Dear",
    defaultGuestName: "Guest",
    openInvitation: "Open Invitation",

    birthdayTitle: "{n} Birthday",
    birthdayTitleNoAge: "Birthday",
    defaultGreeting: "With joy and love, we invite you to celebrate our little one's special day.",

    saveTheDate: "Save The Date",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    when: "When",
    where: "Where",
    at: "At",
    openMaps: "Open Maps",
    addToCalendar: "Add to Calendar",

    galleryHeading: "Sweet Moments",
    clickForPreview: "Tap a photo to enlarge",
    photo: "Photo",
    previous: "Previous",
    next: "Next",

    rsvpHeading: "RSVP",
    rsvpSubtext: "Let us know if you can make it, and leave a sweet wish for the little one.",
    rsvpSuccess: "Thank you! Your response has been received.",
    attendYes: "Attending",
    attendNo: "Not Attending",
    nameLabel: "Name",
    namePlaceholder: "Your Name",
    attendanceLabel: "Attendance",
    guestCountLabel: "Number of Guests (max 5)",
    wishesLabel: "Wishes",
    sending: "Sending...",
    send: "Send",
    guestBookHeading: "Wishes from Guests",

    thankYou: "Thank You",
    withLove: "With love,",
    closingText: "Your presence and prayers are the best gifts on this special day.",
  },
} satisfies Record<Lang, Record<string, string>>;

export function getDict(lang: Lang | undefined) {
  return CONFETTI_DICT[lang ?? "id"];
}

// 1 -> "1st", 2 -> "2nd", 11 -> "11th" (untuk judul bahasa Inggris).
function ordinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th"}`;
}

// Usia diambil dari angka pertama di judul acara (mis. "Ulang Tahun ke-1",
// "1st Birthday"). Belum ada field khusus usia di database.
export function parseAge(eventTitle?: string): number | null {
  const match = /\d+/.exec(eventTitle ?? "");
  return match ? parseInt(match[0], 10) : null;
}

export function birthdayTitle(lang: Lang | undefined, age: number | null) {
  const t = getDict(lang);
  if (age === null) return t.birthdayTitleNoAge;
  return t.birthdayTitle.replace("{n}", lang === "en" ? ordinal(age) : String(age));
}
