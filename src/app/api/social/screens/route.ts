import { existsSync } from "fs";
import { NextRequest, NextResponse } from "next/server";
import puppeteer, { Browser, Page } from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { prisma } from "@/lib/prisma";

// Memotret undangan client yang ASLI (layar HP 390x844) untuk dipasang di
// mockup HP postingan sosmed. Admin-only lewat middleware (/api/*). Halaman
// dibuka lewat ?portal_preview=<token> supaya draft/expired tetap bisa dibuka
// dan TIDAK terhitung sebagai view tamu.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const LOCAL_CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const VIEWPORT = { width: 390, height: 844, deviceScaleFactor: 2, isMobile: true, hasTouch: true };
const OPEN_BUTTON_RE = /^(let'?s open|open( invitation)?|buka( undangan)?|mulai|masuk)/i;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function launchBrowser(): Promise<Browser> {
  if (process.env.NODE_ENV !== "production" && existsSync(LOCAL_CHROME)) {
    return puppeteer.launch({ executablePath: LOCAL_CHROME, headless: true });
  }
  return puppeteer.launch({
    args: await puppeteer.defaultArgs({ args: chromium.args, headless: "shell" }),
    executablePath: await chromium.executablePath(),
    headless: "shell",
  });
}

async function shot(page: Page): Promise<string> {
  const data = await page.screenshot({ type: "jpeg", quality: 85, encoding: "base64" });
  return `data:image/jpeg;base64,${data}`;
}

async function clickOpenButton(page: Page): Promise<boolean> {
  return page.evaluate((reSource: string) => {
    const re = new RegExp(reSource, "i");
    const candidates = Array.from(document.querySelectorAll<HTMLElement>("button, a"));
    const target = candidates.find((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 0 && rect.height > 0 && re.test((el.textContent ?? "").trim());
    });
    if (!target) return false;
    target.click();
    return true;
  }, OPEN_BUTTON_RE.source);
}

export async function POST(req: NextRequest) {
  const { id, scrollY } = (await req.json().catch(() => ({}))) as { id?: string; scrollY?: number };
  if (!id) return NextResponse.json({ error: "id wajib diisi" }, { status: 400 });

  const inv = await prisma.invitation.findUnique({ where: { id }, select: { slug: true, portalToken: true } });
  if (!inv) return NextResponse.json({ error: "Undangan tidak ditemukan" }, { status: 404 });

  const targetY = Math.min(Math.max(Number(scrollY) || 1600, 0), 20000);
  const url = `${req.nextUrl.origin}/${inv.slug}?portal_preview=${inv.portalToken}&intro=0&to=${encodeURIComponent("Tamu Undangan")}`;

  let browser: Browser | null = null;
  try {
    browser = await launchBrowser();
    const page = await browser.newPage();
    await page.setViewport(VIEWPORT);
    await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 }).catch(() => undefined);
    await sleep(3000);
    const cover = await shot(page);

    const opened = await clickOpenButton(page);
    await sleep(opened ? 3500 : 1000);
    await page.evaluate((y: number) => window.scrollTo(0, y), targetY);
    await sleep(2500);
    const inner = await shot(page);

    return NextResponse.json({ cover, inner, opened });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Gagal mengambil screenshot" }, { status: 500 });
  } finally {
    await browser?.close().catch(() => undefined);
  }
}
