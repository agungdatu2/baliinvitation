import Image from "next/image";

// Foto real klien (couple) yang sudah pakai BaliInvitation — filename polanya
// "nama1-nama2.webp", nama tampilannya diturunkan otomatis dari situ (kapital +
// dipisah "&") supaya tambah klien baru cukup taruh file baru di folder ini.
const CLIENT_FILES = [
  "ari-ana",
  "arik-eka",
  "bagas-wulan",
  "bawa-gekmas",
  "bayu-dewi",
  "dedek-gadis",
  "dekdi-bella",
  "dewa-virgin",
  "dharma-dewaayu",
  "dion-nindy",
  "dita-sonia",
  "eka-linda",
  "eno-via",
  "gusdeny-gegdwi",
  "lucky-novita",
  "medy-zonia",
  "putra-wulan",
  "ratna-adrian",
  "sujata-wija",
  "turah-gungistri",
  "alit-titin",
  "anton-mita",
  "ash-orcid",
];

function displayName(file: string) {
  return file
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" & ");
}

export default function ClientCarousel() {
  // Track diduplikasi 2x supaya animasi translateX(-50%) loop mulus tanpa jeda.
  const track = [...CLIENT_FILES, ...CLIENT_FILES];

  return (
    <div
      className="relative overflow-hidden"
      style={{
        maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        WebkitMaskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
      }}
    >
      <div className="flex w-max gap-5 animate-groove-marquee hover:[animation-play-state:paused]">
        {track.map((file, i) => (
          <div
            key={`${file}-${i}`}
            className="relative shrink-0 w-36 sm:w-44 aspect-[550/700] rounded-2xl overflow-hidden border border-groove-line"
          >
            <Image
              src={`/landing/clients/${file}.webp`}
              alt={displayName(file)}
              fill
              sizes="200px"
              className="object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent pt-10 pb-3 px-3">
              <p className="text-white text-base sm:text-lg font-groove-display text-center" style={{ fontWeight: 500 }}>
                {displayName(file)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
