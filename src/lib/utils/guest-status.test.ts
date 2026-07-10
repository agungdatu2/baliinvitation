import { describe, it, expect } from "vitest";
import { isForwardTransition, nextStatus } from "./guest-status";

describe("guest status transitions", () => {
  it("allows the normal forward path", () => {
    expect(isForwardTransition("pending", "sent")).toBe(true);
    expect(isForwardTransition("sent", "opened")).toBe(true);
    expect(isForwardTransition("opened", "responded")).toBe(true);
  });

  it("allows skipping ranks forward (e.g. pending -> responded)", () => {
    expect(isForwardTransition("pending", "responded")).toBe(true);
  });

  it("rejects moving backwards", () => {
    expect(isForwardTransition("responded", "opened")).toBe(false);
    expect(isForwardTransition("opened", "sent")).toBe(false);
    expect(isForwardTransition("sent", "pending")).toBe(false);
  });

  it("rejects staying at the same rank", () => {
    expect(isForwardTransition("opened", "opened")).toBe(false);
  });

  it("nextStatus keeps current value on a backwards/no-op attempt", () => {
    expect(nextStatus("responded", "opened")).toBe("responded");
    expect(nextStatus("responded", "responded")).toBe("responded");
  });

  it("nextStatus applies a genuine forward move", () => {
    expect(nextStatus("sent", "opened")).toBe("opened");
  });

  it("treats an unknown current status as rank 0 (pending)", () => {
    expect(isForwardTransition("", "sent")).toBe(true);
  });
});
