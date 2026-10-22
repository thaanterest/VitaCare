"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function processPaymentAction(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบ", success: false };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId }
    });

    if (!order || order.userId !== session.user.id) {
      return { error: "ไม่พบคำสั่งซื้อ หรือไม่มีสิทธิ์เข้าถึง", success: false };
    }

    if (order.status !== "PENDING_PAYMENT") {
      return { error: "สถานะคำสั่งซื้อไม่สามารถชำระเงินได้", success: false };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: { status: "PAID" },
    });

    revalidatePath(`/account/orders/${order.orderNumber}`);
    revalidatePath(`/account/orders`);

    return { error: null, success: true };
  } catch (error) {
    console.error("Payment error:", error);
    return { error: "เกิดข้อผิดพลาดในการประมวลผล", success: false };
  }
}

export async function cancelOrderAction(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบ", success: false };
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order || order.userId !== session.user.id) {
      return { error: "ไม่พบคำสั่งซื้อ หรือไม่มีสิทธิ์เข้าถึง", success: false };
    }

    if (order.status !== "PENDING_PAYMENT") {
      return { error: "ไม่สามารถยกเลิกคำสั่งซื้อในสถานะปัจจุบันได้", success: false };
    }

    // A4: คืนสต็อกตอนลูกค้ายกเลิก
    await prisma.$transaction(async (tx) => {
      await tx.order.update({
        where: { id: orderId },
        data: { status: "CANCELLED" },
      });

      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { increment: item.quantity },
          },
        });
      }
    });

    revalidatePath(`/account/orders/${order.orderNumber}`);
    revalidatePath(`/account/orders`);

    return { error: null, success: true };
  } catch (error) {
    console.error("Cancel order error:", error);
    return { error: "เกิดข้อผิดพลาดในการยกเลิกคำสั่งซื้อ", success: false };
  }
}
