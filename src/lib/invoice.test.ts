import { describe, expect, it } from "vitest";
import { buildInvoice, getPaymentState, invoiceNumber, InvoiceSource } from "./invoice";

const base: InvoiceSource = {
  id: "cmv0nw1bp0005kw8kn22y8cmf",
  createdAt: new Date("2026-10-09T03:00:00Z"),
  isAddon: false,
  coverVideoAddon: false,
  extraGalleryAddon: false,
  bilingualEnabled: false,
  neverExpires: false,
  totalPrice: 349000,
  package: { name: "Gold", price: 349000 },
  templateName: "Reverie",
  payments: [],
};

describe("buildInvoice", () => {
  it("lists the package and balances to the total", () => {
    const inv = buildInvoice(base);
    expect(inv.items).toHaveLength(1);
    expect(inv.total).toBe(349000);
    expect(inv.adjustment).toBe(0);
    expect(inv.balance).toBe(349000);
    expect(inv.status).toBe("unpaid");
  });

  it("adds add-on lines and tracks partial payments", () => {
    const inv = buildInvoice({
      ...base,
      bilingualEnabled: true,
      totalPrice: 449000,
      payments: [{ id: "p1", amount: 100000, paidAt: new Date("2026-10-10T00:00:00Z"), note: null }],
    });
    expect(inv.items.map((i) => i.description)).toEqual(["Paket Gold", "Undangan multi-bahasa (ID/EN)"]);
    expect(inv.paid).toBe(100000);
    expect(inv.balance).toBe(349000);
    expect(inv.status).toBe("partial");
  });

  it("omits the package for an add-on invitation", () => {
    const inv = buildInvoice({ ...base, isAddon: true, totalPrice: 100000 });
    expect(inv.items.map((i) => i.description)).toEqual(["Tambahan sesi acara / 2 link jadwal berbeda"]);
    expect(inv.adjustment).toBe(0);
  });

  it("shows the difference as an adjustment when the stored total differs", () => {
    const inv = buildInvoice({ ...base, totalPrice: 300000 });
    expect(inv.adjustment).toBe(-49000);
    expect(inv.total).toBe(300000);
  });

  it("marks a fully paid invoice as paid", () => {
    const inv = buildInvoice({ ...base, payments: [{ id: "p1", amount: 349000, paidAt: new Date(), note: null }] });
    expect(inv.status).toBe("paid");
    expect(inv.balance).toBe(0);
  });
});

describe("helpers", () => {
  it("builds a stable invoice number from the Bali-time creation date", () => {
    expect(invoiceNumber(base.id, base.createdAt)).toBe("INV-20261009-8CMF");
  });
  it("returns none for zero total", () => {
    expect(getPaymentState(0, 0)).toBe("none");
  });
});
