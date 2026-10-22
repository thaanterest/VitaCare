"use client";

import { useState } from "react";
import { processPaymentAction } from "@/app/actions/payment";

export default function PaymentButton({ orderId }: { orderId: string, orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePayment = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await processPaymentAction(orderId);
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการประมวลผล");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      <button
        onClick={handlePayment}
        disabled={loading}
        className="w-full flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-blue-700 active:scale-95 disabled:bg-gray-400 disabled:active:scale-100 transition-all"
      >
        {loading ? "กำลังประมวลผล..." : "ชำระเงิน (จำลอง)"}
      </button>
      <p className="text-xs text-gray-500 text-center">
        ปุ่มนี้จำลองการชำระเงินสำเร็จ และจะเปลี่ยนสถานะออเดอร์เป็น &quot;ชำระเงินแล้ว&quot;
      </p>
    </div>
  );
}
