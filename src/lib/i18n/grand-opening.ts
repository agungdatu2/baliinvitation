export type Lang = "id" | "en";

export const GRAND_OPENING_DICT = {
  id: {
    dateLocale: "id-ID",

    // Loading / Gate
    invitationLabel: "Undangan",
    dear: "Kpd Bpk/Ibu/Saudara/i",
    defaultGuestName: "Tamu Undangan",
    misspellingApology: "Mohon maaf apabila ada kesalahan penulisan nama",
    openInvitation: "Buka Undangan",

    // Event info
    at: "Pukul",
    days: "Hari",
    hours: "Jam",
    minutes: "Menit",
    seconds: "Detik",
    googleMaps: "Petunjuk Arah",
    saveTheDate: "Simpan Tanggal",

    // RSVP & Buku Tamu
    rsvpHeading: "Konfirmasi Kehadiran",
    rsvpSubtext: "Mohon konfirmasi kehadiran Anda dan sampaikan ucapan/doa untuk kami.",
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
    guestBookHeading: "Buku Tamu",

    // Closing
    thankYou: "Terima Kasih",
    honorText: "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir.",
    closingBlessing: "Om Shanti, Shanti, Shanti Om",
  },
  en: {
    dateLocale: "en-US",

    invitationLabel: "Invitation",
    dear: "To Mr/Mrs/Ms",
    defaultGuestName: "Guest",
    misspellingApology: "We apologize for any misspelling of name or title",
    openInvitation: "Open Invitation",

    at: "At",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    googleMaps: "Directions",
    saveTheDate: "Save The Date",

    rsvpHeading: "Confirm Your Attendance",
    rsvpSubtext: "Please confirm your attendance and leave us a message.",
    rsvpSuccess: "Thank you! Your confirmation has been received.",
    attendYes: "Attending",
    attendNo: "Not Attending",
    nameLabel: "Name",
    namePlaceholder: "Your Name",
    attendanceLabel: "Attendance",
    guestCountLabel: "Number of Guests (max 5)",
    wishesLabel: "Message",
    sending: "Sending...",
    send: "Send",
    guestBookHeading: "Guest Book",

    thankYou: "Thank You",
    honorText: "It would be our honor and pleasure to have you join us.",
    closingBlessing: "Om Shanti, Shanti, Shanti Om",
  },
} satisfies Record<Lang, Record<string, string>>;

export function getDict(lang: Lang | undefined) {
  return GRAND_OPENING_DICT[lang ?? "id"];
}
