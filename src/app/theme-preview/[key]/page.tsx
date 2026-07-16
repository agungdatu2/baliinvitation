import { notFound } from "next/navigation";
import { TEMPLATE_REGISTRY } from "@/components/templates/registry";
import { InvitationData } from "@/types/invitation";

export const dynamic = "force-dynamic";

// Preview tema tanpa undangan asli — dipakai tombol "Lihat" di admin/themes.
// Semua field foto/video/musik/galeri sengaja dikosongkan supaya tiap komponen
// jatuh ke placeholder bawaannya sendiri (picsum, DEFAULT_HERO_VIDEO_URL, dst).
export default function ThemePreviewPage({ params }: { params: { key: string } }) {
  const Template = TEMPLATE_REGISTRY[params.key];
  if (!Template) return notFound();

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 60);
  const eventDateIso = eventDate.toISOString();

  const data: InvitationData = {
    slug: "preview",
    status: "published",
    templateKey: params.key,
    clientName: "Preview",
    groomNickname: "Made",
    groomFullName: "I Made Wirawan",
    groomParents: "Bapak I Wayan Contoh & Ibu Ni Kadek Contoh",
    brideNickname: "Ayu",
    brideFullName: "Ni Ayu Kirana",
    brideParents: "Bapak I Nyoman Contoh & Ibu Ni Putu Contoh",
    quote: "Cinta yang tumbuh dari kesederhanaan, abadi dalam kebersamaan.",
    greeting:
      "Om Swastyastu, dengan penuh rasa syukur kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
    eventDate: eventDateIso,
    galleryImages: [],
    loveStory: [
      {
        title: "Awal Bertemu",
        story: "Kami dipertemukan dalam sebuah acara keluarga di Bali, dan sejak itu kisah kami dimulai.",
      },
    ],
    events: [
      {
        name: "Resepsi",
        date: eventDateIso,
        timeStart: "11:00",
        timeEnd: "13:00",
        location: "Bali, Indonesia",
      },
    ],
    bankAccounts: [],
    dressCode: [],
    hasIntro: true,
    maxGalleryImages: null,
  };

  return <Template data={data} guestName="Tamu Undangan" />;
}
