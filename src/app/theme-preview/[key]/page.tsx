import { notFound } from "next/navigation";
import { TEMPLATE_REGISTRY } from "@/components/templates/registry";
import { InvitationData } from "@/types/invitation";

export const dynamic = "force-dynamic";

// Preview tema tanpa undangan asli — dipakai tombol "Lihat" di admin/themes.
// Semua field foto/video/musik/galeri sengaja dikosongkan supaya tiap komponen
// jatuh ke placeholder bawaannya sendiri (picsum, DEFAULT_HERO_VIDEO_URL, dst).
export default function ThemePreviewPage({
  params,
  searchParams,
}: {
  params: { key: string };
  searchParams: { lang?: string; intro?: string };
}) {
  const Template = TEMPLATE_REGISTRY[params.key];
  if (!Template) return notFound();
  const language: "id" | "en" = searchParams.lang === "en" ? "en" : "id";
  // ?intro=0 lompat splash loading — mempercepat iterasi desain tanpa nunggu animasi tiap reload.
  const hasIntro = searchParams.intro !== "0";

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 60);
  const eventDateIso = eventDate.toISOString();
  // EventItem.date dikonsumsi sebagai tanggal-saja (digabung "T" + timeStart di
  // EventDetails), bukan datetime ISO lengkap — beda dari InvitationData.eventDate.
  const eventDateOnly = eventDateIso.slice(0, 10);

  const data: InvitationData = {
    slug: "preview",
    status: "published",
    language,
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
      {
        title: "Menjalin Kedekatan",
        story:
          "Perlahan kami saling mengenal lebih dalam, melewati suka duka, dan belajar untuk saling menguatkan satu sama lain.",
      },
      {
        title: "Melamar",
        story:
          "Di tempat yang penuh kenangan bagi kami berdua, ia berlutut dan bertanya apakah saya bersedia menghabiskan sisa hidup bersamanya.",
      },
      {
        title: "Menuju Pernikahan",
        story:
          "Kini kami bersiap merayakan babak baru dalam hidup kami, dan dengan penuh syukur mengundang Anda untuk turut merayakannya.",
      },
    ],
    events: [
      {
        name: "Resepsi",
        date: eventDateOnly,
        timeStart: "11:00",
        timeEnd: "13:00",
        location: "Bali, Indonesia",
      },
    ],
    bankAccounts: [],
    dressCode: [],
    hasIntro,
    maxGalleryImages: null,
  };

  return <Template data={data} guestName="Tamu Undangan" />;
}
