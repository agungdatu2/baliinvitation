"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Camera, Check, Copy, Download, ImageOff, Loader2, RotateCcw } from "lucide-react";
import {
  PostInfo,
  SLIDE_H,
  SLIDE_W,
  SlideFonts,
  SlideKind,
  drawCoverSlide,
  drawMockupSlide,
  loadSlideImage,
  MOCKUP_BACKGROUND,
} from "@/lib/social/draw";

function SlideCanvas({
  id,
  kind,
  photo,
  photo2,
  screenCover,
  screenInner,
  info,
  fonts,
  onCanvas,
}: {
  id: string;
  kind: SlideKind;
  photo: string;
  photo2: string;
  screenCover: string;
  screenInner: string;
  info: PostInfo;
  fonts: SlideFonts | null;
  onCanvas: (id: string, el: HTMLCanvasElement | null) => void;
}) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    onCanvas(id, ref.current);
    return () => onCanvas(id, null);
  }, [id, onCanvas]);

  useEffect(() => {
    if (!fonts) return;
    let cancelled = false;
    (async () => {
      const load = async (url: string) => {
        if (!url) return { img: null, failed: false };
        try {
          return { img: await loadSlideImage(url), failed: false };
        } catch {
          return { img: null, failed: true };
        }
      };
      const none = { img: null, failed: false };
      const isMock = kind === "mockup";
      const [a, b, c, d, logo, bg] = await Promise.all([
        load(photo),
        isMock ? load(photo2) : Promise.resolve(none),
        isMock ? load(screenCover) : Promise.resolve(none),
        isMock ? load(screenInner) : Promise.resolve(none),
        kind === "cover" ? load("/brand/logo.webp") : Promise.resolve(none),
        isMock ? load(MOCKUP_BACKGROUND) : Promise.resolve(none),
      ]);
      if (cancelled) return;
      const ctx = ref.current?.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, SLIDE_W, SLIDE_H);
      if (kind === "cover") drawCoverSlide(ctx, a.img, logo.img, info, fonts);
      else drawMockupSlide(ctx, { background: bg.img, photo1: a.img, photo2: b.img, screenCover: c.img, screenInner: d.img }, info, fonts);
      setImageFailed(a.failed || b.failed || c.failed || d.failed || logo.failed || bg.failed);
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, photo, photo2, screenCover, screenInner, info, fonts]);

  return (
    <div className="relative">
      <canvas
        ref={ref}
        width={SLIDE_W}
        height={SLIDE_H}
        className="w-full rounded-lg border border-lume-line bg-lume-bg"
        style={{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }}
      />
      {imageFailed && (
        <div className="absolute left-2 top-2 flex items-center gap-1 rounded bg-red-600 px-2 py-1 text-xs text-white">
          <ImageOff size={12} /> Foto gagal dimuat
        </div>
      )}
    </div>
  );
}

function PhotoPicker({
  label,
  pool,
  value,
  onChange,
}: {
  label: string;
  pool: string[];
  value: string;
  onChange: (url: string) => void;
}) {
  if (pool.length === 0) return null;
  return (
    <div>
      <p className="mb-1 text-xs text-gray-500">{label}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {pool.map((url) => (
          <button
            key={url}
            type="button"
            onClick={() => onChange(url)}
            className={`h-12 w-12 shrink-0 overflow-hidden rounded border-2 ${value === url ? "border-lume-gold" : "border-transparent"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function SocialPostBuilder({
  invitationId,
  slug,
  groom,
  bride,
  themeName: initialThemeName,
  tagline: initialTagline,
  dateLabel,
  photos,
}: {
  invitationId: string;
  slug: string;
  groom: string;
  bride: string;
  themeName: string;
  tagline: string;
  dateLabel: string;
  photos: string[];
}) {
  const pool = useMemo(() => Array.from(new Set(photos)), [photos]);
  const photoAt = (i: number) => (pool.length ? pool[i % pool.length] : "");
  const [coverPhoto, setCoverPhoto] = useState(() => photoAt(0));
  const [phone1, setPhone1] = useState(() => photoAt(1));
  const [phone2, setPhone2] = useState(() => photoAt(2));
  const [themeName, setThemeName] = useState(initialThemeName);
  const [tagline, setTagline] = useState(initialTagline);
  const [scrollY, setScrollY] = useState(1600);
  const [screens, setScreens] = useState<{ cover: string; inner: string } | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [captionDraft, setCaptionDraft] = useState<string | null>(null);
  const [fonts, setFonts] = useState<SlideFonts | null>(null);
  const [copied, setCopied] = useState(false);
  const canvases = useRef<Record<string, HTMLCanvasElement | null>>({});
  const displayProbe = useRef<HTMLSpanElement>(null);
  const sansProbe = useRef<HTMLSpanElement>(null);

  const info = useMemo<PostInfo>(() => ({ groom, bride, themeName, tagline, dateLabel }), [groom, bride, themeName, tagline, dateLabel]);

  const defaultCaption = `Happy wedding ${groom} & ${bride}\n\nMereka menggunakan tema ${themeName} untuk undangan mereka, cek link di bio untuk lihat contoh lainnya.\n\n#baliinvitation #undangandigital #undanganpernikahan #digitalinvitation #weddinginvitation #baliwedding`;
  const caption = captionDraft ?? defaultCaption;

  useEffect(() => {
    const display = displayProbe.current && getComputedStyle(displayProbe.current).fontFamily;
    const sans = sansProbe.current && getComputedStyle(sansProbe.current).fontFamily;
    if (!display || !sans) return;
    Promise.all([
      document.fonts.load(`300 40px ${display}`, "Aa&"),
      document.fonts.load(`400 40px ${display}`, "Aa&"),
      document.fonts.load(`italic 300 40px ${display}`, "Aa&"),
      document.fonts.load(`400 20px ${sans}`, "Aa"),
    ])
      .catch(() => undefined)
      .then(() => setFonts({ display, sans }));
  }, []);

  const onCanvas = useCallback((id: string, el: HTMLCanvasElement | null) => {
    canvases.current[id] = el;
  }, []);

  const downloadSlide = (id: string, index: number) =>
    new Promise<void>((resolve) => {
      const canvas = canvases.current[id];
      if (!canvas) return resolve();
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${slug}-slide-${index + 1}.jpg`;
            a.click();
            setTimeout(() => URL.revokeObjectURL(url), 2000);
          }
          resolve();
        },
        "image/jpeg",
        0.92
      );
    });

  const downloadAll = async () => {
    await downloadSlide("cover", 0);
    await new Promise((r) => setTimeout(r, 400));
    await downloadSlide("mockup", 1);
  };

  const captureScreens = async () => {
    setCapturing(true);
    setCaptureError(null);
    try {
      const res = await fetch("/api/social/screens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: invitationId, scrollY }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.cover) throw new Error(data.error || "Gagal mengambil screenshot");
      setScreens({ cover: data.cover, inner: data.inner });
    } catch (e) {
      setCaptureError(e instanceof Error ? e.message : "Gagal mengambil screenshot");
    } finally {
      setCapturing(false);
    }
  };

  const copyCaption = async () => {
    try {
      await navigator.clipboard.writeText(caption);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Probe font (disembunyikan) — ambil nama family asli hasil next/font untuk dipakai di canvas. */}
      <span ref={displayProbe} className="font-muse-loading pointer-events-none absolute opacity-0" aria-hidden>
        .
      </span>
      <span ref={sansProbe} className="font-groove-label pointer-events-none absolute opacity-0" aria-hidden>
        .
      </span>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">2 slide · 1080×1080, siap upload sebagai carousel Instagram</p>
        <button
          type="button"
          onClick={downloadAll}
          disabled={!fonts}
          className="inline-flex items-center gap-1.5 rounded-lg bg-lume-ink px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-40"
        >
          <Download size={15} /> Download Semua
        </button>
      </div>

      {pool.length === 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Undangan ini belum punya foto di section Gallery (atau Cover Image), jadi slide masih kosong. Tambahkan foto lewat tab
          Edit lalu muat ulang halaman ini.
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-lume-line bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-lume-ink">1. Cover</span>
            <button
              type="button"
              onClick={() => downloadSlide("cover", 0)}
              disabled={!fonts}
              title="Download slide ini"
              className="rounded-md border border-lume-line p-1.5 hover:bg-lume-bg/60 disabled:opacity-40"
            >
              <Download size={14} />
            </button>
          </div>
          <SlideCanvas id="cover" kind="cover" photo={coverPhoto} photo2="" screenCover="" screenInner="" info={info} fonts={fonts} onCanvas={onCanvas} />
          <PhotoPicker label="Foto cover (dari Gallery)" pool={pool} value={coverPhoto} onChange={setCoverPhoto} />
        </div>

        <div className="space-y-3 rounded-xl border border-lume-line bg-white p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-lume-ink">2. Mockup Tema</span>
            <button
              type="button"
              onClick={() => downloadSlide("mockup", 1)}
              disabled={!fonts}
              title="Download slide ini"
              className="rounded-md border border-lume-line p-1.5 hover:bg-lume-bg/60 disabled:opacity-40"
            >
              <Download size={14} />
            </button>
          </div>
          <SlideCanvas
            id="mockup"
            kind="mockup"
            photo={phone1}
            photo2={phone2}
            screenCover={screens?.cover ?? ""}
            screenInner={screens?.inner ?? ""}
            info={info}
            fonts={fonts}
            onCanvas={onCanvas}
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Nama tema</p>
              <input value={themeName} onChange={(e) => setThemeName(e.target.value)} className="input" placeholder="Nama tema" />
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500">Penjelasan singkat tema</p>
              <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="input" placeholder="Elegant Minimalist" />
            </div>
          </div>

          <div className="space-y-2 rounded-lg border border-lume-line bg-lume-bg/40 p-3">
            <p className="text-sm font-medium text-lume-ink">Layout asli undangan client</p>
            <p className="text-xs text-gray-500">
              Ambil screenshot undangan client yang sebenarnya (layar cover dan satu layar bagian dalam) untuk dipasang di dua
              HP. Butuh sekitar 20-40 detik.
            </p>
            <div className="flex flex-wrap items-end gap-2">
              <div className="space-y-1">
                <p className="text-xs text-gray-500">Posisi scroll layar kedua (px)</p>
                <input
                  type="number"
                  min={0}
                  step={100}
                  value={scrollY}
                  onChange={(e) => setScrollY(Number(e.target.value) || 0)}
                  className="input w-32"
                />
              </div>
              <button
                type="button"
                onClick={captureScreens}
                disabled={capturing}
                className="inline-flex items-center gap-1.5 rounded-lg bg-lume-ink px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-50"
              >
                {capturing ? <Loader2 size={15} className="animate-spin" /> : <Camera size={15} />}
                {capturing ? "Mengambil..." : screens ? "Ambil Ulang" : "Ambil Screenshot Asli"}
              </button>
              {screens && (
                <button
                  type="button"
                  onClick={() => setScreens(null)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-lume-line bg-white px-3 py-2 text-sm hover:bg-lume-bg/60"
                >
                  <RotateCcw size={14} /> Pakai simulasi foto
                </button>
              )}
            </div>
            {captureError && <p className="text-xs text-red-600">{captureError}</p>}
          </div>

          {!screens && (
            <>
              <PhotoPicker label="Foto HP kiri (simulasi)" pool={pool} value={phone1} onChange={setPhone1} />
              <PhotoPicker label="Foto HP kanan (simulasi)" pool={pool} value={phone2} onChange={setPhone2} />
            </>
          )}
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-lume-line bg-white p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="font-medium text-lume-ink">Caption</h2>
          <button
            type="button"
            onClick={copyCaption}
            className="inline-flex items-center gap-1.5 rounded-lg border border-lume-line px-3 py-1.5 text-sm hover:bg-lume-bg/60"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? "Tersalin" : "Salin"}
          </button>
        </div>
        <textarea value={caption} onChange={(e) => setCaptionDraft(e.target.value)} rows={7} className="input" />
      </div>
    </div>
  );
}
