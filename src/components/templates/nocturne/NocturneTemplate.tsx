"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { TemplateProps } from "@/types/invitation";
import { getDict } from "@/lib/i18n/lume";
import LoadingScreen from "./LoadingScreen";
import SplashGate from "./SplashGate";

// Tema baru "Nocturne" (dark & moody, layout beda dari Lume/Reverie/Muse) —
// sedang dibangun section per section bareng client. Baru ada LoadingScreen +
// SplashGate; section lain (hero, dst) menyusul satu-satu.
export default function NocturneTemplate({ data, guestName }: TemplateProps) {
  const [showLoading, setShowLoading] = useState(Boolean(data.hasIntro));
  const [opened, setOpened] = useState(false);

  const visibleGalleryImages = data.maxGalleryImages
    ? data.galleryImages.slice(0, data.maxGalleryImages)
    : data.galleryImages;

  const t = getDict(data.language);
  const eventDateLabel = new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-groove-stone">
      <AnimatePresence mode="wait">
        {showLoading && (
          <LoadingScreen
            groomNickname={data.groomNickname}
            brideNickname={data.brideNickname}
            images={visibleGalleryImages}
            onComplete={() => setShowLoading(false)}
          />
        )}
      </AnimatePresence>

      {!showLoading && !opened && (
        <SplashGate
          groomNickname={data.groomNickname}
          brideNickname={data.brideNickname}
          eventDateLabel={eventDateLabel}
          guestName={guestName}
          backgroundImage={data.reverieGateImage}
          lang={data.language}
          onOpen={() => setOpened(true)}
        />
      )}

      {!showLoading && opened && (
        <div className="min-h-screen flex items-center justify-center text-groove-bg/60 font-groove-body text-sm px-6 text-center">
          SplashGate selesai — section berikutnya menyusul.
        </div>
      )}
    </main>
  );
}
