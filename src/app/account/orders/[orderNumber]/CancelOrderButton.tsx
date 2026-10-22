"use client";

import { useState } from "react";
import { cancelOrderAction } from "@/app/actions/payment";

export default function CancelOrderButton({ orderId, orderNumber }: { orderId: string, orderNumber: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะยกเลิกคำสั่งซื้อนี้?")) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await cancelOrderAction(orderId);
      if (!result.success && result.error) {
        setError(result.error);
      }
    } catch {
      setError("เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-gray-100">
      {error && <div className="text-red-500 text-sm font-medium">{error}</div>}
      <button
        onClick={handleCancel}
        disabled={loading}
        className="w-full flex items-center justify-center rounded-xl bg-white border border-red-200 px-4 py-3 text-base font-medium text-red-600 shadow-sm hover:bg-red-50 active:scale-95 disabled:opacity-50 disabled:active:scale-100 transition-all"
      >
        {loading ? "กำลังยกเลิก..." : "ยกเลิกคำสั่งซื้อ"}
      </button>
    </div>
  );
}
