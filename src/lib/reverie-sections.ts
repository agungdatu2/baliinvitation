// Daftar section tema Reverie yang boleh disembunyikan client dari admin dashboard
// (fitur "hide widget") — dipakai bareng oleh InvitationForm (checkbox) dan
// ReverieTemplate (logic render). Hero & footer sengaja TIDAK ada di sini karena
// keduanya struktural (selalu tampil).
export const REVERIE_SECTION_KEYS = [
  { key: "prayer", label: "Doa" },
  { key: "couple", label: "Groom & Bride" },
  { key: "saveTheDate", label: "Save the Date" },
  { key: "loveStory", label: "Love Story" },
  { key: "events", label: "Jadwal Acara" },
  { key: "liveStreaming", label: "Live Streaming" },
  { key: "dressCode", label: "Dress Code" },
  { key: "rsvp", label: "RSVP & Ucapan" },
  { key: "gallery", label: "Gallery" },
  { key: "gift", label: "Wedding Gift" },
] as const;

export type ReverieSectionKey = (typeof REVERIE_SECTION_KEYS)[number]["key"];
