export const POLICY_VERSION = "1.0.0";

export type ConsentStatus = {
  version: string;
  necessary: boolean;
  functional: boolean;
  analytics: boolean;
  marketing: boolean;
  timestamp: string;
  anonymousId: string;
};

export const DEFAULT_CONSENT: ConsentStatus = {
  version: POLICY_VERSION,
  necessary: true, // ปิดไม่ได้
  functional: false,
  analytics: false,
  marketing: false,
  timestamp: "",
  anonymousId: "",
};
