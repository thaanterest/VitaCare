"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleFillCustomer = () => {
    setEmail("customer@vitacare.dev");
    setPassword("Customer@1234");
    setErrorMessage(null);
  };

  const handleFillAdmin = () => {
    setEmail("admin@vitacare.dev");
    setPassword("Admin@1234");
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);

    let cleanEmail = email.trim().toLowerCase();
    if (cleanEmail === "customer") cleanEmail = "customer@vitacare.dev";
    if (cleanEmail === "admin") cleanEmail = "admin@vitacare.dev";
    const cleanPassword = password.trim();

    try {
      const res = await signIn("credentials", {
        email: cleanEmail,
        password: cleanPassword,
        redirect: false,
      });

      if (!res || res.error) {
        setErrorMessage("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
        setIsPending(false);
        return;
      }

      // เข้าสู่ระบบสำเร็จ -> กำหนดหน้าปลายทาง
      let target = callbackUrl;
      if (!target || target === "/login" || target === "/account") {
        if (cleanEmail.includes("admin")) {
          target = "/admin";
        } else {
          // ลูกค้าจะเด้งกลับหน้าแรกเสมอตามต้องการ
          target = "/";
        }
      }

      // ใช้ window.location.href เพื่อโหลดหน้าเว็บใหม่เต็มรูปแบบ
      // ทำให้ RootLayout ดึง session จาก cookie ล่าสุดทันที โดยไม่ต้องกด reload เอง
      window.location.href = target;
    } catch {
      window.location.href = "/";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {justRegistered && !errorMessage && (
        <div className="rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 border border-emerald-100 flex items-center gap-2">
          <span>✓</span>
          <span>สมัครสมาชิกสำเร็จแล้ว! กรุณาเข้าสู่ระบบ</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl bg-red-50 p-3 text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
          <span>⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* ปุ่มด่วนสำหรับทดสอบระบบ */}
      <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-xs">
        <div className="mb-2 font-semibold text-emerald-900 flex items-center justify-between">
          <span>⚡ เลือกบัญชีทดสอบ (คลิกเพื่อกรอกอัตโนมัติ):</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleFillCustomer}
            className="flex flex-col items-start rounded-lg border border-emerald-200 bg-white p-2 text-left shadow-sm transition hover:border-emerald-500 hover:bg-emerald-50 active:scale-95"
          >
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              👤 ลูกค้า (Customer)
            </span>
            <span className="text-[10px] text-gray-500 truncate w-full">customer@vitacare.dev</span>
            <span className="text-[10px] text-gray-400 font-mono">Customer@1234</span>
          </button>

          <button
            type="button"
            onClick={handleFillAdmin}
            className="flex flex-col items-start rounded-lg border border-amber-200 bg-white p-2 text-left shadow-sm transition hover:border-amber-500 hover:bg-amber-50 active:scale-95"
          >
            <span className="font-bold text-amber-700 flex items-center gap-1">
              🛡️ แอดมิน (Admin)
            </span>
            <span className="text-[10px] text-gray-500 truncate w-full">admin@vitacare.dev</span>
            <span className="text-[10px] text-gray-400 font-mono">Admin@1234</span>
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          อีเมล
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
          placeholder="your@email.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-sm font-medium text-gray-700"
        >
          รหัสผ่าน
        </label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 pr-12 text-sm transition focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100"
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-gray-400 hover:text-gray-600"
            aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
          >
            {showPassword ? "ซ่อน" : "แสดง"}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-98 disabled:opacity-70 disabled:hover:bg-emerald-600"
      >
        {isPending ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
      </button>
    </form>
  );
}
