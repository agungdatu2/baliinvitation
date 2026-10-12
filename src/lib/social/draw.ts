// Renderer postingan Instagram client — sengaja client-side (canvas) supaya foto
// webp/format apa pun yang bisa di-decode browser langsung jalan tanpa library
// gambar di server. Format meniru postingan client @baliinvitation: carousel
// 2 slide persegi (1080x1080) — slide 1 foto cover + nama, slide 2 mockup dua HP
// dengan nama tema.

export const SLIDE_W = 1080;
export const SLIDE_H = 1080;

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
  groom: string;
  bride: string;
  themeName: string;
  dateLabel: string;
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
    img.src = `/api/social/image?url=${encodeURIComponent(url)}`;
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

export function drawCoverSlide(ctx: CanvasRenderingContext2D, img: HTMLImageElement | null, info: PostInfo, fonts: SlideFonts) {
  ctx.fillStyle = "#1c1814";
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
  if (img) drawImageCover(ctx, img, 0, 0, SLIDE_W, SLIDE_H);

  // Peredam gelap di kiri-atas supaya teks putih tetap terbaca di foto terang.
  const shade = ctx.createLinearGradient(0, 0, SLIDE_W * 0.9, SLIDE_H * 0.7);
  shade.addColorStop(0, "rgba(0,0,0,0.42)");
  shade.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = shade;
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);

  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "left";
  ctx.fillStyle = "#ffffff";
  const x = 80;
  const maxWidth = 640;

  ctx.font = `400 34px ${fonts.sans}`;
  setSpacing(ctx, 9);
  ctx.fillText("THE WEDDING OF", x, 170);

  setSpacing(ctx, 0);
  let size = 170;
  ctx.font = `300 ${size}px ${fonts.display}`;
  const widest = () => Math.max(ctx.measureText(`${info.groom} &`).width, ctx.measureText(info.bride).width);
  while (size > 80 && widest() > maxWidth) {
    size -= 6;
    ctx.font = `300 ${size}px ${fonts.display}`;
  }
  ctx.fillText(`${info.groom} &`, x - 4, 170 + size * 0.95);
  ctx.fillText(info.bride, x - 4, 170 + size * 1.85);

  // Penanda "geser" ke slide berikutnya (>>>), makin ke kanan makin terang.
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  [0.35, 0.65, 1].forEach((alpha, i) => {
    const cx = 880 + i * 38;
    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.beginPath();
    ctx.moveTo(cx, 940);
    ctx.lineTo(cx + 24, 975);
    ctx.lineTo(cx, 1010);
    ctx.stroke();
  });
}

function drawPhone(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  drawScreen: (sx: number, sy: number, sw: number, sh: number) => void
) {
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.35)";
  ctx.shadowBlur = 50;
  ctx.shadowOffsetY = 28;
  ctx.fillStyle = "#0b0b0b";
  roundedRectPath(ctx, x, y, w, h, 50);
  ctx.fill();
  ctx.restore();

  const inset = 12;
  const sx = x + inset;
  const sy = y + inset;
  const sw = w - inset * 2;
  const sh = h - inset * 2;
  ctx.save();
  roundedRectPath(ctx, sx, sy, sw, sh, 40);
  ctx.clip();
  drawScreen(sx, sy, sw, sh);
  ctx.restore();

  ctx.fillStyle = "#0b0b0b";
  roundedRectPath(ctx, x + w / 2 - 48, y + inset, 96, 24, 12);
  ctx.fill();
}

export function drawMockupSlide(
  ctx: CanvasRenderingContext2D,
  img1: HTMLImageElement | null,
  img2: HTMLImageElement | null,
  info: PostInfo,
  fonts: SlideFonts
) {
  // Latar krem lembut + sorot cahaya, lantai terang di bawah.
  const bg = ctx.createLinearGradient(0, 0, SLIDE_W, SLIDE_H);
  bg.addColorStop(0, "#cdbfa6");
  bg.addColorStop(1, "#e8dfce");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
  const glow = ctx.createRadialGradient(260, 120, 20, 260, 120, 620);
  glow.addColorStop(0, "rgba(255,255,255,0.55)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, SLIDE_W, SLIDE_H);
  const floor = ctx.createLinearGradient(0, 900, 0, SLIDE_H);
  floor.addColorStop(0, "#f2ede4");
  floor.addColorStop(1, "#e5ddcf");
  ctx.fillStyle = floor;
  ctx.fillRect(0, 900, SLIDE_W, SLIDE_H - 900);

  // Nama tema.
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = "center";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(60,45,25,0.25)";
  ctx.shadowBlur = 18;
  setSpacing(ctx, 6);
  ctx.font = `400 92px ${fonts.display}`;
  const words = info.themeName.toUpperCase().split(/\s+/).filter(Boolean).slice(0, 3);
  words.forEach((word, i) => ctx.fillText(word, SLIDE_W / 2, 150 + i * 96));
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  setSpacing(ctx, 0);

  const phoneW = 300;
  const phoneH = 610;
  const gap = 44;
  const left = (SLIDE_W - phoneW * 2 - gap) / 2;
  const top = words.length > 2 ? 400 : 330;

  // HP kiri: simulasi layar cover (foto penuh + nama + tanggal).
  drawPhone(ctx, left, top, phoneW, phoneH, (sx, sy, sw, sh) => {
    ctx.fillStyle = "#2a2118";
    ctx.fillRect(sx, sy, sw, sh);
    if (img1) drawImageCover(ctx, img1, sx, sy, sw, sh);
    const g = ctx.createLinearGradient(0, sy, 0, sy + sh);
    g.addColorStop(0, "rgba(0,0,0,0.5)");
    g.addColorStop(0.55, "rgba(0,0,0,0.05)");
    g.addColorStop(1, "rgba(0,0,0,0.55)");
    ctx.fillStyle = g;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = `400 12px ${fonts.sans}`;
    setSpacing(ctx, 3);
    ctx.fillText("THE WEDDING OF", sx + sw / 2, sy + 92);
    setSpacing(ctx, 0);
    ctx.font = `300 italic 44px ${fonts.display}`;
    ctx.fillText(info.groom, sx + sw / 2, sy + 140);
    ctx.font = `300 italic 26px ${fonts.display}`;
    ctx.fillText("&", sx + sw / 2, sy + 170);
    ctx.font = `300 italic 44px ${fonts.display}`;
    ctx.fillText(info.bride, sx + sw / 2, sy + 214);
    ctx.font = `400 12px ${fonts.sans}`;
    setSpacing(ctx, 2);
    ctx.fillText(info.dateLabel.toUpperCase(), sx + sw / 2, sy + sh - 40);
    setSpacing(ctx, 0);
  });

  // HP kanan: simulasi layar isi (kartu putih di atas + foto).
  drawPhone(ctx, left + phoneW + gap, top, phoneW, phoneH, (sx, sy, sw, sh) => {
    ctx.fillStyle = "#efe6d6";
    ctx.fillRect(sx, sy, sw, sh);
    if (img2) drawImageCover(ctx, img2, sx, sy + sh * 0.3, sw, sh * 0.7);
    ctx.fillStyle = "#ffffff";
    roundedRectPath(ctx, sx, sy - 40, sw, sh * 0.33 + 40, 36);
    ctx.fill();
    ctx.fillStyle = "#4a4137";
    ctx.textAlign = "center";
    ctx.font = `400 11px ${fonts.sans}`;
    setSpacing(ctx, 3);
    ctx.fillText("THE WEDDING OF", sx + sw / 2, sy + 62);
    setSpacing(ctx, 0);
    ctx.fillStyle = "#2b241d";
    ctx.font = `400 30px ${fonts.display}`;
    ctx.fillText(`${info.groom} & ${info.bride}`, sx + sw / 2, sy + 104);
    ctx.fillStyle = "#6a5f52";
    ctx.font = `400 12px ${fonts.sans}`;
    ctx.fillText(info.dateLabel, sx + sw / 2, sy + 134);
  });
  ctx.textAlign = "left";
}
