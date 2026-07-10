import { describe, it, expect } from "vitest";
import { isBotUserAgent } from "./bot-detect";

describe("isBotUserAgent", () => {
  it("flags known link-preview crawlers", () => {
    expect(isBotUserAgent("WhatsApp/2.23.20.0")).toBe(true);
    expect(isBotUserAgent("facebookexternalhit/1.1")).toBe(true);
    expect(isBotUserAgent("Twitterbot/1.0")).toBe(true);
    expect(isBotUserAgent("TelegramBot (like TwitterBot)")).toBe(true);
    expect(isBotUserAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(true);
  });

  it("does not flag a normal mobile browser", () => {
    expect(
      isBotUserAgent(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1"
      )
    ).toBe(false);
  });

  it("returns false for a null user-agent", () => {
    expect(isBotUserAgent(null)).toBe(false);
  });
});
