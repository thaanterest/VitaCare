"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "ชื่อต้องมีความยาวอย่างน้อย 2 ตัวอักษร"),
  email: z.string().email("อีเมลไม่ถูกต้อง"),
  password: z
    .string()
    .min(8, "รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร")
    .regex(/[a-zA-Z]/, "ต้องมีตัวอักษรภาษาอังกฤษ")
    .regex(/[0-9]/, "ต้องมีตัวเลข"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "รหัสผ่านไม่ตรงกัน",
  path: ["confirmPassword"],
});

export async function registerAction(
  prevState: { error: string | null; success: boolean } | undefined,
  formData: FormData
) {
  try {
    const data = Object.fromEntries(formData);
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { 
        error: validated.error.issues[0].message, 
        success: false 
      };
    }

    const { name, email, password } = validated.data;

    // ตรวจสอบอีเมลซ้ำ
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "อีเมลนี้ถูกใช้งานแล้ว", success: false };
    }

    // เข้ารหัสรหัสผ่าน (cost 10 เป็นอย่างน้อย)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // สร้าง User (บังคับ Role = CUSTOMER)
    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "CUSTOMER", // ห้ามรับ role จาก client เด็ดขาด
      },
    });

    return { error: null, success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง", success: false };
  }
}
