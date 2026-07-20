// Daftar section per tema yang boleh disembunyikan client dari admin dashboard
// (fitur "hide widget") — dipakai bareng oleh InvitationForm (checkbox) dan
// tiap *Template.tsx (logic render) + NavMenu (filter link). Hero & footer
// sengaja TIDAK pernah masuk daftar karena keduanya struktural (selalu tampil).
export const HIDEABLE_SECTIONS_BY_TEMPLATE: Record<string, { key: string; label: string }[]> = {
  reverie: [
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
  ],
  lume: [
    { key: "couple", label: "Couple Profile" },
    { key: "loveStory", label: "Love Story" },
    { key: "events", label: "Jadwal Acara" },
    { key: "liveStreaming", label: "Live Streaming" },
    { key: "dressCode", label: "Dress Code" },
    { key: "rsvp", label: "RSVP & Ucapan" },
    { key: "gallery", label: "Gallery" },
    { key: "gift", label: "Wedding Gift" },
  ],
};
