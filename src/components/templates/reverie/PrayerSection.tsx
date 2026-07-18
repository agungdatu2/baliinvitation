import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_BACKGROUND = "https://images.unsplash.com/photo-1624646803808-9c5a9de7aa3f?auto=format&fit=crop&w=1400&q=85";

// Section "Doa" full-viewport (100svh) dengan foto background sendiri (bukan
// FixedVideoBackground yang dipakai section lain) — reuse field `coverImage`
// & `quote` yang sudah ada di skema (belum dipakai theme manapun) alih-alih
// nambah field DB baru.
//
// z-index: section ini `relative z-10` supaya pasti di atas FixedVideoBackground
// (`fixed inset-0 -z-10` di level <main>, lihat ReverieTemplate) — foto & overlay
// gradient di dalam section ini dikasih `-z-10` juga, tapi itu relatif ke section
// ini sendiri (stacking context baru dari `relative`), jadi tidak konflik dengan
// video di belakang seluruh halaman.
export default function PrayerSection({ data }: { data: InvitationData }) {
  const t = getDict(data.language);

  return (
    <section className="relative z-10 h-[100svh] overflow-hidden flex items-end text-groove-bg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.coverImage || DEFAULT_BACKGROUND}
        alt=""
        className="absolute inset-0 h-full w-full object-cover -z-10"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent -z-10" />

      {/* t.prayerLabel ("Doa"/"Prayer") sengaja TIDAK ditampilkan di sini — cuma
          dipakai sebagai label field di form admin, bukan teks yang tampil
          di undangan publik. */}
      <div className="relative px-6 md:px-14 pb-16 md:pb-20 max-w-xl">
        <p className="font-groove-body text-base text-groove-bg/90 leading-relaxed whitespace-pre-line">
          {data.quote || t.defaultPrayerQuote}
        </p>
        <p className="font-groove-display italic text-xl mt-8 text-right">
          {data.groomNickname} &amp; {data.brideNickname}
        </p>
      </div>
    </section>
  );
}
