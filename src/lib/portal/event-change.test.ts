import { describe, it, expect, afterEach } from "vitest";
import { isAutoApproveEnabled, decideChangeRequestStatus, shouldApplyImmediately } from "./event-change";

describe("event change request config", () => {
  const original = process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS;
  afterEach(() => {
    process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS = original;
  });

  it("defaults to true when unset", () => {
    delete process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS;
    expect(isAutoApproveEnabled()).toBe(true);
  });

  it("is false when explicitly set to 'false'", () => {
    process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS = "false";
    expect(isAutoApproveEnabled()).toBe(false);
  });

  it("is false when set to '0'", () => {
    process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS = "0";
    expect(isAutoApproveEnabled()).toBe(false);
  });

  it("is true for any other value", () => {
    process.env.PORTAL_AUTO_APPROVE_EVENT_EDITS = "true";
    expect(isAutoApproveEnabled()).toBe(true);
  });

  it("auto-approve on: applies immediately and logs as approved", () => {
    expect(decideChangeRequestStatus(true)).toBe("approved");
    expect(shouldApplyImmediately(true)).toBe(true);
  });

  it("auto-approve off: held as pending, not applied", () => {
    expect(decideChangeRequestStatus(false)).toBe("pending");
    expect(shouldApplyImmediately(false)).toBe(false);
  });
});
