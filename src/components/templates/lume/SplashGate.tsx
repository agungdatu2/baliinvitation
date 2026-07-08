"use client";

import { useEffect, useState } from "react";

interface Props {
  groomNickname: string;
  brideNickname: string;
  eventDateLabel: string;
  guestName?: string;
  onOpen: () => void;
}

// Replika fitur "cover loading %" + "Kepada Yth: [Tamu]" + tombol "Let's Open"
// yang ada di tamubali.com/lume
export default function SplashGate({ groomNickname, brideNickname, eventDateLabel, guestName, onOpen }: Props) {
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setLoaded(true);
          return 100;
        }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-lume-bg flex flex-col items-center justify-center text-center px-6 animate-fadeIn">
      <p className="uppercase tracking-[0.3em] text-xs text-lume-gold mb-4">The Wedding Of</p>
      <h1 className="font-script text-5xl text-lume-ink mb-2">
        {groomNickname} <span className="text-lume-gold">&</span> {brideNickname}
      </h1>

      {!loaded ? (
        <p className="mt-8 text-sm text-gray-500">{progress}%</p>
      ) : (
        <div className="mt-8 space-y-3">
          <p className="text-sm text-gray-600">{eventDateLabel}</p>
          <p className="text-sm text-gray-500">Kepada Yth. Bapak/Ibu/Saudara/i</p>
          <p className="font-medium text-lg text-lume-ink">{guestName || "Tamu Undangan"}</p>
          <p className="text-xs text-gray-400 italic">*Mohon maaf apabila ada kesalahan penulisan nama/gelar</p>
          <button
            onClick={onOpen}
            className="mt-4 px-8 py-2 rounded-full border border-lume-ink text-lume-ink hover:bg-lume-ink hover:text-white transition"
          >
            Buka Undangan
          </button>
        </div>
      )}
    </div>
  );
}
