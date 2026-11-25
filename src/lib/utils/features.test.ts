import { describe, expect, it } from "vitest";
import { normalizeFeatures } from "./features";

describe("normalizeFeatures", () => {
  it("returns arrays of strings as is", () => {
    expect(normalizeFeatures(["a", "b"])).toEqual(["a", "b"]);
  });
  it("parses a JSON-encoded string array", () => {
    expect(normalizeFeatures('["Loading branded","RSVP"]')).toEqual(["Loading branded", "RSVP"]);
  });
  it("treats plain text as a single feature and anything else as empty", () => {
    expect(normalizeFeatures("Satu fitur")).toEqual(["Satu fitur"]);
    expect(normalizeFeatures(null)).toEqual([]);
    expect(normalizeFeatures({ a: 1 })).toEqual([]);
  });
});
