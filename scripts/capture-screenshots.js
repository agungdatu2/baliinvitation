const puppeteer = require("puppeteer-core");
const path = require("path");
const fs = require("fs");

const CHROME_PATH = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const OUT_DIR = path.join(__dirname, "..", "public", "landing", "thumbnails");
const THEMES = ["lume", "reverie", "muse"];

const VIEWPORTS = {
  phone: { width: 390, height: 844 },
  laptop: { width: 1440, height: 900 },
};

(async () => {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: "new" });

  for (const theme of THEMES) {
    // Warm-up pass: begitu foto background (Unsplash, dst) sudah pernah di-load
    // sekali, capture berikutnya untuk theme yang sama tidak perlu nunggu
    // network fetch lambat lagi (kena browser cache).
    const warmup = await browser.newPage();
    await warmup.goto(`http://localhost:3000/theme-preview/${theme}?intro=0`, { waitUntil: "domcontentloaded" });
    await new Promise((r) => setTimeout(r, 4000));
    await warmup.close();

    for (const [device, viewport] of Object.entries(VIEWPORTS)) {
      const page = await browser.newPage();
      await page.setViewport(viewport);
      await page.goto(`http://localhost:3000/theme-preview/${theme}?intro=0`, { waitUntil: "domcontentloaded" });
      await new Promise((r) => setTimeout(r, 2500));
      const outPath = path.join(OUT_DIR, `${theme}-${device}.png`);
      await page.screenshot({ path: outPath });
      console.log("Saved", outPath);
      await page.close();
    }
  }

  await browser.close();
})();
