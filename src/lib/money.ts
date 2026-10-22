// ฟังก์ชันจัดรูปแบบเงินบาท
// ราคาเก็บเป็นสตางค์ (จำนวนเต็ม) ในฐานข้อมูล

/**
 * แปลงสตางค์เป็นบาท
 * @example satangToBaht(15000) → 150
 */
export function satangToBaht(satang: number): number {
  return satang / 100;
}

/**
 * แปลงบาทเป็นสตางค์
 * @example bahtToSatang(150) → 15000
 */
export function bahtToSatang(baht: number): number {
  return Math.round(baht * 100);
}

/**
 * จัดรูปแบบเงินบาทจากค่าสตางค์
 * @example formatPrice(15000) → "150.00"
 * @example formatPrice(15050) → "150.50"
 */
export function formatPrice(satang: number): string {
  return satangToBaht(satang).toLocaleString("th-TH", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/**
 * จัดรูปแบบเงินบาทพร้อมสัญลักษณ์ ฿
 * @example formatPriceWithSymbol(15000) → "฿150.00"
 */
export function formatPriceWithSymbol(satang: number): string {
  return `฿${formatPrice(satang)}`;
}
