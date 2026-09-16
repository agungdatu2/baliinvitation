"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { TemplateProps } from "@/types/invitation";
import LoadingScreen from "./LoadingScreen";

// Tema baru "Nocturne" (dark & moody, layout beda dari Lume/Reverie/Muse) —
// sedang dibangun section per section bareng client. Baru ada LoadingScreen;
// section lain (gate, hero, dst) menyusul satu-satu.
export default function NocturneTemplate({ data }: TemplateProps) {
  const [showLoading, setShowLoading] = useState(Boolean(data.hasIntro));

  const visibleGalleryImages = data.maxGalleryImages
    ? data.galleryImages.slice(0, data.maxGalleryImages)
    : data.galleryImages;

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

      {!showLoading && (
        <div className="min-h-screen flex items-center justify-center text-groove-bg/60 font-groove-body text-sm px-6 text-center">
          LoadingScreen selesai — section berikutnya menyusul.
        </div>
      )}
    </main>
  );
}
