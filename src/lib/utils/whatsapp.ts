// wa.me butuh format internasional tanpa "+"/spasi/strip, dan nomor Indonesia yang
// diawali "0" harus diganti ke "62".
export function normalizeWaNumber(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.startsWith("0")) return "62" + digits.slice(1);
  if (digits.startsWith("62")) return digits;
  return digits;
}

export function buildWaLink(waNumber: string, message: string): string {
  return `https://wa.me/${normalizeWaNumber(waNumber)}?text=${encodeURIComponent(message)}`;
}

export function buildGuestInvitationMessage(params: {
  guestName: string;
  title: string; // "Groom & Bride" untuk wedding, atau hostName untuk acara non-wedding
  eventDateLabel: string;
  link: string;
  isWedding?: boolean; // default true — pengirim lama (semua wedding) tetap sama persis
}): string {
  const { guestName, title, eventDateLabel, link, isWedding = true } = params;
  const intro = isWedding
    ? "Dengan penuh kebahagiaan kami mengundang Anda untuk menghadiri pernikahan kami:"
    : "Dengan hormat kami mengundang Anda untuk menghadiri acara kami:";
  return `Kepada Yth. Bapak/Ibu/Saudara/i *${guestName}*,

${intro}

*${title}*
${eventDateLabel}

Berikut link undangan digital kami, mohon dibuka untuk info lengkap acara & konfirmasi kehadiran:
${link}

Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir. Terima kasih 🙏`;
}

export function buildPortalLinkMessage(params: { clientName: string; portalLink: string }): string {
  return `Halo ${params.clientName},

Berikut link Portal Client untuk mengelola undangan pernikahan Anda (daftar tamu, kirim link ke tamu, lihat RSVP, dan atur jadwal acara):

${params.portalLink}

Link ini bersifat pribadi, mohon jangan dibagikan ke pihak lain selain yang mengelola undangan. Kalau ada pertanyaan silakan hubungi kami. Terima kasih 🙏`;
}
