"use client";

import { useState } from "react";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playSelect } from "./sfx";
import AvatarSprite from "./AvatarSprite";

// Layar pilih karakter — muncul setelah loading, sebelum masuk dunia.
// Pilihan murni kosmetik (warna outfit avatar), tidak memengaruhi konten.
export default function CharacterSelect({
  lang,
  onSelect,
}: {
  lang?: Lang;
  onSelect: (character: "male" | "female") => void;
}) {
  const t = getDict(lang);
  const [picked, setPicked] = useState<"male" | "female">("male");

  const confirm = () => {
    playSelect();
    onSelect(picked);
  };

  return (
    <div className="fixed inset-0 z-50 bg-pixel-bg flex flex-col items-center justify-center gap-8 px-6 text-pixel-ink">
      <p className="font-pixel-display text-xs md:text-sm text-pixel-yellow uppercase tracking-widest text-center">
        {t.pixelSelectCharacter}
      </p>

      <div className="flex gap-6">
        {(["male", "female"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => {
              playSelect();
              setPicked(c);
            }}
            className={`pixel-border bg-pixel-panel px-6 py-6 flex flex-col items-center gap-4 transition ${
              picked === c ? "ring-4 ring-pixel-yellow" : ""
            }`}
          >
            <AvatarSprite character={c} facing="right" walking={false} walkFrame={0} className="w-16 h-20" />
            <span className="font-pixel-display text-[10px] uppercase tracking-widest">
              {c === "male" ? t.pixelMale : t.pixelFemale}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={confirm}
        className="pixel-border bg-pixel-green text-pixel-bg font-pixel-display text-xs uppercase tracking-widest px-8 py-3.5"
      >
        {t.pixelContinueGame}
      </button>
    </div>
  );
}
