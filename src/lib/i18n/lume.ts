export type Lang = "id" | "en";

// "id" berisi teks yang SUDAH tayang di production hari ini (campuran ID/EN apa
// adanya) — sengaja tidak diubah supaya undangan lama/berbahasa default tidak
// berubah tampilannya. "en" adalah terjemahan penuh untuk mode bahasa Inggris.
export const LUME_DICT = {
  id: {
    dateLocale: "id-ID",

    // SplashGate / LoadingScreen
    weddingInvitationLabel: "Undangan Pernikahan",
    loadingLabel: "Memuat",
    theWeddingOf: "The Wedding of",
    dear: "Dear,",
    defaultGuestName: "Tamu Undangan",
    misspellingApology: "We apologize if there is any misspelling of name or title",
    letsOpen: "Let's Open",
    heroInviteLabel: "Kami mengundang Anda untuk merayakan",

    // HeroGreeting
    defaultGreeting: "Dengan penuh syukur, kami mengundang Anda untuk merayakan hari bahagia kami.",
    scroll: "Scroll",

    // PrayerSection
    prayerLabel: "Doa",
    defaultPrayerQuote:
      "“Kasih itu sabar, kasih itu murah hati. Ia tidak cemburu, ia tidak memegahkan diri dan tidak sombong. Kasih tidak berkesudahan.”",

    // CoupleProfile
    theGroom: "The Groom",
    theBride: "The Bride",
    sonOf: "Putra dari",
    daughterOf: "Putri dari",

    // LoveStory
    loveStoryPrefix: "A Journey In Love: The",
    loveStoryAnd: "and",
    loveStorySuffix: "Connection",
    loveStoryHeading: "Perjalanan Dua Jiwa dalam Cinta",

    // EventDetails
    at: "AT",
    eventTimeAtLabel: "Pukul",
    days: "Hari",
    hours: "Jam",
    minutes: "Menit",
    seconds: "Detik",
    googleMaps: "Google Maps",
    saveTheDate: "Save The Date",

    // LiveStreaming
    liveStreamingTitle: "Live Streaming",
    liveStreamingSubtitle: "Tak Bisa Hadir? Saksikan dari Rumah",
    watchLive: "Tonton Live",

    // DressCode
    dresscode: "Dresscode:",
    dresscodeNote: "Kami mengharapkan tamu undangan mengenakan warna-warna berikut untuk hari spesial kami",

    // RSVPForm
    attendYes: "Excited To Attend",
    attendNo: "Unable Attend",
    rsvpHeading: "Kindly Confirm Your Presence and Share Your Blessings",
    rsvpSubtext:
      "We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes.",
    rsvpSuccess: "Terima kasih! RSVP kamu sudah kami terima.",
    nameLabel: "Name",
    namePlaceholder: "Guest Name",
    attendanceLabel: "Attendance",
    guestCountLabel: "No of Guest (max 5)",
    wishesLabel: "Wishes",
    sending: "Sending...",
    send: "Send",

    // Gallery
    galleryHeading: "Our Pre-Wedding Celebration.",
    playVideo: "Putar video",
    photo: "Photo",
    previous: "Sebelumnya",
    next: "Selanjutnya",

    // NavMenu
    navHome: "Home",
    navProfile: "Profile",
    navLoveStory: "Love Story",
    navWeddingEvent: "Wedding Event",
    navRsvp: "RSVP",
    navWeddingGift: "Wedding Gift",
    navGallery: "Gallery",
    closeMenu: "Tutup menu",
    openMenu: "Buka menu",
    close: "Close",
    navHint: "Klik salah satu menu di atas untuk langsung menuju halaman yang dituju.",
    saveDateShort1: "Simpan",
    saveDateShort2: "Tanggal",
    pauseMusic: "Jeda musik",
    playMusic: "Putar musik",

    // WeddingGift
    weddingGiftHeading: "Wedding gift",
    weddingGiftDescription:
      "For those of you who want to give a token of love to the bride and groom, you can use the account number below:",
    clickHere: "Click Here",
    closeModal: "Tutup",
    copied: "Tersalin",
    copy: "Salin",

    // ClosingFooter
    thankYou: "Thank You",
    forYourAttendance: "For Your Attendance And Support",
    honorText: "It is a pleasure and honor for us, if you are willing to attend and give us your blessing.",
  },
  en: {
    dateLocale: "en-US",

    weddingInvitationLabel: "Wedding Invitation",
    loadingLabel: "Loading",
    theWeddingOf: "The Wedding of",
    dear: "Dear,",
    defaultGuestName: "Guest",
    misspellingApology: "We apologize if there is any misspelling of name or title",
    letsOpen: "Let's Open",
    heroInviteLabel: "We invite you to celebrate",

    defaultGreeting: "With heartfelt gratitude, we invite you to celebrate our special day with us.",
    scroll: "Scroll",

    prayerLabel: "Prayer",
    defaultPrayerQuote:
      "“Love is patient, love is kind. It does not envy, it does not boast, it is not proud. Love never fails.”",

    theGroom: "The Groom",
    theBride: "The Bride",
    sonOf: "Son of",
    daughterOf: "Daughter of",

    loveStoryPrefix: "A Journey In Love: The",
    loveStoryAnd: "and",
    loveStorySuffix: "Connection",
    loveStoryHeading: "The Journey of Two Souls in Love",

    at: "AT",
    eventTimeAtLabel: "At",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    googleMaps: "Google Maps",
    saveTheDate: "Save The Date",

    liveStreamingTitle: "Live Streaming",
    liveStreamingSubtitle: "Can't Make It? Watch From Home",
    watchLive: "Watch Live",

    dresscode: "Dress Code:",
    dresscodeNote: "We kindly request our guests to wear the following colors for our special day",

    attendYes: "Excited To Attend",
    attendNo: "Unable Attend",
    rsvpHeading: "Kindly Confirm Your Presence and Share Your Blessings",
    rsvpSubtext:
      "We kindly request your prompt response to confirm your attendance at our upcoming event. Alongside your RSVP, please take a moment to extend your warm regards and best wishes.",
    rsvpSuccess: "Thank you! Your RSVP has been received.",
    nameLabel: "Name",
    namePlaceholder: "Guest Name",
    attendanceLabel: "Attendance",
    guestCountLabel: "No of Guest (max 5)",
    wishesLabel: "Wishes",
    sending: "Sending...",
    send: "Send",

    galleryHeading: "Our Pre-Wedding Celebration.",
    playVideo: "Play video",
    photo: "Photo",
    previous: "Previous",
    next: "Next",

    navHome: "Home",
    navProfile: "Profile",
    navLoveStory: "Love Story",
    navWeddingEvent: "Wedding Event",
    navRsvp: "RSVP",
    navWeddingGift: "Wedding Gift",
    navGallery: "Gallery",
    closeMenu: "Close menu",
    openMenu: "Open menu",
    close: "Close",
    navHint: "Click any menu above to jump straight to that section.",
    saveDateShort1: "Save",
    saveDateShort2: "Date",
    pauseMusic: "Pause music",
    playMusic: "Play music",

    weddingGiftHeading: "Wedding Gift",
    weddingGiftDescription:
      "For those of you who want to give a token of love to the bride and groom, you can use the account number below:",
    clickHere: "Click Here",
    closeModal: "Close",
    copied: "Copied",
    copy: "Copy",

    thankYou: "Thank You",
    forYourAttendance: "For Your Attendance And Support",
    honorText: "It is a pleasure and honor for us, if you are willing to attend and give us your blessing.",
  },
} satisfies Record<Lang, Record<string, string>>;

export function getDict(lang: Lang | undefined) {
  return LUME_DICT[lang ?? "id"];
}
