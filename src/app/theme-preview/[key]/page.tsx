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
  searchParams: { lang?: string; intro?: string; hidden?: string };
}) {
  const Template = TEMPLATE_REGISTRY[params.key];
  if (!Template) return notFound();
  // Reverie preview default ke Inggris (bisa override manual via ?lang=id); tema
  // lain tetap default Indonesia seperti semula.
  const defaultLanguage: "id" | "en" = params.key === "reverie" ? "en" : "id";
  const language: "id" | "en" =
    searchParams.lang === "en" ? "en" : searchParams.lang === "id" ? "id" : defaultLanguage;
  // ?intro=0 lompat splash loading — mempercepat iterasi desain tanpa nunggu animasi tiap reload.
  const hasIntro = searchParams.intro !== "0";
  // ?hidden=gift,dressCode — test-only, buat coba fitur "hide section" (lihat
  // REVERIE_SECTION_KEYS) tanpa perlu bikin undangan asli.
  const hiddenSections = searchParams.hidden ? searchParams.hidden.split(",") : [];

  const eventDate = new Date();
  eventDate.setDate(eventDate.getDate() + 60);
  const eventDateIso = eventDate.toISOString();
  // EventItem.date dikonsumsi sebagai tanggal-saja (digabung "T" + timeStart di
  // EventDetails), bukan datetime ISO lengkap — beda dari InvitationData.eventDate.
  const eventDateOnly = eventDateIso.slice(0, 10);

  // Konten yang diketik langsung oleh client (greeting, quote, love story, nama
  // acara) — beda dari label UI tetap yang datang dari dict getDict() — jadi perlu
  // versi id/en sendiri di sini supaya preview bahasa Inggris benar-benar berbahasa
  // Inggris, bukan cuma UI chrome-nya saja.
  const content =
    language === "en"
      ? {
          guestName: "Guest",
          quote: "Love that grows from simplicity, lasting in togetherness.",
          greeting: "With heartfelt gratitude, we invite you to celebrate our special day with us.",
          loveStory: [
            { title: "First Met", story: "We were brought together at a family gathering in Bali, and our story began from there." },
            { title: "Growing Closer", story: "Slowly we got to know each other more deeply, through ups and downs, learning to support one another." },
            { title: "The Proposal", story: "At a place full of memories for the two of us, he got down on one knee and asked if I'd spend the rest of my life with him." },
            { title: "Towards the Wedding", story: "Now we're preparing to celebrate a new chapter in our lives, and with gratitude we invite you to celebrate it with us." },
          ],
          eventNames: { akad: "Holy Matrimony", reception: "Reception" },
        }
      : {
          guestName: "Tamu Undangan",
          quote: "Cinta yang tumbuh dari kesederhanaan, abadi dalam kebersamaan.",
          greeting:
            "Om Swastyastu, dengan penuh rasa syukur kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
          loveStory: [
            { title: "Awal Bertemu", story: "Kami dipertemukan dalam sebuah acara keluarga di Bali, dan sejak itu kisah kami dimulai." },
            { title: "Menjalin Kedekatan", story: "Perlahan kami saling mengenal lebih dalam, melewati suka duka, dan belajar untuk saling menguatkan satu sama lain." },
            { title: "Melamar", story: "Di tempat yang penuh kenangan bagi kami berdua, ia berlutut dan bertanya apakah saya bersedia menghabiskan sisa hidup bersamanya." },
            { title: "Menuju Pernikahan", story: "Kini kami bersiap merayakan babak baru dalam hidup kami, dan dengan penuh syukur mengundang Anda untuk turut merayakannya." },
          ],
          eventNames: { akad: "Akad Nikah", reception: "Resepsi" },
        };

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
    quote: content.quote,
    greeting: content.greeting,
    eventDate: eventDateIso,
    galleryImages: [],
    loveStory: content.loveStory,
    events: [
      {
        name: content.eventNames.akad,
        date: eventDateOnly,
        timeStart: "09:00",
        timeEnd: "10:00",
        venueName: "The Garden Grille",
        location: "Jl. Taman Palem Lestari No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
        mapsUrl: "https://maps.google.com",
      },
      {
        name: content.eventNames.reception,
        date: eventDateOnly,
        timeStart: "12:00",
        timeEnd: "14:00",
        venueName: "The Garden Grille",
        location: "Jl. Taman Palem Lestari No.1 Blok B 13, Cengkareng Barat, Jakarta, 11730, Indonesia",
        mapsUrl: "https://maps.google.com",
      },
    ],
    bankAccounts: [],
    dressCode: [],
    hasIntro,
    maxGalleryImages: null,
    hiddenSections,
  };

  return <Template data={data} guestName={content.guestName} />;
}
