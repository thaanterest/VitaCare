import { describe, it, expect } from "vitest";
import { calculateShippingFee, getAmountToFreeShipping } from "../src/lib/shipping";

describe("Shipping Logic", () => {
  it("ควรคิดค่าส่ง 50 บาท (5000 สตางค์) ถ้ายอดรวมน้อยกว่า 500 บาท", () => {
    expect(calculateShippingFee(49900)).toBe(5000);
    expect(calculateShippingFee(0)).toBe(5000);
  });

  it("ควรจัดส่งฟรี (0 บาท) ถ้ายอดรวม 500 บาทขึ้นไป", () => {
    expect(calculateShippingFee(50000)).toBe(0);
    expect(calculateShippingFee(150000)).toBe(0);
  });

  it("ควรคำนวณยอดที่ต้องซื้อเพิ่มเพื่อส่งฟรีได้ถูกต้อง", () => {
    expect(getAmountToFreeShipping(40000)).toBe(10000);
    expect(getAmountToFreeShipping(50000)).toBe(0);
    expect(getAmountToFreeShipping(60000)).toBe(0);
  });
});
