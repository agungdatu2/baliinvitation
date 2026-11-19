// Renderer postingan Instagram client — sengaja client-side (canvas) supaya foto
// webp/format apa pun yang bisa di-decode browser langsung jalan tanpa library
// gambar di server. Format meniru postingan client @baliinvitation: carousel
// 2 slide persegi (1080x1080) — slide 1 foto cover + nama, slide 2 mockup dua HP
// dengan nama tema.

export const SLIDE_W = 1080;
export const SLIDE_H = 1080;
// Instagram Story 9:16. Bagian atas/bawah (~250px) tertutup UI Instagram, jadi konten penting dijauhkan dari tepi.
export const STORY_H = 1920;

export type SlideKind = "cover" | "mockup";

export interface SlideSpec {
  id: string;
  kind: SlideKind;
  photo: string;
  photo2: string;
}

export interface SlideFonts {
  display: string;
  sans: string;
}

export interface PostInfo {
  label: string; // teks kecil di atas nama, mis. "THE WEDDING OF" (lihat lib/social/occasion.ts)
  nameLines: string[]; // nama besar di cover
  fullName: string; // nama utuh satu baris
  themeName: string;
  tagline: string;
  dateLabel: string;
}

export interface MockupImages {
  background: HTMLImageElement | null;
  photo1: HTMLImageElement | null;
  photo2: HTMLImageElement | null;
  screenCover: HTMLImageElement | null;
  screenInner: HTMLImageElement | null;
}

const imageCache = new Map<string, Promise<HTMLImageElement>>();

export function loadSlideImage(url: string): Promise<HTMLImageElement> {
  const cached = imageCache.get(url);
  if (cached) return cached;
  const p = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => {
      imageCache.delete(url);
      reject(new Error("Gagal memuat gambar"));
    };
    img.src = url.startsWith("data:") ? url : `/api/social/image?url=${encodeURIComponent(url)}`;
  });
  imageCache.set(url, p);
  return p;
}

type SpacedContext = CanvasRenderingContext2D & { letterSpacing: string };

function setSpacing(ctx: CanvasRenderingContext2D, px: number) {
  (ctx as SpacedContext).letterSpacing = `${px}px`;
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
  const dw = img.naturalWidth * scale;
  const dh = img.naturalHeight * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}

function roundedRectPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// Pecah teks per kata (greedy) supaya tiap baris muat di maxWidth.
function wrapWords(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const lines: string[] = [];
  let line = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Kecilkan font (sampai minSize) sampai teks muat di maxWidth; kembalikan ukuran akhir.
function fitFont(ctx: CanvasRenderingContext2D, text: string, make: (size: number) => string, size: number, minSize: number, maxWidth: number) {
  ctx.font = make(size);
  while (size > minSize && ctx.measureText(text).width > maxWidth) {
    size -= 1;
    ctx.font = make(size);
  }
  return size;
}

// Gambar logo transparan jadi putih penuh (setara filter brightness(0) invert(1)).
function drawWhiteLogo(ctx: CanvasRenderingContext2D, logo: HTMLImageElement, cx: number, top: number, width: number) {
  const height = (logo.naturalHeight / logo.naturalWidth) * width;
  const off = document.createElement("canvas");
  off.width = Math.ceil(width);
  off.height = Math.ceil(height);
  const octx = off.getContext("2d");
  if (!octx) return;
  octx.drawImage(logo, 0, 0, off.width, off.height);
  octx.globalCompositeOperation = "source-in";
  octx.fillStyle = "#ffffff";
  octx.fillRect(0, 0, off.width, off.height);
  ctx.drawImage(off, cx - width / 2, top, width, height);
}

export function drawCoverSlide(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | null,
  logo: HTMLImageElement | null,
  info: PostInfo,
  fonts: SlideFonts,
  h: number = SLIDE_H
) {
  const story = h > SLIDE_H;
  ctx.fillStyle = "#1c1814";
  ctx.fillRect(0, 0, SLIDE_W, h);
  if (img) drawImageCover(ctx, img, 0, 0, SLIDE_W, h);

  // Peredam gelap di bawah-kiri (tempat teks) dan tipis di atas (tempat logo).
  const bottom = ctx.createLinearGradient(0, h * 0.4, 0, h);
  bottom.addColorStop(0, "rgba(0,0,0,0)");
  bottom.addColorStop(1, "rgba(0,0,0,0.6)");
  ctx.fillStyle = bottom;
  ctx.fillRect(0, h * 0.4, SLIDE_W, h * 0.6);
  const topShade = story ? 420 : 240;
  const top = ctx.createLinearGradient(0, 0, 0, topShade);
  top.addColorStop(0, "rgba(0,0,0,0.35)");
  top.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = top;
  ctx.fillRect(0, 0, SLIDE_W, topShade);

  // Story: logo & teks diturunkan dari tepi supaya tidak tertutup UI Instagram.
  if (logo) drawWhiteLogo(ctx, logo, SLIDE_W / 2, story ? 230 : 64, story ? 260 : 230);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  const x = 80;
  const maxWidth = story ? 800 : 640;
  const bottomY = story ? h - 330 : h - 92;

  setSpacing(ctx, 0);
  const nameFont = (sz: number) => `300 ${sz}px ${fonts.display}`;
  const startSize = story ? 170 : 150;
  let size = startSize;
  let lines = info.nameLines;
  if (lines.length === 1) {
    // Satu nama panjang (penyelenggara/anak): wrap per kata, ukuran terbesar yang muat di <= 3 baris.
    const wrapWidth = story ? 860 : 720;
    for (size = startSize; size >= 84; size -= 6) {
      ctx.font = nameFont(size);
      const wrapped = wrapWords(ctx, lines[0], wrapWidth);
      if (wrapped.length <= 3) {
        lines = wrapped;
        break;
      }
    }
    if (lines.length === 1) {
      size = 84;
      ctx.font = nameFont(size);
      lines = wrapWords(ctx, lines[0], wrapWidth);
    }
  } else {
    ctx.font = nameFont(size);
    const widest = () => Math.max(...lines.map((l) => ctx.measureText(l).width));
    while (size > 80 && widest() > maxWidth) {
      size -= 6;
      ctx.font = nameFont(size);
    }
  }
  const brideY = bottomY; // baris nama terakhir
  const firstY = brideY - (lines.length - 1) * size * 0.9;
  lines.forEach((line, i) => ctx.fillText(line, x - 4, firstY + i * size * 0.9));

  setSpacing(ctx, 9);
  fitFont(ctx, info.label, (sz) => { ctx.letterSpacing = "9px"; return `400 ${sz}px ${fonts.sans}`; }, story ? 34 : 30, 18, SLIDE_W - x * 2);
  ctx.fillText(info.label, x, firstY - size * 0.72 - 30);
  setSpacing(ctx, 0);

  // Penanda "geser" kecil (>>>) hanya untuk carousel feed; Story tidak dipakai.
  if (story) return;
  ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  [0.35, 0.65, 1].forEach((alpha, i) => {
    const cx = 924 + i * 22;
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(cx, brideY - 38);
    ctx.lineTo(cx + 14, brideY - 20);
    ctx.lineTo(cx, brideY - 2);
    ctx.stroke();
  });
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  drawScreen: (sx: number, sy: number, sw: number, sh: number) => void,
  k = 1
) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 50 * k;
  ctx.shadowOffsetY = 28 * k;
  ctx.fillStyle = "#0b0b0b";
  roundedRectPath(ctx, x, y, w, h, 50 * k);
  ctx.fill();
  ctx.restore();

  const inset = 12 * k;
  const sx = x + inset;
  const sy = y + inset;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  ctx.save();
  roundedRectPath(ctx, sx, sy, sw, sh, 40 * k);
  ctx.clip();
  // Isi layar digambar di koordinat "HP standar" (lalu diskalakan k) supaya teks
  // simulasi ikut membesar/mengecil bersama ukuran HP.
  ctx.translate(sx, sy);
  ctx.scale(k, k);
  drawScreen(0, 0, sw / k, sh / k);
  ctx.restore();

  ctx.fillStyle = "#0b0b0b";
  roundedRectPath(ctx, x + w / 2 - 48 * k, y + inset, 96 * k, 24 * k, 12 * k);
  ctx.fill();
}

export const MOCKUP_BACKGROUND = "/social/mockup-bg.jpg";

// "Black & Gold" -> ["BLACK &", "GOLD"]; maksimal 2 baris, "&" ikut kata sebelumnya.
function themeTitleLines(name: string): string[] {
  const tokens: string[] = [];
  for (const w of name.toUpperCase().split(/\s+/).filter(Boolean)) {
    if (w === "&" && tokens.length) tokens[tokens.length - 1] += " &";
    else tokens.push(w);
  }
  if (tokens.length <= 2) return tokens;
  const mid = Math.ceil(tokens.length / 2);
  return [tokens.slice(0, mid).join(" "), tokens.slice(mid).join(" ")];
}

export function drawMockupSlide(
  ctx: CanvasRenderingContext2D,
  images: MockupImages,
  info: PostInfo,
  fonts: SlideFonts,
  h: number = SLIDE_H
) {
  const story = h > SLIDE_H;
  if (images.background) {
    drawImageCover(ctx, images.background, 0, 0, SLIDE_W, h);
  } else {
    ctx.fillStyle = "#d9b9a6";
    ctx.fillRect(0, 0, SLIDE_W, h);
  }

  // Nama tema + penjelasan singkat (tagline).
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(60,45,25,0.28)";
  ctx.shadowBlur = 18;
  setSpacing(ctx, 6);
  const titleSize = story ? 104 : 90;
  const titleLead = story ? 106 : 92;
  ctx.font = `400 ${titleSize}px ${fonts.display}`;
  const words = themeTitleLines(info.themeName);
  const titleTop = (words.length > 1 ? 150 : 170) + (story ? 250 : 0);
  words.forEach((word, i) => ctx.fillText(word, SLIDE_W / 2, titleTop + i * titleLead));
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;

  const titleBottom = titleTop + (words.length - 1) * titleLead;
  if (info.tagline.trim()) {
    ctx.font = `500 22px ${fonts.sans}`;
    setSpacing(ctx, 7);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.shadowColor = "rgba(60,45,25,0.3)";
    ctx.shadowBlur = 8;
    ctx.fillText(info.tagline.toUpperCase(), SLIDE_W / 2, titleBottom + 48);
    ctx.shadowColor = "transparent";
    ctx.shadowBlur = 0;
  }
  setSpacing(ctx, 0);

  const top = titleBottom + 48 + 46;
  const phoneH = Math.min(story ? 800 : 596, (story ? h - 400 : 975) - top);
  const phoneW = (phoneH * 292) / 596;
  const gap = 46;
  const k = phoneW / 292;
  const left = (SLIDE_W - phoneW * 2 - gap) / 2;

  drawPhone(ctx, left, top, phoneW, phoneH, (sx, sy, sw, sh) => {
    if (images.screenCover) {
      drawImageCover(ctx, images.screenCover, sx, sy, sw, sh);
      return;
    }
    // Simulasi cover (dipakai kalau screenshot asli belum diambil).
    ctx.fillStyle = "#2a2118";
    ctx.fillRect(sx, sy, sw, sh);
    if (images.photo1) drawImageCover(ctx, images.photo1, sx, sy, sw, sh);
    const g = ctx.createLinearGradient(0, sy, 0, sy + sh);
    g.addColorStop(0, "rgba(0,0,0,0.5)");
    g.addColorStop(0.55, "rgba(0,0,0,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    setSpacing(ctx, 3);
    fitFont(ctx, info.label, (sz) => { ctx.letterSpacing = "3px"; return `400 ${sz}px ${fonts.sans}`; }, 12, 8, sw - 24);
    ctx.fillText(info.label, sx + sw / 2, sy + 92);
    setSpacing(ctx, 0);
    // Nama di tengah layar: baris eksplisit apa adanya, satu nama panjang di-wrap per kata.
    ctx.font = `300 italic 44px ${fonts.display}`;
    let nameSize = 44;
    let nameLines = info.nameLines;
    if (nameLines.length === 1) {
      for (nameSize = 44; nameSize >= 24; nameSize -= 2) {
        ctx.font = `300 italic ${nameSize}px ${fonts.display}`;
        const wrapped = wrapWords(ctx, nameLines[0], sw - 28);
        if (wrapped.length <= 3) {
          nameLines = wrapped;
          break;
        }
      }
    } else {
      nameSize = fitFont(ctx, nameLines.reduce((a, b) => (a.length > b.length ? a : b)), (sz) => `300 italic ${sz}px ${fonts.display}`, 44, 24, sw - 28);
    }
    ctx.font = `300 italic ${nameSize}px ${fonts.display}`;
    nameLines.forEach((line, i) => ctx.fillText(line, sx + sw / 2, sy + 140 + i * nameSize * 1.1));
    ctx.font = `400 12px ${fonts.sans}`;
    setSpacing(ctx, 2);
    ctx.fillText(info.dateLabel.toUpperCase(), sx + sw / 2, sy + sh - 40);
    setSpacing(ctx, 0);
  }, k);

  drawPhone(ctx, left + phoneW + gap, top, phoneW, phoneH, (sx, sy, sw, sh) => {
    if (images.screenInner) {
      drawImageCover(ctx, images.screenInner, sx, sy, sw, sh);
      return;
    }
    ctx.fillStyle = "#efe6d6";
    ctx.fillRect(sx, sy, sw, sh);
    if (images.photo2) drawImageCover(ctx, images.photo2, sx, sy + sh * 0.3, sw, sh * 0.7);
    ctx.fillStyle = "#ffffff";
    roundedRectPath(ctx, sx, sy - 40, sw, sh * 0.33 + 40, 36);
    ctx.fill();
    ctx.fillStyle = "#4a4137";
    ctx.textAlign = "center";
    setSpacing(ctx, 3);
    fitFont(ctx, info.label, (sz) => { ctx.letterSpacing = "3px"; return `400 ${sz}px ${fonts.sans}`; }, 11, 8, sw - 24);
    ctx.fillText(info.label, sx + sw / 2, sy + 62);
    setSpacing(ctx, 0);
    ctx.fillStyle = "#2b241d";
    fitFont(ctx, info.fullName, (sz) => `400 ${sz}px ${fonts.display}`, 30, 18, sw - 24);
    ctx.fillText(info.fullName, sx + sw / 2, sy + 104);
    ctx.fillStyle = "#6a5f52";
    ctx.font = `400 12px ${fonts.sans}`;
    ctx.fillText(info.dateLabel, sx + sw / 2, sy + 134);
  }, k);

  ctx.fillStyle = "#2b241d";
  ctx.textAlign = "center";
  ctx.font = `400 26px ${fonts.sans}`;
  setSpacing(ctx, 1);
  ctx.fillText("www.baliinvitation.com", SLIDE_W / 2, story ? h - 290 : 1018);
  setSpacing(ctx, 0);
  ctx.textAlign = "left";
}
