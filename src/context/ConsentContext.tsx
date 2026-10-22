"use client";

import { createContext, useContext, useEffect, useState, startTransition, ReactNode } from "react";
import { ConsentStatus, DEFAULT_CONSENT, POLICY_VERSION } from "@/lib/consent";
import { v4 as uuidv4 } from "uuid";

type ConsentContextType = {
  consent: ConsentStatus | null;
  hasConsented: boolean; // true ถ้าผู้ใช้เคยกดเลือกแล้วในเวอร์ชันนี้
  updateConsent: (newConsent: Partial<ConsentStatus>, action: string) => Promise<void>;
  acceptAll: () => Promise<void>;
  rejectAll: () => Promise<void>;
  openSettings: () => void;
  closeSettings: () => void;
  isSettingsOpen: boolean;
};

const ConsentContext = createContext<ConsentContextType | undefined>(undefined);

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentStatus | null>(null);
  const [hasConsented, setHasConsented] = useState<boolean>(true); // default true เพื่อไม่ให้ banner แวบตอนโหลด
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // โหลดคุกกี้
    const match = document.cookie.match(new RegExp('(^| )aquavita_consent=([^;]+)'));
    if (match) {
      try {
        const saved = JSON.parse(decodeURIComponent(match[2]));
        if (saved.version === POLICY_VERSION) {
          startTransition(() => {
            setConsent(saved);
            setHasConsented(true);
          });
        } else {
          // คนละเวอร์ชัน ต้องขอใหม่
          startTransition(() => {
            setConsent({ ...DEFAULT_CONSENT, anonymousId: saved.anonymousId || uuidv4() });
            setHasConsented(false);
          });
        }
      } catch {
        startTransition(() => {
          setConsent({ ...DEFAULT_CONSENT, anonymousId: uuidv4() });
          setHasConsented(false);
        });
      }
    } else {
      startTransition(() => {
        setConsent({ ...DEFAULT_CONSENT, anonymousId: uuidv4() });
        setHasConsented(false);
      });
    }
  }, []);

  const saveCookie = (data: ConsentStatus) => {
    // อายุ 6 เดือน
    const maxAge = 60 * 60 * 24 * 180;
    let cookieStr = `aquavita_consent=${encodeURIComponent(JSON.stringify(data))}; path=/; max-age=${maxAge}; SameSite=Lax`;
    if (process.env.NODE_ENV === "production") {
      cookieStr += "; Secure";
    }
    document.cookie = cookieStr;
  };

  const clearThirdPartyCookies = (data: ConsentStatus) => {
    // สมมติฐาน: ลบคุกกี้ที่ไม่จำเป็น
    if (!data.functional) {
      document.cookie = "aquavita_lang=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    if (!data.analytics) {
      document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    if (!data.marketing) {
      document.cookie = "_fbp=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
  };

  const updateConsent = async (updates: Partial<ConsentStatus>, action: string) => {
    if (!consent) return;

    const newConsent = {
      ...consent,
      ...updates,
      version: POLICY_VERSION,
      timestamp: new Date().toISOString(),
    };

    setConsent(newConsent);
    setHasConsented(true);
    saveCookie(newConsent);
    clearThirdPartyCookies(newConsent);

    // ส่ง Log ไปยัง Backend
    try {
      await fetch("/api/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymousId: newConsent.anonymousId,
          policyVersion: newConsent.version,
          action,
          functional: newConsent.functional,
          analytics: newConsent.analytics,
          marketing: newConsent.marketing,
        }),
      });
    } catch (e) {
      console.error("Failed to log consent", e);
    }
  };

  const acceptAll = async () => {
    await updateConsent({ functional: true, analytics: true, marketing: true }, "ACCEPT_ALL");
  };

  const rejectAll = async () => {
    await updateConsent({ functional: false, analytics: false, marketing: false }, "REJECT_ALL");
  };

  const openSettings = () => setIsSettingsOpen(true);
  const closeSettings = () => setIsSettingsOpen(false);

  return (
    <ConsentContext.Provider value={{ consent, hasConsented, updateConsent, acceptAll, rejectAll, openSettings, closeSettings, isSettingsOpen }}>
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  const context = useContext(ConsentContext);
  if (context === undefined) {
    throw new Error("useConsent must be used within a ConsentProvider");
  }
  return context;
}
