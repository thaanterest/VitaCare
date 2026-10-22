"use server";

import { signIn } from "@/lib/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/lib/prisma";

export async function loginAction(
  prevState: { error: string | null } | undefined,
  formData: FormData
) {
  try {
    let callbackUrl = formData.get("callbackUrl")?.toString() || "";
    const rawEmail = formData.get("email")?.toString() || "";
    let email = rawEmail.trim().toLowerCase();
    if (email === "customer") email = "customer@vitacare.dev";
    if (email === "admin") email = "admin@vitacare.dev";

    const password = formData.get("password")?.toString()?.trim() || "";

    if (email) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: { role: true },
      });

      if (!callbackUrl || callbackUrl === "/" || callbackUrl === "/login" || callbackUrl === "/account") {
        if (user?.role === "ADMIN") {
          callbackUrl = "/admin";
        } else {
          callbackUrl = "/";
        }
      }
    } else if (!callbackUrl || callbackUrl === "/" || callbackUrl === "/login" || callbackUrl === "/account") {
      callbackUrl = "/";
    }

    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl,
    });
    return { error: null };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" };
        default:
          return { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" };
      }
    }
    throw error; // ต้อง throw ต่อเพื่อให้ Next.js จัดการเรื่อง redirect
  }
}
