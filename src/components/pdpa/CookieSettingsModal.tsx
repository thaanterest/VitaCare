"use client";

import { useState, useEffect, startTransition } from "react";
import { useConsent } from "@/context/ConsentContext";
import { ConsentStatus } from "@/lib/consent";


export default function CookieSettingsModal() {
  const { consent, isSettingsOpen, closeSettings, updateConsent } =
    useConsent();
  const [localConsent, setLocalConsent] = useState<Partial<ConsentStatus>>({
    functional: false,
    analytics: false,
    marketing: false,
  });

  // sync with current consent when modal opens
  useEffect(() => {
    if (isSettingsOpen && consent) {
      startTransition(() => {
        setLocalConsent({
          functional: consent.functional,
          analytics: consent.analytics,
          marketing: consent.marketing,
        });
      });
    }
  }, [isSettingsOpen, consent]);

  if (!isSettingsOpen) return null;

  const handleSave = async () => {
    await updateConsent(localConsent, "CUSTOM");
    closeSettings();
  };

  const handleAcceptAll = async () => {
    await updateConsent(
      { functional: true, analytics: true, marketing: true },
      "ACCEPT_ALL"
    );
    closeSettings();
  };

  const toggle = (key: "functional" | "analytics" | "marketing") => {
    setLocalConsent((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cookie-settings-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeSettings}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2
            id="cookie-settings-title"
            className="text-lg font-bold text-gray-900"
          >
            🍪 ตั้งค่าคุกกี้
          </h2>
          <button
            onClick={closeSettings}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            aria-label="ปิดหน้าต่างตั้งค่าคุกกี้"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <p className="text-sm text-gray-600">
            เลือกประเภทคุกกี้ที่คุณยินยอมให้เราใช้ คุณสามารถเปลี่ยนแปลงการตั้งค่าเหล่านี้ได้ตลอดเวลา
          </p>

          {/* Necessary — always on */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold text-gray-900 text-sm">
                คุกกี้ที่จำเป็น (Necessary)
              </span>
              <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                จำเป็นเสมอ
              </span>
            </div>
            <p className="text-xs text-gray-500">
              คุกกี้เหล่านี้จำเป็นสำหรับการทำงานของเว็บไซต์ ไม่สามารถปิดได้ เช่น ตะกร้าสินค้า การล็อกอิน
            </p>
          </div>

          {/* Toggleable categories */}
          {(
            [
              {
                key: "functional" as const,
                title: "คุกกี้เชิงฟังก์ชัน (Functional)",
                desc: "ช่วยจดจำการตั้งค่าของคุณ เช่น ภาษา เพื่อให้การใช้งานสะดวกขึ้น",
              },
              {
                key: "analytics" as const,
                title: "คุกกี้วิเคราะห์ (Analytics)",
                desc: "ช่วยให้เราเข้าใจว่าผู้เยี่ยมชมใช้เว็บไซต์อย่างไร ข้อมูลรวบรวมโดยไม่ระบุตัวตน",
              },
              {
                key: "marketing" as const,
                title: "คุกกี้การตลาด (Marketing)",
                desc: "ใช้แสดงโฆษณาที่เกี่ยวข้องและวัดประสิทธิผลของแคมเปญโฆษณา",
              },
            ] as const
          ).map(({ key, title, desc }) => (
            <div
              key={key}
              className="p-4 rounded-xl border border-gray-200 flex items-start justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 text-sm mb-1">
                  {title}
                </p>
                <p className="text-xs text-gray-500">{desc}</p>
              </div>
              <button
                role="switch"
                aria-checked={!!localConsent[key]}
                onClick={() => toggle(key)}
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
                  localConsent[key] ? "bg-primary-600" : "bg-gray-200"
                }`}
                aria-label={`${title} ${localConsent[key] ? "เปิด" : "ปิด"}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${
                    localConsent[key] ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 text-sm font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
          >
            บันทึกการตั้งค่า
          </button>
          <button
            onClick={handleAcceptAll}
            className="flex-1 px-4 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
          >
            ยอมรับทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}
