import { describe, expect, it } from "vitest";

import { addVat, formatPence } from "./format";

describe("formatPence", () => {
  it("formats pence as pounds", () => {
    expect(formatPence(12345)).toBe("£123.45");
    expect(formatPence(0)).toBe("£0.00");
  });
});

describe("addVat", () => {
  it("adds VAT and rounds to the penny", () => {
    expect(addVat(1000, 20)).toBe(1200);
    expect(addVat(999, 20)).toBe(1199);
    expect(addVat(1000, 0)).toBe(1000);
  });
});
