"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { canTransitionTo } from "@/lib/order-status";

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  try {
    const session = await auth();
    if (!session || session.user?.role !== "ADMIN") {
      return { error: "ไม่มีสิทธิ์เข้าถึง", success: false };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return { error: "ไม่พบคำสั่งซื้อ", success: false };
    }

    if (!canTransitionTo(order.status, newStatus)) {
      return { error: `ไม่สามารถเปลี่ยนสถานะจาก ${order.status} เป็น ${newStatus} ได้`, success: false };
    }

    // A4: คืนสต็อกเวลายกเลิก
    await prisma.$transaction(async (tx) => {
      // 1. อัปเดตสถานะออเดอร์
      await tx.order.update({
        where: { id: orderId },
        data: { status: newStatus },
      });

      // 2. ถ้าเปลี่ยนเป็น CANCELLED ให้คืนสต็อก (ถ้าเคย CANCELLED ไปแล้วจะไม่เข้าเงื่อนไขนี้เพราะ transition logic ขวางไว้)
      if (newStatus === "CANCELLED") {
        for (const item of order.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: {
              stock: { increment: item.quantity },
            },
          });
        }
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin");
    return { error: null, success: true };
  } catch (error: any) {
    console.error("Update order status error:", error);
    return { error: "เกิดข้อผิดพลาดในการอัปเดตสถานะคำสั่งซื้อ", success: false };
  }
}
