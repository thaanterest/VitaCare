"use client";

import { useState } from "react";
import { updateOrderStatusAction } from "@/app/actions/admin-orders";
import { ORDER_STATUS_LABELS, canTransitionTo } from "@/lib/order-status";

export default function StatusUpdateClient({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  
  const allStatuses = Object.keys(ORDER_STATUS_LABELS);
  
  const handleStatusChange = async (newStatus: string) => {
    if (!canTransitionTo(currentStatus, newStatus)) {
      alert("ไม่สามารถเปลี่ยนไปสถานะนี้ได้");
      return;
    }
    
    if (newStatus === "CANCELLED" && !confirm("แน่ใจหรือไม่ที่จะยกเลิกออเดอร์นี้? สต็อกสินค้าจะถูกคืนเข้าระบบทันที")) {
      return;
    }
    
    setLoading(true);
    const res = await updateOrderStatusAction(orderId, newStatus);
    if (!res.success) {
      alert(res.error);
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center justify-between">
      <h2 className="font-bold text-gray-900">อัปเดตสถานะ (Admin)</h2>
      
      <div className="flex gap-2">
        {allStatuses.map(status => {
          if (status === currentStatus) return null;
          
          const isAllowed = canTransitionTo(currentStatus, status);
          
          if (!isAllowed) return null; // แสดงเฉพาะที่เปลี่ยนได้

          return (
            <button
              key={status}
              disabled={loading}
              onClick={() => handleStatusChange(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                status === "CANCELLED" 
                  ? "bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
              }`}
            >
              เปลี่ยนเป็น: {ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS]}
            </button>
          );
        })}
        {currentStatus === "DELIVERED" || currentStatus === "CANCELLED" ? (
          <span className="text-sm text-gray-500 italic">ออเดอร์นี้สิ้นสุดแล้ว ไม่สามารถเปลี่ยนสถานะได้</span>
        ) : null}
      </div>
    </div>
  );
}
