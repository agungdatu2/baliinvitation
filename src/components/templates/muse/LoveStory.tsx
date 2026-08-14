import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

const DEFAULT_PHOTOS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
];

// TANPA foto background sendiri (beda dari GroomSection/BrideSection/PrayerSection)
// — sengaja dibiarkan transparan supaya FixedBackground milik MuseTemplate tetap
// kelihatan di belakangnya. Dekorasi di atas judul: kartu 3 foto bertumpuk sedikit
// miring + garis lingkaran di belakangnya, meniru referensi — foto diambil dari
// galeri (3 pertama yang bukan video), fallback placeholder kalau galeri kosong.
export default function LoveStory({ data }: { data: InvitationData }) {
  if (!data.loveStory?.length) return null;
  const t = getDict(data.language);

  const photos = (data.galleryImages ?? []).filter((src) => !/\.(mp4|webm|mov|m3u8)(\?.*)?$/i.test(src));
  const collagePhotos = (photos.length >= 3 ? photos : DEFAULT_PHOTOS).slice(0, 3);

  return (
    <section className="relative py-20 md:py-28 px-6 text-center text-groove-bg">
      {/* Lingkaran diposisikan menempel di atas kartu foto (bukan konsentris) —
          diameter sedikit lebih lebar dari foto & digeser ke atas, meniru posisi
          di referensi: lingkaran "mengintip" di atas & samping foto, foto sendiri
          menjulur jauh lebih ke bawah melewati tepi bawah lingkaran. */}
      <div className="relative w-64 mx-auto">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full border border-groove-bg/40" />
        <div className="relative w-64 h-80 -rotate-3 overflow-hidden shadow-xl">
          {collagePhotos.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              className="w-full object-cover"
              style={{ height: `${100 / collagePhotos.length}%` }}
            />
          ))}
          {/* Gradient bawah supaya judul yang menumpuk di atasnya tetap terbaca */}
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      </div>

      {/* Margin negatif menarik judul naik, menumpuk di atas sepertiga bawah foto. */}
      <h2 className="relative z-10 -mt-24 font-reverie-display text-5xl md:text-6xl leading-tight mb-10 max-w-sm mx-auto" style={{ fontWeight: 400 }}>
        {t.loveStoryHeading}
      </h2>

      <div className="space-y-8 max-w-md mx-auto">
        {data.loveStory.map((item, i) => (
          <div key={i}>
            <h4 className="font-groove-label text-xs uppercase tracking-widest text-groove-bg/70 mb-2">
              {item.title}
            </h4>
            <p className="font-groove-body text-sm text-groove-bg/85 leading-relaxed whitespace-pre-line">
              {item.story}
            </p>
          </div>
        ))}
      </div>

      <p className="font-reverie-display italic text-xl mt-10">
        {data.groomNickname} &amp; {data.brideNickname}
      </p>
    </section>
  );
}
