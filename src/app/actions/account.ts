"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updateProfileAction(
  prevState: unknown,
  formData: FormData
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบ", success: false };
    }

    const name = formData.get("name")?.toString();
    const phone = formData.get("phone")?.toString() || null;

    if (!name || name.length < 2) {
      return { error: "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร", success: false };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, phone },
    });

    revalidatePath("/account");
    return { error: null, success: true, message: "อัปเดตข้อมูลสำเร็จ" };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", success: false };
  }
}

export async function updatePasswordAction(
  prevState: unknown,
  formData: FormData
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "กรุณาเข้าสู่ระบบ", success: false };
    }

    const currentPassword = formData.get("currentPassword")?.toString();
    const newPassword = formData.get("newPassword")?.toString();
    const confirmPassword = formData.get("confirmPassword")?.toString();

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { error: "กรุณากรอกข้อมูลให้ครบถ้วน", success: false };
    }

    if (newPassword !== confirmPassword) {
      return { error: "รหัสผ่านใหม่ไม่ตรงกัน", success: false };
    }

    if (newPassword.length < 8 || !/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      return { error: "รหัสผ่านต้องมีความยาว 8 ตัวอักษร และมีทั้งตัวอักษรและตัวเลข", success: false };
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user || !user.passwordHash) {
      return { error: "ไม่พบบัญชีผู้ใช้", success: false };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      return { error: "รหัสผ่านปัจจุบันไม่ถูกต้อง", success: false };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash },
    });

    return { error: null, success: true, message: "เปลี่ยนรหัสผ่านสำเร็จ" };
  } catch (error) {
    console.error("Update password error:", error);
    return { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", success: false };
  }
}
