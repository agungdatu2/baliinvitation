"use client";

import { useState } from "react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import LoadingScreen from "./LoadingScreen";
import CharacterSelect from "./CharacterSelect";
import GameWorld from "./GameWorld";

type Phase = "loading" | "characterSelect" | "world";

// Orchestrator tema "Pixel" — side-scrolling platformer ala Mario Bros.
// Fase: loading (boot bar) -> characterSelect (pilih avatar) -> world (dunia
// horizontal dikendalikan D-pad, checkpoint per section undangan).
export default function PixelTemplate({ data, guestName, guestId }: TemplateProps) {
  const t = getDict(data.language);
  const [phase, setPhase] = useState<Phase>(data.hasIntro ? "loading" : "characterSelect");
  const [character, setCharacter] = useState<"male" | "female">("male");

  return (
    <main className="bg-pixel-bg text-pixel-ink font-pixel-body">
      {phase === "loading" && (
        <LoadingScreen label={t.weddingInvitationLabel} onComplete={() => setPhase("characterSelect")} />
      )}

      {phase === "characterSelect" && (
        <CharacterSelect
          lang={data.language}
          onSelect={(c) => {
            setCharacter(c);
            setPhase("world");
          }}
        />
      )}

      {phase === "world" && (
        <GameWorld data={data} guestName={guestName} guestId={guestId} character={character} />
      )}
    </main>
  );
}
