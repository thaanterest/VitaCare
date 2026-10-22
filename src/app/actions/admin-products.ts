"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

// สคีมาตรวจสอบข้อมูลสินค้า
const productSchema = z.object({
  name: z.string().min(2, "ชื่อสินค้าต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  slug: z.string().min(2, "Slug ต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  description: z.string().min(1, "กรุณากรอกรายละเอียดสินค้า"),
  price: z.coerce.number().int().min(1, "ราคาต้องมากกว่า 0 (สตางค์)"),
  stock: z.coerce.number().int().min(0, "สต็อกต้องไม่ติดลบ"),
  lowStockThreshold: z.coerce.number().int().min(0, "ค่าแจ้งเตือนสต็อกต้องไม่ติดลบ"),
  categoryId: z.string().min(1, "กรุณาเลือกหมวดหมู่"),
  isActive: z.enum(["true", "false"]).transform((val) => val === "true"),
});

// ตรวจสอบสิทธิ์ Admin
async function requireAdmin() {
  const session = await auth();
  if (!session || session.user?.role !== "ADMIN") {
    throw new Error("ไม่มีสิทธิ์เข้าถึง");
  }
}

// อัปโหลดรูป
async function saveImage(file: File): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uuid = crypto.randomUUID();
  const ext = file.name.split(".").pop()?.toLowerCase();
  
  if (!["jpg", "jpeg", "png", "webp"].includes(ext || "")) {
    throw new Error("รองรับเฉพาะไฟล์ .jpg, .png, .webp เท่านั้น");
  }

  if (file.size > 2 * 1024 * 1024) {
    throw new Error("ขนาดไฟล์ต้องไม่เกิน 2MB");
  }

  const filename = `${uuid}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  
  // ตรวจสอบและสร้างโฟลเดอร์ถ้าไม่มี
  await fs.mkdir(uploadDir, { recursive: true });
  
  const filepath = path.join(uploadDir, filename);
  await fs.writeFile(filepath, buffer);
  
  return `/uploads/${filename}`;
}

export async function createProductAction(prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const data = Object.fromEntries(formData);
    const validated = productSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.issues[0].message, success: false };
    }

    const imageFile = formData.get("image") as File;
    if (!imageFile || imageFile.size === 0) {
      return { error: "กรุณาอัปโหลดรูปภาพ", success: false };
    }

    const imageUrl = await saveImage(imageFile);

    // เช็ค slug ซ้ำ
    const existing = await prisma.product.findUnique({ where: { slug: validated.data.slug } });
    if (existing) {
      return { error: "URL Slug นี้มีอยู่แล้ว กรุณาเปลี่ยน", success: false };
    }

    await prisma.product.create({
      data: {
        ...validated.data,
        imageUrl,
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { error: null, success: true, redirect: true };
  } catch (error: any) {
    console.error("Create product error:", error);
    return { error: error.message || "เกิดข้อผิดพลาดในการสร้างสินค้า", success: false };
  }
}

export async function updateProductAction(id: string, prevState: any, formData: FormData) {
  try {
    await requireAdmin();

    const data = Object.fromEntries(formData);
    const validated = productSchema.safeParse(data);

    if (!validated.success) {
      return { error: validated.error.issues[0].message, success: false };
    }

    const updateData: any = { ...validated.data };

    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      updateData.imageUrl = await saveImage(imageFile);
    }

    // เช็ค slug ซ้ำกับ id อื่น
    const existing = await prisma.product.findFirst({
      where: { slug: validated.data.slug, NOT: { id } }
    });
    if (existing) {
      return { error: "URL Slug นี้มีอยู่แล้ว กรุณาเปลี่ยน", success: false };
    }

    await prisma.product.update({
      where: { id },
      data: updateData,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${validated.data.slug}`);
    return { error: null, success: true, redirect: true };
  } catch (error: any) {
    console.error("Update product error:", error);
    return { error: error.message || "เกิดข้อผิดพลาดในการแก้ไขสินค้า", success: false };
  }
}

export async function deleteProductAction(id: string) {
  try {
    await requireAdmin();

    // เช็คว่ามี OrderItem อ้างอิงหรือไม่
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId: id }
    });

    if (orderItemsCount > 0) {
      // Soft Delete: ปิดขายแทน
      await prisma.product.update({
        where: { id },
        data: { isActive: false }
      });
      revalidatePath("/admin/products");
      revalidatePath("/products");
      return { error: null, success: true, message: "สินค้านี้ถูกสั่งซื้อไปแล้ว จึงถูกปิดการขายแทนการลบถาวร" };
    }

    // Hard Delete
    await prisma.product.delete({ where: { id } });
    revalidatePath("/admin/products");
    revalidatePath("/products");
    return { error: null, success: true, message: "ลบสินค้าสำเร็จ" };
  } catch (error: any) {
    console.error("Delete product error:", error);
    return { error: "เกิดข้อผิดพลาดในการลบสินค้า", success: false };
  }
}

export async function quickUpdateStockAction(id: string, newStock: number) {
  try {
    await requireAdmin();
    
    if (newStock < 0) {
      return { error: "สต็อกต้องไม่ติดลบ", success: false };
    }

    await prisma.product.update({
      where: { id },
      data: { stock: newStock }
    });

    revalidatePath("/admin/products");
    return { error: null, success: true };
  } catch (error: any) {
    console.error("Update stock error:", error);
    return { error: "เกิดข้อผิดพลาดในการปรับสต็อก", success: false };
  }
}
