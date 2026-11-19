import { ordinal, parseAge } from "@/lib/i18n/confetti";

export interface OccasionInput {
  category: string; // Template.category: wedding | ulang-tahun | melaspas | potong-gigi
  groom: string;
  bride: string;
  hostName?: string | null;
  eventTitle?: string | null;
}

export interface Occasion {
  // Teks kecil di atas nama di cover & layar HP (mis. "THE WEDDING OF").
  label: string;
  // Nama besar di cover. Dua baris atau lebih = dipakai apa adanya; satu baris = di-wrap otomatis.
  nameLines: string[];
  // Nama utuh satu baris (layar HP kedua, caption).
  fullName: string;
  caption: (themeName: string) => string;
}

const HASHTAGS: Record<string, string> = {
  wedding: "#baliinvitation #undangandigital #undanganpernikahan #digitalinvitation #weddinginvitation #baliwedding",
  "ulang-tahun": "#baliinvitation #undangandigital #undanganulangtahun #digitalinvitation #birthdayinvitation #kidsbirthday",
  melaspas: "#baliinvitation #undangandigital #undanganmelaspas #digitalinvitation #grandopening #acarabali",
  "potong-gigi": "#baliinvitation #undangandigital #undanganpotonggigi #digitalinvitation #upacarabali #acarabali",
};

const DEFAULT_TITLE: Record<string, string> = {
  melaspas: "Melaspas",
  "potong-gigi": "Potong Gigi",
};

// Menyesuaikan teks postingan sosmed dengan jenis acara — tidak selalu wedding.
export function getOccasion(input: OccasionInput): Occasion {
  const host = input.hostName?.trim() || "";
  const tags = HASHTAGS[input.category] ?? HASHTAGS.wedding;
  const tail = "cek link di bio untuk lihat contoh lainnya.";

  if (input.category === "wedding" || !host) {
    const fullName = `${input.groom} & ${input.bride}`;
    return {
      label: "THE WEDDING OF",
      nameLines: [`${input.groom} &`, input.bride],
      fullName,
      caption: (theme) =>
        `Happy wedding ${fullName}\n\nMereka menggunakan tema ${theme} untuk undangan mereka, ${tail}\n\n${tags}`,
    };
  }

  if (input.category === "ulang-tahun") {
    const age = parseAge(input.eventTitle ?? undefined);
    return {
      label: age !== null ? `THE ${ordinal(age).toUpperCase()} BIRTHDAY OF` : "THE BIRTHDAY OF",
      nameLines: [host],
      fullName: host,
      caption: (theme) =>
        `Happy birthday ${host}\n\nUndangan ulang tahun ${host} menggunakan tema ${theme}, ${tail}\n\n${tags}`,
    };
  }

  const title = (input.eventTitle?.trim() || DEFAULT_TITLE[input.category] || "Acara").replace(/\s+/g, " ");
  return {
    label: title.toUpperCase(),
    nameLines: [host],
    fullName: host,
    caption: (theme) => `${title} ${host}\n\nUndangan ${title.toLowerCase()} ${host} menggunakan tema ${theme}, ${tail}\n\n${tags}`,
  };
}
