// Link-preview crawlers (WhatsApp, Facebook, Twitter, Telegram, dst.) fetch the page
// to render an OG preview the instant a link is shared — that's not a human "open" and
// must not flip a guest's status or count as a tracked view.
const BOT_PATTERNS = [
  /whatsapp/i,
  /facebookexternalhit/i,
  /facebot/i,
  /twitterbot/i,
  /telegrambot/i,
  /linkedinbot/i,
  /slackbot/i,
  /discordbot/i,
  /googlebot/i,
  /bingbot/i,
  /bot|crawler|spider|preview/i,
];

export function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false;
  return BOT_PATTERNS.some((p) => p.test(userAgent));
}
