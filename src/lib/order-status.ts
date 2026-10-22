// สถานะคำสั่งซื้อและ transition ที่อนุญาต
// ใช้ไฟล์นี้เป็น single source of truth สำหรับสถานะทุกที่

export const ORDER_STATUSES = {
  PENDING_PAYMENT: "PENDING_PAYMENT",
  PAID: "PAID",
  SHIPPING: "SHIPPING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatus = (typeof ORDER_STATUSES)[keyof typeof ORDER_STATUSES];

// label ภาษาไทยสำหรับแสดงผล
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "รอชำระเงิน",
  PAID: "ชำระแล้ว",
  SHIPPING: "กำลังจัดส่ง",
  COMPLETED: "สำเร็จ",
  CANCELLED: "ยกเลิก",
};

// สีสำหรับ badge (Tailwind classes)
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  PAID: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-indigo-100 text-indigo-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-red-100 text-red-800",
};

// transition ที่อนุญาต: จาก status ไหน → ไป status ไหนได้บ้าง
const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  PENDING_PAYMENT: [ORDER_STATUSES.PAID, ORDER_STATUSES.CANCELLED],
  PAID: [ORDER_STATUSES.SHIPPING, ORDER_STATUSES.CANCELLED],
  SHIPPING: [ORDER_STATUSES.COMPLETED, ORDER_STATUSES.CANCELLED],
  COMPLETED: [], // สถานะสุดท้าย
  CANCELLED: [], // สถานะสุดท้าย
};

/**
 * ตรวจว่าการเปลี่ยนสถานะจาก from → to ถูกต้องหรือไม่
 */
export function isValidTransition(
  from: OrderStatus,
  to: OrderStatus
): boolean {
  return ALLOWED_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Alias สำหรับ isValidTransition (backward compat)
 */
export function canTransitionTo(from: string, to: string): boolean {
  if (!isOrderStatus(from) || !isOrderStatus(to)) return false;
  return isValidTransition(from, to);
}

/**
 * ดึงสถานะที่สามารถเปลี่ยนไปได้จากสถานะปัจจุบัน
 */
export function getNextStatuses(current: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[current] ?? [];
}

/**
 * ตรวจสอบว่า string เป็น OrderStatus ที่ถูกต้องหรือไม่
 */
export function isOrderStatus(value: string): value is OrderStatus {
  return Object.values(ORDER_STATUSES).includes(value as OrderStatus);
}
