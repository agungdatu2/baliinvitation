import { describe, expect, it } from "vitest";
import { ADDON_PRICES, calcTotalPrice, AddonFlags } from "./addons";

const none: AddonFlags = { isAddon: false, coverVideoAddon: false, extraGalleryAddon: false, bilingualEnabled: false, neverExpires: false };

describe("calcTotalPrice", () => {
  it("returns null with no package and no add-ons", () => {
    expect(calcTotalPrice(null, none)).toBeNull();
  });

  it("returns the package price when no add-ons are checked", () => {
    expect(calcTotalPrice(349000, none)).toBe(349000);
  });

  it("adds each checked add-on to the package price", () => {
    expect(calcTotalPrice(349000, { ...none, coverVideoAddon: true, bilingualEnabled: true })).toBe(
      349000 + ADDON_PRICES.coverVideo + ADDON_PRICES.bilingual
    );
  });

  it("charges only add-on prices for an add-on invitation, ignoring the package", () => {
    expect(calcTotalPrice(349000, { ...none, isAddon: true })).toBe(ADDON_PRICES.eventSession);
    expect(calcTotalPrice(349000, { ...none, isAddon: true, extraGalleryAddon: true })).toBe(
      ADDON_PRICES.eventSession + ADDON_PRICES.galleryQuota
    );
  });

  it("charges add-ons alone when there is no package", () => {
    expect(calcTotalPrice(null, { ...none, neverExpires: true })).toBe(ADDON_PRICES.lifetime);
  });
});
