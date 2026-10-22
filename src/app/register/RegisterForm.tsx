"use client";

import { useActionState, useEffect } from "react";
import { registerAction } from "@/app/actions/register";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(registerAction, {
    error: null,
    success: false,
  });

  useEffect(() => {
    if (state.success) {
      // หลังจากสมัครเสร็จ ให้ Redirect ไปหน้า Login
      router.push("/login?registered=true");
    }
  }, [state.success, router]);

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-700">
          ชื่อ-นามสกุล
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium text-gray-700">
          รหัสผ่าน
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          placeholder="อย่างน้อย 8 ตัวอักษร"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
          ยืนยันรหัสผ่าน
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-6 w-full rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:bg-primary-700 active:scale-95 disabled:opacity-70 disabled:hover:bg-primary-600 disabled:active:scale-100"
      >
        {isPending ? "กำลังสมัครสมาชิก..." : "สมัครสมาชิก"}
      </button>

      <div className="mt-4 text-center text-sm text-gray-600">
        มีบัญชีอยู่แล้ว?{" "}
        <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
          เข้าสู่ระบบ
        </Link>
      </div>
    </form>
  );
}