"use client";

import { useConsent } from "@/context/ConsentContext";
import Link from "next/link";
import Image from "next/image";
import CookieSettingsModal from "./CookieSettingsModal";

export default function CookieBanner() {
  const { hasConsented, acceptAll, rejectAll, openSettings } = useConsent();

  if (hasConsented) {
    return <CookieSettingsModal />;
  }

  return (
    <>
      {/* Centered Modal Backdrop (Screen 10 Mockup) */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl text-center space-y-5 border border-gray-100 animate-scaleUp">
          {/* Logo */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="VitaCare Logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-contain drop-shadow-sm"
              />
              <span className="text-xl font-black tracking-tight text-emerald-600">
                Vita<span className="text-sky-500">Care</span>
              </span>
            </div>
          </div>

          {/* Title & Description */}
          <div className="space-y-2">
            <h3 className="text-base font-black text-gray-900 tracking-tight">
              เราใช้คุกกี้เพื่อพัฒนาประสบการณ์ของคุณ
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              เว็บไซต์ VitaCare ใช้คุกกี้เพื่อเพิ่มประสิทธิภาพการใช้งาน จดจำการตั้งค่าตะกร้าสินค้า
              และนำเสนอสิ่งที่ดีที่สุดสำหรับคุณ โดยคุณสามารถเลือกปรับเปลี่ยนการตั้งค่าได้ตลอดเวลา
            </p>
          </div>

          {/* Action Buttons (Mockup Screen 10) */}
          <div className="space-y-2 pt-2">
            <button
              onClick={acceptAll}
              className="w-full rounded-2xl bg-emerald-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98]"
            >
              ยอมรับทั้งหมด
            </button>

            <button
              onClick={rejectAll}
              className="w-full rounded-2xl border border-gray-200 bg-white py-3 text-xs sm:text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50 active:scale-[0.98]"
            >
              ปฏิเสธ
            </button>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-4 text-xs text-gray-400 pt-1">
            <button
              onClick={openSettings}
              className="hover:text-emerald-600 hover:underline transition-colors"
            >
              ตั้งค่าเอง
            </button>
            <span>·</span>
            <Link
              href="/cookie-policy"
              className="hover:text-emerald-600 hover:underline transition-colors"
            >
              นโยบายคุกกี้
            </Link>
          </div>
        </div>
      </div>

      <CookieSettingsModal />
    </>
  );
}
