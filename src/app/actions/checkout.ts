"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { calculateShippingFee } from "@/lib/shipping";
import { CartItem } from "@/context/CartContext";

export async function processCheckout(
  prevState: unknown,
  formData: FormData
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบก่อนชำระเงิน", success: false, orderNumber: "" };
    }

    const userId = session.user.id;
    
    // Parse cart items
    const cartData = formData.get("cartItems")?.toString();
    if (!cartData) return { error: "ไม่พบข้อมูลตะกร้าสินค้า", success: false, orderNumber: "" };
    const items: CartItem[] = JSON.parse(cartData);

    if (items.length === 0) {
      return { error: "ตะกร้าสินค้าว่างเปล่า", success: false, orderNumber: "" };
    }

    // Parse Address
    const addressInfo = {
      recipientName: formData.get("recipientName")?.toString() || "",
      phone: formData.get("phone")?.toString() || "",
      line1: formData.get("line1")?.toString() || "",
      subdistrict: formData.get("subdistrict")?.toString() || "",
      district: formData.get("district")?.toString() || "",
      province: formData.get("province")?.toString() || "",
      postalCode: formData.get("postalCode")?.toString() || "",
    };

    if (!addressInfo.recipientName || !addressInfo.phone || !addressInfo.line1 || !addressInfo.postalCode) {
      return { error: "กรุณากรอกข้อมูลที่อยู่จัดส่งให้ครบถ้วน", success: false, orderNumber: "" };
    }

    const saveToAccount = formData.get("saveToAccount") === "true";
    if (saveToAccount && userId) {
      try {
        await prisma.address.create({
          data: {
            userId,
            ...addressInfo,
            isDefault: false,
          },
        });
      } catch (e) {
        console.error("Failed to save address to account:", e);
      }
    }

    // Generate Order Number VC-YYYYMMDD-XXXX (VitaCare)
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `VC-${dateStr}-${randomNum}`;

    // Execute in transaction
    const order = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        // หาข้อมูลสินค้าล่าสุด
        const product = await tx.product.findUnique({
          where: { id: item.productId }
        });

        if (!product || !product.isActive) {
          throw new Error(`สินค้าบางรายการเลิกจำหน่ายแล้ว กรุณาตรวจสอบตะกร้าของคุณ`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`สินค้า "${product.name}" มีจำนวนไม่เพียงพอ (เหลือ ${product.stock} ชิ้น)`);
        }

        // ตัดสต็อกแบบเงื่อนไขกันชน (Optimistic Concurrency Control)
        const updatedProduct = await tx.product.updateMany({
          where: { 
            id: product.id,
            stock: { gte: item.quantity } // ต้องมีสต็อกพอ
          },
          data: {
            stock: { decrement: item.quantity }
          }
        });

        if (updatedProduct.count === 0) {
          throw new Error(`สินค้า "${product.name}" ถูกสั่งซื้อโดยลูกค้ารายอื่นจนหมดแล้ว`);
        }

        const lineTotal = product.price * item.quantity;
        subtotal += lineTotal;

        orderItemsData.push({
          productId: product.id,
          productNameSnapshot: product.name,
          unitPriceSnapshot: product.price,
          quantity: item.quantity,
          lineTotal,
        });
      }

      const shippingFee = calculateShippingFee(subtotal);
      const total = subtotal + shippingFee;

      // สร้างออเดอร์
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId,
          status: "PENDING_PAYMENT",
          subtotal,
          shippingFee,
          total,
          shippingAddressSnapshot: JSON.stringify(addressInfo),
          items: {
            create: orderItemsData
          }
        }
      });

      return newOrder;
    });

    return { error: null, success: true, orderNumber: order.orderNumber };
  } catch (error: any) {
    console.error("Checkout error:", error);
    return { error: error.message || "เกิดข้อผิดพลาดในการประมวลผลคำสั่งซื้อ", success: false, orderNumber: "" };
  }
}
