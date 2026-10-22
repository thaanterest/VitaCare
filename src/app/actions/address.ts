"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUserAddresses() {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function createAddressAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    const recipientName = formData.get("recipientName")?.toString()?.trim();
    const phone = formData.get("phone")?.toString()?.trim();
    const line1 = formData.get("line1")?.toString()?.trim();
    const subdistrict = formData.get("subdistrict")?.toString()?.trim() || "";
    const district = formData.get("district")?.toString()?.trim() || "";
    const province = formData.get("province")?.toString()?.trim() || "";
    const postalCode = formData.get("postalCode")?.toString()?.trim();
    const isDefault = formData.get("isDefault") === "true";

    if (!recipientName || !phone || !line1 || !postalCode) {
      return { success: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
    }

    const existingCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    const shouldBeDefault = isDefault || existingCount === 0;

    if (shouldBeDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: session.user.id,
        recipientName,
        phone,
        line1,
        subdistrict,
        district,
        province,
        postalCode,
        isDefault: shouldBeDefault,
      },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true, address: newAddress };
  } catch (err: any) {
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการบันทึกที่อยู่" };
  }
}

export async function updateAddressAction(id: string, formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    const recipientName = formData.get("recipientName")?.toString()?.trim();
    const phone = formData.get("phone")?.toString()?.trim();
    const line1 = formData.get("line1")?.toString()?.trim();
    const subdistrict = formData.get("subdistrict")?.toString()?.trim() || "";
    const district = formData.get("district")?.toString()?.trim() || "";
    const province = formData.get("province")?.toString()?.trim() || "";
    const postalCode = formData.get("postalCode")?.toString()?.trim();
    const isDefault = formData.get("isDefault") === "true";

    if (!recipientName || !phone || !line1 || !postalCode) {
      return { success: false, error: "กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน" };
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.updateMany({
      where: { id, userId: session.user.id },
      data: {
        recipientName,
        phone,
        line1,
        subdistrict,
        district,
        province,
        postalCode,
        ...(isDefault ? { isDefault: true } : {}),
      },
    });

    if (updated.count === 0) {
      return { success: false, error: "ไม่พบที่อยู่ที่ต้องการแก้ไข" };
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการแก้ไขที่อยู่" };
  }
}

export async function deleteAddressAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    await prisma.address.deleteMany({
      where: { id, userId: session.user.id },
    });

    // ถ้าที่อยู่ที่ลบไปเป็น default ให้ตั้งที่อยู่อื่นที่เหลือเป็น default
    const remaining = await prisma.address.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
    if (remaining) {
      await prisma.address.update({
        where: { id: remaining.id },
        data: { isDefault: true },
      });
    }

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "เกิดข้อผิดพลาดในการลบที่อยู่" };
  }
}

export async function setDefaultAddressAction(id: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "กรุณาเข้าสู่ระบบก่อนดำเนินการ" };
    }

    await prisma.address.updateMany({
      where: { userId: session.user.id },
      data: { isDefault: false },
    });

    await prisma.address.updateMany({
      where: { id, userId: session.user.id },
      data: { isDefault: true },
    });

    revalidatePath("/account/addresses");
    revalidatePath("/checkout");
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "เกิดข้อผิดพลาด" };
  }
}
