import { NextRequest, NextResponse } from "next/server";

// Proxy gambar untuk canvas generator postingan sosmed (admin-only lewat
// middleware: semua /api/* di luar daftar publik butuh login). Dibutuhkan
// karena canvas "tercemar" (tidak bisa di-export) kalau menggambar gambar
// cross-origin tanpa header CORS — lewat proxy ini gambar jadi same-origin.
const MAX_BYTES = 15 * 1024 * 1024;
const PRIVATE_HOST_RE = /^(localhost|127\.|10\.|192\.168\.|169\.254\.|172\.(1[6-9]|2\d|3[01])\.|0\.|\[?::1\]?$)/i;

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get("url");
  if (!raw) return NextResponse.json({ error: "url wajib diisi" }, { status: 400 });

  let target: URL;
  try {
    target = new URL(raw, req.nextUrl.origin);
  } catch {
    return NextResponse.json({ error: "URL tidak valid" }, { status: 400 });
  }
  if (target.protocol !== "https:" && target.protocol !== "http:") {
    return NextResponse.json({ error: "Hanya http/https" }, { status: 400 });
  }
  const sameOrigin = target.origin === req.nextUrl.origin;
  if (!sameOrigin && PRIVATE_HOST_RE.test(target.hostname)) {
    return NextResponse.json({ error: "Host tidak diizinkan" }, { status: 400 });
  }

  try {
    const res = await fetch(target.toString(), { signal: AbortSignal.timeout(15000) });
    if (!res.ok) return NextResponse.json({ error: `Gagal mengambil gambar (${res.status})` }, { status: 502 });
    const type = res.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) {
      return NextResponse.json({ error: "URL bukan gambar" }, { status: 415 });
    }
    const buf = await res.arrayBuffer();
    if (buf.byteLength > MAX_BYTES) {
      return NextResponse.json({ error: "Gambar terlalu besar (maks 15MB)" }, { status: 413 });
    }
    return new NextResponse(buf, {
      headers: { "Content-Type": type, "Cache-Control": "private, max-age=3600" },
    });
  } catch {
    return NextResponse.json({ error: "Gagal mengambil gambar" }, { status: 502 });
  }
}
