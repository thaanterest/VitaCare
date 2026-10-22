"use client";

import { useActionState, useEffect, useState } from "react";
import { updateProfileAction } from "@/app/actions/account";

export default function ProfileForm({ 
  user 
}: { 
  user: { name: string; email: string; phone: string | null } 
}) {
  const [state, formAction, isPending] = useActionState(updateProfileAction, {
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
        <div className={`rounded-xl p-3 text-xs sm:text-sm ${toast.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-600 border border-red-100"}`}>
          {toast.message}
        </div>
      )}

      <div>
        <label htmlFor="name" className="mb-1.5 block text-xs font-semibold text-gray-700">
          ชื่อ-นามสกุล
        </label>
        <input
          id="name"
          name="name"
          type="text"
          defaultValue={user.name}
          required
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-gray-700">
          อีเมล
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-2.5 text-xs sm:text-sm text-gray-500 cursor-not-allowed"
        />
      </div>

      <div>
        <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-gray-700">
          เบอร์โทรศัพท์
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={user.phone || "081-234-5678"}
          className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-xs sm:text-sm text-gray-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-emerald-600 py-3.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>
    </form>
  );
}
