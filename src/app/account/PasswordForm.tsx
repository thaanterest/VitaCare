"use client";

import { useActionState, useEffect, useState } from "react";
import { updatePasswordAction } from "@/app/actions/account";

export default function PasswordForm() {
  const [state, formAction, isPending] = useActionState(updatePasswordAction, {
    error: null,
    success: false,
    message: "",
  });

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (state.success && state.message) {
      setToast({ message: state.message, type: "success" });
    } else if (state.error) {
      setToast({ message: state.error, type: "error" });
    }
    
    if (state.success || state.error) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [state]);

  return (
    <form action={formAction} className="space-y-4">
      {toast && (
        <div className={`rounded-lg p-3 text-sm ${toast.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {toast.message}
        </div>
      )}

      <div>
        <label htmlFor="currentPassword" className="mb-1 block text-sm font-medium text-gray-700">
          รหัสผ่านปัจจุบัน
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="newPassword" className="mb-1 block text-sm font-medium text-gray-700">
          รหัสผ่านใหม่
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          required
          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="mb-1 block text-sm font-medium text-gray-700">
          ยืนยันรหัสผ่านใหม่
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
        className="rounded-lg bg-gray-900 px-6 py-2.5 font-semibold text-white shadow-sm transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-70"
      >
        {isPending ? "กำลังเปลี่ยน..." : "เปลี่ยนรหัสผ่าน"}
      </button>
    </form>
  );
}
