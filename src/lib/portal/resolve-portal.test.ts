import { describe, it, expect } from "vitest";
import { evaluatePortalAccess, PORTAL_EXPIRY_GRACE_DAYS } from "./resolve-portal";

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

describe("evaluatePortalAccess", () => {
  it("is invalid when no invitation matches the token", () => {
    expect(evaluatePortalAccess(null)).toBe("invalid");
  });

  it("is disabled when portalEnabled is false, even before expiry", () => {
    expect(evaluatePortalAccess({ portalEnabled: false, eventDate: daysFromNow(10) })).toBe("disabled");
  });

  it("is ok for an enabled portal with an upcoming event", () => {
    expect(evaluatePortalAccess({ portalEnabled: true, eventDate: daysFromNow(10) })).toBe("ok");
  });

  it("is ok just inside the grace window after the event", () => {
    expect(evaluatePortalAccess({ portalEnabled: true, eventDate: daysFromNow(-(PORTAL_EXPIRY_GRACE_DAYS - 1)) })).toBe(
      "ok"
    );
  });

  it("is expired once the grace window has passed", () => {
    expect(evaluatePortalAccess({ portalEnabled: true, eventDate: daysFromNow(-(PORTAL_EXPIRY_GRACE_DAYS + 1)) })).toBe(
      "expired"
    );
  });

  it("disabled takes priority over expired", () => {
    expect(evaluatePortalAccess({ portalEnabled: false, eventDate: daysFromNow(-100) })).toBe("disabled");
  });
});
