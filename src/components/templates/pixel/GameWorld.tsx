"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { InvitationData } from "@/types/invitation";
import { getDict, Lang } from "@/lib/i18n/lume";
import { playBlip } from "./sfx";
import AvatarSprite from "./AvatarSprite";
import NavMenu from "./NavMenu";
import TempleCheckpoint from "./checkpoints/TempleCheckpoint";
import ProfileCheckpoint from "./checkpoints/ProfileCheckpoint";
import CountdownBanner from "./checkpoints/CountdownBanner";
import LoveStoryTrack from "./checkpoints/LoveStoryTrack";
import VenueCastle from "./checkpoints/VenueCastle";
import LiveStreamingSign from "./checkpoints/LiveStreamingSign";
import GiftChest from "./checkpoints/GiftChest";
import GalleryFrames from "./checkpoints/GalleryFrames";
import DressCodeHanger from "./checkpoints/DressCodeHanger";
import RsvpBoard from "./checkpoints/RsvpBoard";
import ClosingArch from "./checkpoints/ClosingArch";

const SPEED = 320; // px/detik
const AVATAR_HALF_W = 24;
const HERO_WIDTH = 900;
const DOA_WIDTH = 700;
const PROFILE_WIDTH = 1400;
const COUNTDOWN_WIDTH = 800;
const LOVESTORY_ITEM_WIDTH = 450;
const VENUE_ITEM_WIDTH = 800;
const LIVESTREAM_WIDTH = 500;
const GIFT_WIDTH = 700;
const GALLERY_ITEM_WIDTH = 350;
const DRESSCODE_WIDTH = 700;
const RSVP_WIDTH = 900;
const CLOSING_WIDTH = 900;
const END_PADDING = 500;

export interface Zone {
  key: string;
  x: number;
  width: number;
}

// Awan pixel dekoratif — dibangun dari beberapa blok putih bertumpuk (bukan
// file gambar), meniru siluet awan chunky ala referensi.
function PixelCloud({ x, y, scale }: { x: number; y: number; scale: number }) {
  return (
    <div
      className="absolute"
      style={{ left: x, top: y, transform: `scale(${scale})`, transformOrigin: "top left" }}
    >
      <div className="relative w-24 h-10">
        <div className="absolute left-2 top-3 w-20 h-5 bg-pixel-cloud" />
        <div className="absolute left-6 top-0 w-10 h-5 bg-pixel-cloud" />
        <div className="absolute left-0 top-4 w-6 h-4 bg-pixel-cloud" />
        <div className="absolute right-0 top-4 w-8 h-4 bg-pixel-cloud" />
      </div>
    </div>
  );
}

// Menyusun daftar zona secara berurutan (posisi x kumulatif) sesuai section
// yang tidak disembunyikan (hiddenSections) — dipakai baik untuk render
// checkpoint maupun target teleport NavMenu "Quick Info".
function buildZones(data: InvitationData): Zone[] {
  const hidden = new Set(data.hiddenSections ?? []);
  const zones: Zone[] = [];
  let cursor = 0;

  const push = (key: string, width: number) => {
    zones.push({ key, x: cursor, width });
    cursor += width;
  };

  push("hero", HERO_WIDTH);
  push("doa", DOA_WIDTH);
  if (!hidden.has("couple")) push("profile", PROFILE_WIDTH);
  if (!hidden.has("events")) push("countdown", COUNTDOWN_WIDTH);
  if (!hidden.has("loveStory") && data.loveStory?.length) {
    push("loveStory", LOVESTORY_ITEM_WIDTH * data.loveStory.length);
  }
  if (!hidden.has("events") && data.events?.length) {
    push("venue", VENUE_ITEM_WIDTH * data.events.length);
  }
  if (!hidden.has("liveStreaming") && data.livestreamUrl) push("liveStreaming", LIVESTREAM_WIDTH);
  if (!hidden.has("gift") && data.bankAccounts?.length) push("gift", GIFT_WIDTH);
  if (!hidden.has("gallery") && data.galleryImages?.length) {
    push("gallery", GALLERY_ITEM_WIDTH * Math.min(data.galleryImages.length, 10));
  }
  if (!hidden.has("dressCode") && data.dressCode?.length) push("dressCode", DRESSCODE_WIDTH);
  if (!hidden.has("rsvp")) push("rsvp", RSVP_WIDTH);
  push("closing", CLOSING_WIDTH);
  cursor += END_PADDING;

  return zones;
}

export default function GameWorld({
  data,
  guestName,
  guestId,
  character,
}: {
  data: InvitationData;
  guestName?: string;
  guestId?: string;
  character: "male" | "female";
}) {
  const t = getDict(data.language);
  const zones = useMemo(() => buildZones(data), [data]);
  const zoneByKey = useMemo(() => Object.fromEntries(zones.map((z) => [z.key, z])), [zones]);
  const worldWidth = zones.length ? zones[zones.length - 1].x + zones[zones.length - 1].width : HERO_WIDTH;

  const [started, setStarted] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play().then(() => setMusicPlaying(true)).catch(() => {});
    } else {
      audio.pause();
      setMusicPlaying(false);
    }
  };

  const [avatarX, setAvatarX] = useState(HERO_WIDTH / 2);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [moving, setMoving] = useState(false);
  const [walkFrame, setWalkFrame] = useState<0 | 1>(0);
  const [viewportWidth, setViewportWidth] = useState(1280);
  const [openModalIds, setOpenModalIds] = useState<Set<string>>(new Set());

  const heldRef = useRef({ left: false, right: false });
  const avatarXRef = useRef(avatarX);
  avatarXRef.current = avatarX;
  const rafRef = useRef<number | null>(null);
  const worldRef = useRef<HTMLDivElement>(null);

  const anyModalOpen = openModalIds.size > 0;
  const controlsEnabled = started && !anyModalOpen;

  const registerModal = (id: string, open: boolean) => {
    setOpenModalIds((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  };

  useEffect(() => {
    const el = worldRef.current;
    if (!el) return;
    const update = () => setViewportWidth(el.clientWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Loop gerak — hanya aktif kalau tombol ditekan & kontrol tidak dikunci modal.
  useEffect(() => {
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (controlsEnabled) {
        const dir = heldRef.current.left ? -1 : heldRef.current.right ? 1 : 0;
        if (dir !== 0) {
          const next = Math.max(AVATAR_HALF_W, Math.min(worldWidth - AVATAR_HALF_W, avatarXRef.current + dir * SPEED * dt));
          if (next !== avatarXRef.current) setAvatarX(next);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [controlsEnabled, worldWidth]);

  // Walk-cycle timer — toggle frame kaki tiap 150ms selagi bergerak.
  useEffect(() => {
    if (!moving) return;
    const id = setInterval(() => setWalkFrame((f) => (f === 0 ? 1 : 0)), 150);
    return () => clearInterval(id);
  }, [moving]);

  const setDir = (dir: "left" | "right", pressed: boolean) => {
    heldRef.current[dir] = pressed;
    if (pressed) setFacing(dir);
    setMoving(heldRef.current.left || heldRef.current.right);
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setDir("left", true);
      if (e.key === "ArrowRight") setDir("right", true);
    };
    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setDir("left", false);
      if (e.key === "ArrowRight") setDir("right", false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  const cameraX = Math.max(0, Math.min(worldWidth - viewportWidth, avatarX - viewportWidth / 2));

  const teleportTo = (zoneKey: string) => {
    const zone = zoneByKey[zoneKey];
    if (!zone) return;
    setAvatarX(Math.max(AVATAR_HALF_W, Math.min(worldWidth - AVATAR_HALF_W, zone.x + zone.width / 2)));
  };

  const dpad = (dir: "left" | "right") => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault();
      playBlip();
      setDir(dir, true);
    },
    onPointerUp: () => setDir(dir, false),
    onPointerLeave: () => setDir(dir, false),
    onPointerCancel: () => setDir(dir, false),
  });

  const cloudCount = Math.max(4, Math.round(worldWidth / 700));
  const clouds = useMemo(
    () =>
      Array.from({ length: cloudCount }, (_, i) => ({
        x: (i * 700 + (i % 3) * 180) % (worldWidth + 400),
        y: 40 + ((i * 53) % 160),
        scale: 0.7 + ((i * 37) % 6) / 10,
      })),
    [cloudCount, worldWidth]
  );

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-pixel-sky select-none">
      {/* Langit cerah siang — gradient biru + awan pixel parallax */}
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, #6bb8e8 0%, #8fd3f4 55%, #c9ecff 100%)" }}
      />
      <div
        className="absolute inset-0"
        style={{ transform: `translateX(${-cameraX * 0.25}px)` }}
      >
        {clouds.map((c, i) => (
          <PixelCloud key={i} x={c.x} y={c.y} scale={c.scale} />
        ))}
      </div>
      {/* Bukit hijau jauh — parallax lebih cepat dari awan, lebih lambat dari dunia */}
      <div
        className="absolute bottom-16 left-0 right-0 h-24 opacity-70"
        style={{
          background: "radial-gradient(ellipse 140px 90px at 10% 100%, #6fce78 0%, transparent 70%)," +
            "radial-gradient(ellipse 180px 110px at 35% 100%, #6fce78 0%, transparent 70%)," +
            "radial-gradient(ellipse 160px 100px at 62% 100%, #6fce78 0%, transparent 70%)," +
            "radial-gradient(ellipse 200px 120px at 88% 100%, #6fce78 0%, transparent 70%)",
          backgroundRepeat: "repeat-x",
          backgroundSize: "900px 100%",
          transform: `translateX(${-cameraX * 0.5}px)`,
        }}
      />

      {data.musicUrl && <audio ref={audioRef} src={data.musicUrl} loop />}

      <NavMenu
        lang={data.language}
        zones={zones}
        hasMusic={Boolean(data.musicUrl)}
        musicPlaying={musicPlaying}
        onToggleMusic={toggleMusic}
        onTeleport={(key) => {
          teleportTo(key);
        }}
      />

      <div ref={worldRef} className="absolute inset-0">
        <div
          className="absolute top-0 bottom-0"
          style={{ width: worldWidth, transform: `translateX(${-cameraX}px)` }}
        >
          {/* Tanah — rumput hijau di atas, tanah cokelat di bawah, motif pixel */}
          <div
            className="absolute bottom-0 left-0 h-16"
            style={{
              width: worldWidth,
              backgroundImage:
                "repeating-linear-gradient(90deg, #5fc76a 0 24px, #4fb85c 24px 28px)," +
                "repeating-linear-gradient(90deg, #8a5a3b 0 24px, #7a4d30 24px 28px)," +
                "linear-gradient(180deg, #8a5a3b 0%, #6b4128 100%)",
              backgroundSize: "28px 10px, 28px 100%, 100% 100%",
              backgroundPosition: "0 0, 0 10px, 0 0",
              backgroundRepeat: "repeat-x, repeat-x, no-repeat",
            }}
          />

          {zoneByKey.hero && (
            <div
              className="absolute bottom-16 flex flex-col items-center gap-3 text-center px-6"
              style={{ left: zoneByKey.hero.x, width: zoneByKey.hero.width }}
            >
              <div className="flex items-end gap-1 mb-1">
                <AvatarSprite character="male" facing="right" walking={false} walkFrame={0} className="w-8 h-11" />
                <span className="text-pixel-red text-lg -mb-2">♥</span>
                <AvatarSprite character="female" facing="left" walking={false} walkFrame={0} className="w-8 h-11" />
              </div>

              <div className="pixel-border-thick bg-pixel-panel/90 px-5 py-4">
                <p className="font-pixel-display text-[9px] md:text-[10px] text-pixel-yellow uppercase tracking-widest mb-2">
                  We invite you to celebrate
                </p>
                <h1 className="font-pixel-display text-lg md:text-2xl text-pixel-ink mb-2">
                  {data.groomNickname} &amp; {data.brideNickname}
                </h1>
                <p className="font-pixel-body text-base text-pixel-ink/80">
                  {new Date(data.eventDate).toLocaleDateString(t.dateLocale, {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {!started && (
                <button
                  onClick={() => {
                    playBlip();
                    setStarted(true);
                    audioRef.current?.play().then(() => setMusicPlaying(true)).catch(() => {});
                  }}
                  className="mt-1 pixel-border bg-pixel-red text-pixel-ink font-pixel-display text-xs uppercase tracking-widest px-8 py-3.5 animate-pulse"
                >
                  {t.pixelPressStart}
                </button>
              )}
              {started && (
                <p className="font-pixel-display text-[8px] text-pixel-panel bg-pixel-ink/70 px-2 py-1 uppercase tracking-widest">
                  {t.pixelWalkHint}
                </p>
              )}
            </div>
          )}

          {zoneByKey.doa && <TempleCheckpoint zone={zoneByKey.doa} avatarX={avatarX} lang={data.language} />}

          {zoneByKey.profile && (
            <ProfileCheckpoint
              zone={zoneByKey.profile}
              avatarX={avatarX}
              data={data}
              onModalOpenChange={(open) => registerModal("profile", open)}
            />
          )}

          {zoneByKey.countdown && (
            <CountdownBanner zone={zoneByKey.countdown} avatarX={avatarX} data={data} />
          )}

          {zoneByKey.loveStory && (
            <LoveStoryTrack
              zone={zoneByKey.loveStory}
              itemWidth={LOVESTORY_ITEM_WIDTH}
              avatarX={avatarX}
              data={data}
              onModalOpenChange={(open) => registerModal("loveStory", open)}
            />
          )}

          {zoneByKey.venue && (
            <VenueCastle
              zone={zoneByKey.venue}
              itemWidth={VENUE_ITEM_WIDTH}
              data={data}
              onModalOpenChange={(open) => registerModal("venue", open)}
            />
          )}

          {zoneByKey.liveStreaming && (
            <LiveStreamingSign
              zone={zoneByKey.liveStreaming}
              url={data.livestreamUrl}
              note={data.livestreamNote}
              lang={data.language}
            />
          )}

          {zoneByKey.gift && (
            <GiftChest
              zone={zoneByKey.gift}
              accounts={data.bankAccounts}
              lang={data.language}
              onModalOpenChange={(open) => registerModal("gift", open)}
            />
          )}

          {zoneByKey.gallery && (
            <GalleryFrames
              zone={zoneByKey.gallery}
              itemWidth={GALLERY_ITEM_WIDTH}
              images={data.galleryImages}
              lang={data.language}
              onModalOpenChange={(open) => registerModal("gallery", open)}
            />
          )}

          {zoneByKey.dressCode && (
            <DressCodeHanger
              zone={zoneByKey.dressCode}
              items={data.dressCode}
              lang={data.language}
              onModalOpenChange={(open) => registerModal("dressCode", open)}
            />
          )}

          {zoneByKey.rsvp && (
            <RsvpBoard
              zone={zoneByKey.rsvp}
              invitationId={data.id ?? data.slug}
              guestName={guestName}
              guestId={guestId}
              lang={data.language}
              initialWishes={data.initialWishes}
              onModalOpenChange={(open) => registerModal("rsvp", open)}
            />
          )}

          {zoneByKey.closing && <ClosingArch zone={zoneByKey.closing} data={data} />}

          {/* Avatar — bagian dari world layer supaya satu koordinat dengan checkpoint */}
          <div
            className="absolute bottom-16 transition-none"
            style={{ left: avatarX - AVATAR_HALF_W, width: AVATAR_HALF_W * 2 }}
          >
            <AvatarSprite character={character} facing={facing} walking={moving} walkFrame={walkFrame} className="w-12 h-16" />
          </div>
        </div>
      </div>

      {/* D-pad on-screen */}
      {started && (
        <div className="fixed bottom-6 left-6 z-50 flex gap-3">
          <button
            aria-label="left"
            className="pixel-border bg-pixel-panel text-pixel-ink w-14 h-14 flex items-center justify-center text-xl font-pixel-display active:bg-pixel-blue"
            style={{ touchAction: "none" }}
            {...dpad("left")}
          >
            ◀
          </button>
          <button
            aria-label="right"
            className="pixel-border bg-pixel-panel text-pixel-ink w-14 h-14 flex items-center justify-center text-xl font-pixel-display active:bg-pixel-blue"
            style={{ touchAction: "none" }}
            {...dpad("right")}
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
}
