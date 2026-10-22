// กฎการคำนวณค่าจัดส่ง
// ราคาเก็บเป็นสตางค์

const FREE_SHIPPING_THRESHOLD = 50000; // ส่งฟรีเมื่อซื้อครบ 500.00 บาท (50,000 สตางค์)
const FLAT_SHIPPING_FEE = 5000; // ค่าจัดส่งปกติ 50.00 บาท (5,000 สตางค์)

/**
 * คำนวณค่าจัดส่งจากยอดรวม (สตางค์)
 * @param subtotal ยอดรวมสินค้า (สตางค์)
 * @returns ค่าจัดส่ง (สตางค์)
 */
export function calculateShippingFee(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0; // ส่งฟรี
  }
  return FLAT_SHIPPING_FEE;
}

/**
 * ดึงค่ายอดที่ต้องซื้อเพิ่มเพื่อได้จัดส่งฟรี (สตางค์)
 */
export function getAmountToFreeShipping(subtotal: number): number {
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - subtotal;
}
