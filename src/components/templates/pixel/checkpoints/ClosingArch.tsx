import { InvitationData } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";

interface Zone {
  x: number;
  width: number;
}

// Checkpoint akhir dunia — arch bunga + flag "THANK YOU", visual langsung
// (bukan modal), jadi penanda ujung level.
export default function ClosingArch({ zone, data }: { zone: Zone; data: InvitationData }) {
  const t = getDict(data.language);
  return (
    <div className="absolute bottom-16 flex flex-col items-center text-center px-6" style={{ left: zone.x, width: zone.width }}>
      <div className="flex items-end gap-1 mb-2">
        <div className="w-3 h-24 bg-pixel-green pixel-border" />
        <div className="flex flex-col items-center">
          <div className="w-40 h-6 bg-pixel-red pixel-border mb-1" />
          <p className="font-pixel-display text-[10px] text-pixel-ink px-2">FLAG</p>
        </div>
        <div className="w-3 h-24 bg-pixel-green pixel-border" />
      </div>

      <h2 className="font-pixel-display text-2xl md:text-3xl text-pixel-red mb-4">{t.pixelGameOver}</h2>
      <p className="font-pixel-body text-lg text-pixel-ink/85 mb-4">{t.pixelThanksForPlaying}</p>
      <h3 className="font-pixel-display text-sm tracking-widest text-pixel-yellow mb-8">
        {data.groomNickname} &amp; {data.brideNickname}
      </h3>

      <p className="font-pixel-display text-[8px] opacity-60 tracking-widest uppercase mb-2">{t.pixelCreatedBy}</p>
      <p className="font-pixel-display text-[8px] opacity-50 tracking-widest uppercase">
        © All rights reserved by BaliInvitation
      </p>
    </div>
  );
}
