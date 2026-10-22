import { describe, it, expect } from "vitest";
import { isValidTransition } from "../src/lib/order-status";

describe("Order Status Transitions", () => {
  it("ควรอนุญาตให้เปลี่ยนจาก PENDING_PAYMENT เป็น PAID", () => {
    expect(isValidTransition("PENDING_PAYMENT", "PAID")).toBe(true);
  });

  it("ควรอนุญาตให้เปลี่ยนจาก PENDING_PAYMENT เป็น CANCELLED", () => {
    expect(isValidTransition("PENDING_PAYMENT", "CANCELLED")).toBe(true);
  });

  it("ไม่ควรอนุญาตให้เปลี่ยนจาก PENDING_PAYMENT ข้ามไป SHIPPING", () => {
    expect(isValidTransition("PENDING_PAYMENT", "SHIPPING")).toBe(false);
  });

  it("ไม่ควรอนุญาตให้เปลี่ยนจากสถานะที่สิ้นสุดแล้ว (COMPLETED, CANCELLED)", () => {
    expect(isValidTransition("COMPLETED", "SHIPPING")).toBe(false);
    expect(isValidTransition("CANCELLED", "PENDING_PAYMENT")).toBe(false);
  });
});
