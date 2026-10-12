"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, Download, ImageOff } from "lucide-react";
import {
  PostInfo,
  SLIDE_H,
  SLIDE_W,
  SlideFonts,
  SlideKind,
  drawCoverSlide,
  drawMockupSlide,
  loadSlideImage,
} from "@/lib/social/draw";

function SlideCanvas({
  id,
  kind,
  photo,
  photo2,
  info,
  fonts,
  onCanvas,
}: {
  id: string;
  kind: SlideKind;
  photo: string;
  photo2: string;
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
      const [a, b] = await Promise.all([load(photo), kind === "mockup" ? load(photo2) : Promise.resolve({ img: null, failed: false })]);
      if (cancelled) return;
      const ctx = ref.current?.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, SLIDE_W, SLIDE_H);
      if (kind === "cover") drawCoverSlide(ctx, a.img, info, fonts);
      else drawMockupSlide(ctx, a.img, b.img, info, fonts);
      setImageFailed(a.failed || b.failed);
    })();
    return () => {
      cancelled = true;
    };
  }, [kind, photo, photo2, info, fonts]);

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
  slug,
  groom,
  bride,
  themeName: initialThemeName,
  dateLabel,
  photos,
}: {
  slug: string;
  groom: string;
  bride: string;
  themeName: string;
  dateLabel: string;
  photos: string[];
}) {
  const pool = useMemo(() => Array.from(new Set(photos)), [photos]);
  const photoAt = (i: number) => (pool.length ? pool[i % pool.length] : "");
  const [coverPhoto, setCoverPhoto] = useState(() => photoAt(0));
  const [phone1, setPhone1] = useState(() => photoAt(1));
  const [phone2, setPhone2] = useState(() => photoAt(2));
  const [themeName, setThemeName] = useState(initialThemeName);
  const [captionDraft, setCaptionDraft] = useState<string | null>(null);
  const [fonts, setFonts] = useState<SlideFonts | null>(null);
  const [copied, setCopied] = useState(false);
  const canvases = useRef<Record<string, HTMLCanvasElement | null>>({});
  const displayProbe = useRef<HTMLSpanElement>(null);
  const sansProbe = useRef<HTMLSpanElement>(null);

  const info = useMemo<PostInfo>(() => ({ groom, bride, themeName, dateLabel }), [groom, bride, themeName, dateLabel]);

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
          <SlideCanvas id="cover" kind="cover" photo={coverPhoto} photo2="" info={info} fonts={fonts} onCanvas={onCanvas} />
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
          <SlideCanvas id="mockup" kind="mockup" photo={phone1} photo2={phone2} info={info} fonts={fonts} onCanvas={onCanvas} />
          <div className="space-y-1">
            <p className="text-xs text-gray-500">Nama tema</p>
            <input value={themeName} onChange={(e) => setThemeName(e.target.value)} className="input" placeholder="Nama tema" />
          </div>
          <PhotoPicker label="Foto HP kiri" pool={pool} value={phone1} onChange={setPhone1} />
          <PhotoPicker label="Foto HP kanan" pool={pool} value={phone2} onChange={setPhone2} />
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
