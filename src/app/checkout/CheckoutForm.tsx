"use client";

import { useActionState, useEffect, useState } from "react";
import { processCheckout } from "@/app/actions/checkout";
import { getUserAddresses } from "@/app/actions/address";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

type SavedAddress = {
  id: string;
  recipientName: string;
  phone: string;
  line1: string;
  subdistrict: string;
  district: string;
  province: string;
  postalCode: string;
  isDefault: boolean;
};

export default function CheckoutForm({ 
  totalAmount 
}: { 
  totalAmount: number 
}) {
  const { items, clearCart } = useCart();
  const router = useRouter();
  const { data: session } = useSession();

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [saveToAccount, setSaveToAccount] = useState(false);

  // ข้อมูลที่อยู่จัดส่งสำหรับคำสั่งซื้อนี้
  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    line1: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
  });
  
  const [state, formAction, isPending] = useActionState(processCheckout, {
    error: null,
    success: false,
    orderNumber: "",
  });

  // โหลดที่อยู่ของผู้ใช้จากฐานข้อมูล
  useEffect(() => {
    async function loadAddresses() {
      try {
        const list = await getUserAddresses();
        if (list && list.length > 0) {
          setSavedAddresses(list);
          const defaultAddr = list.find((a) => a.isDefault) || list[0];
          setSelectedAddressId(defaultAddr.id);
          setAddress({
            recipientName: defaultAddr.recipientName,
            phone: defaultAddr.phone,
            line1: defaultAddr.line1,
            subdistrict: defaultAddr.subdistrict,
            district: defaultAddr.district,
            province: defaultAddr.province,
            postalCode: defaultAddr.postalCode,
          });
          setIsEditingAddress(false);
        } else {
          // ยังไม่มีที่อยู่บันทึกไว้ -> เปิดฟอร์มกรอกที่อยู่ทันที
          setIsEditingAddress(true);
          setSaveToAccount(true);
          if (session?.user?.name) {
            setAddress((prev) => ({
              ...prev,
              recipientName: session.user.name || "",
            }));
          }
        }
      } catch (e) {
        console.error("Failed to load user addresses:", e);
        setIsEditingAddress(true);
      }
    }
    loadAddresses();
  }, [session]);

  const handleSelectSavedAddress = (addr: SavedAddress) => {
    setSelectedAddressId(addr.id);
    setAddress({
      recipientName: addr.recipientName,
      phone: addr.phone,
      line1: addr.line1,
      subdistrict: addr.subdistrict,
      district: addr.district,
      province: addr.province,
      postalCode: addr.postalCode,
    });
    setIsEditingAddress(false);
    setShowAddressPicker(false);
  };

  const handleUseNewAddress = () => {
    setSelectedAddressId(null);
    setAddress({
      recipientName: session?.user?.name || "",
      phone: "",
      line1: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
    });
    setIsEditingAddress(true);
    setShowAddressPicker(false);
    setSaveToAccount(true);
  };

  useEffect(() => {
    if (state.success && state.orderNumber) {
      clearCart();
      router.push(`/checkout/success/${state.orderNumber}`);
    }
  }, [state.success, state.orderNumber, clearCart, router]);

  return (
    <form action={formAction} className="space-y-8">
      {state.error && (
        <div className="rounded-2xl bg-red-50 p-4 text-xs sm:text-sm text-red-600 border border-red-100 flex items-center gap-2">
          <span>⚠</span>
          <span>{state.error}</span>
        </div>
      )}

      {/* Hidden cart data */}
      <input type="hidden" name="cartItems" value={JSON.stringify(items)} />
      <input type="hidden" name="saveToAccount" value={saveToAccount ? "true" : "false"} />

      {/* Step Indicators (Screen 5 Mockup) */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-5 max-w-md mx-auto">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            1
          </span>
          <span className="text-xs sm:text-sm font-bold text-emerald-700">ที่อยู่จัดส่ง</span>
        </div>
        <div className="h-0.5 w-8 bg-gray-200" />
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">
            2
          </span>
          <span className="text-xs sm:text-sm font-bold text-emerald-700">ชำระเงิน</span>
        </div>
        <div className="h-0.5 w-8 bg-gray-200" />
        <div className="flex items-center gap-2 text-gray-400">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
            3
          </span>
          <span className="text-xs sm:text-sm font-medium">ยืนยันคำสั่งซื้อ</span>
        </div>
      </div>

      {/* 1. ที่อยู่จัดส่ง */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-gray-900">ที่อยู่จัดส่ง</h2>
            <p className="text-xs text-gray-500">เลือกที่อยู่จากบัญชีของคุณ หรือกรอกที่อยู่ใหม่</p>
          </div>
          <div className="flex items-center gap-2">
            {savedAddresses.length > 0 && (
              <button
                type="button"
                onClick={() => setShowAddressPicker(!showAddressPicker)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 transition"
              >
                {showAddressPicker ? "ซ่อนรายการ" : `📋 เลือกที่อยู่อื่น (${savedAddresses.length})`}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isEditingAddress) {
                  setIsEditingAddress(false);
                } else {
                  handleUseNewAddress();
                }
              }}
              className="text-xs font-bold text-gray-700 hover:text-emerald-700 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition"
            >
              {isEditingAddress ? "ปิดการแก้ไข" : "+ กรอกที่อยู่ใหม่"}
            </button>
          </div>
        </div>

        {/* Address Picker Popup/Accordion */}
        {showAddressPicker && savedAddresses.length > 0 && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50/70 p-4 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between pb-1">
              <span className="text-xs font-bold text-gray-700">เลือกจากที่อยู่ที่บันทึกไว้ในบัญชี:</span>
              <Link href="/account/addresses" target="_blank" className="text-[11px] text-emerald-600 hover:underline">
                จัดการที่อยู่ทั้งหมด ↗
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-1">
              {savedAddresses.map((addr) => (
                <div
                  key={addr.id}
                  onClick={() => handleSelectSavedAddress(addr)}
                  className={`rounded-xl border p-3 cursor-pointer transition-all ${
                    selectedAddressId === addr.id
                      ? "border-emerald-500 bg-white shadow-sm ring-1 ring-emerald-500"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-0.5 text-xs text-gray-700">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-gray-900">{addr.recipientName}</span>
                        <span className="text-gray-400">|</span>
                        <span className="font-mono text-gray-600">{addr.phone}</span>
                        {addr.isDefault && (
                          <span className="rounded bg-emerald-100 px-1.5 py-0.2 text-[9px] font-bold text-emerald-800">
                            ที่อยู่หลัก
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 leading-tight">
                        {addr.line1} {addr.subdistrict && `ต.${addr.subdistrict}`} {addr.district && `อ.${addr.district}`} {addr.province} {addr.postalCode}
                      </p>
                    </div>
                    {selectedAddressId === addr.id && (
                      <span className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px]">✓</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Address Card (เมื่อเลือกที่อยู่แล้วและไม่ได้อยู่ในโหมดแก้ไข) */}
        {!isEditingAddress && address.recipientName && (
          <div className="rounded-2xl border-2 border-emerald-500 bg-emerald-50/20 p-4 relative shadow-sm">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 border-emerald-600 bg-emerald-600 text-white text-[10px]">
                ✓
              </span>
              <div className="space-y-1 text-xs sm:text-sm text-gray-700 flex-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-900">{address.recipientName}</p>
                  <button
                    type="button"
                    onClick={() => setIsEditingAddress(true)}
                    className="text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    แก้ไข
                  </button>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  {address.line1}
                  {address.subdistrict && ` ต.${address.subdistrict}`}
                  {address.district && ` อ.${address.district}`}
                  {address.province && ` ${address.province}`}
                  {` ${address.postalCode}`}
                </p>
                <p className="font-mono text-gray-500">{address.phone}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form Fields: สำหรับกรอกที่อยู่ใหม่ หรือแก้ไข */}
        {isEditingAddress && (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 space-y-4 shadow-sm animate-fadeIn">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <h4 className="text-xs font-bold text-gray-800">
                {selectedAddressId ? "แก้ไขที่อยู่จัดส่งนี้" : "กรอกข้อมูลที่อยู่จัดส่งใหม่"}
              </h4>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  ✕ ยกเลิก
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">ชื่อ-นามสกุล ผู้รับ *</label>
                <input
                  type="text"
                  required
                  value={address.recipientName}
                  onChange={(e) => setAddress({ ...address, recipientName: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="เช่น 081-234-5678"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-gray-700">ที่อยู่ (บ้านเลขที่, อาคาร, ซอย, ถนน) *</label>
                <input
                  type="text"
                  required
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="เช่น 123/45 หมู่บ้านสุขใจ ซอย 9"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">แขวง / ตำบล</label>
                <input
                  type="text"
                  value={address.subdistrict}
                  onChange={(e) => setAddress({ ...address, subdistrict: e.target.value })}
                  placeholder="เช่น บางนา"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">เขต / อำเภอ</label>
                <input
                  type="text"
                  value={address.district}
                  onChange={(e) => setAddress({ ...address, district: e.target.value })}
                  placeholder="เช่น บางนา"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">จังหวัด</label>
                <input
                  type="text"
                  value={address.province}
                  onChange={(e) => setAddress({ ...address, province: e.target.value })}
                  placeholder="เช่น กรุงเทพมหานคร"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">รหัสไปรษณีย์ *</label>
                <input
                  type="text"
                  required
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  placeholder="เช่น 10260"
                  className="w-full rounded-xl border border-gray-200 p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-700">
                <input
                  type="checkbox"
                  checked={saveToAccount}
                  onChange={(e) => setSaveToAccount(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span>บันทึกที่อยู่นี้ไว้ในบัญชีของฉันสำหรับครั้งต่อไป</span>
              </label>

              {address.recipientName && address.phone && address.line1 && address.postalCode && (
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="rounded-lg bg-emerald-600 px-3 py-1 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  ใช้ที่อยู่นี้
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hidden inputs to pass address to server action */}
        <input type="hidden" name="recipientName" value={address.recipientName} />
        <input type="hidden" name="phone" value={address.phone} />
        <input type="hidden" name="line1" value={address.line1} />
        <input type="hidden" name="subdistrict" value={address.subdistrict} />
        <input type="hidden" name="district" value={address.district} />
        <input type="hidden" name="province" value={address.province} />
        <input type="hidden" name="postalCode" value={address.postalCode} />
      </div>

      {/* 2. วิธีการจัดส่ง (Mockup Screen 5) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">วิธีการจัดส่ง</h2>
        <div className="space-y-2.5">
          <label
            onClick={() => setShippingMethod("standard")}
            className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
              shippingMethod === "standard"
                ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={shippingMethod === "standard"}
                onChange={() => setShippingMethod("standard")}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                ขนส่งเอกชนมาตรฐาน (2-3 วันทำการ)
              </span>
            </div>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              ฟรี
            </span>
          </label>

          <label
            onClick={() => setShippingMethod("express")}
            className={`flex items-center justify-between rounded-2xl border p-4 cursor-pointer transition-all ${
              shippingMethod === "express"
                ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={shippingMethod === "express"}
                onChange={() => setShippingMethod("express")}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
              />
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                จัดส่งด่วนพิเศษ Express (1 วันทำการ)
              </span>
            </div>
            <span className="text-xs font-bold text-gray-700">฿50</span>
          </label>
        </div>
      </div>

      {/* 3. วิธีการชำระเงิน (Mockup Screen 5) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-gray-900">วิธีการชำระเงิน</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label
            onClick={() => setPaymentMethod("credit")}
            className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              paymentMethod === "credit"
                ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="credit"
              checked={paymentMethod === "credit"}
              onChange={() => setPaymentMethod("credit")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <div className="flex items-center gap-2">
              <span className="text-base">💳</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                บัตรเครดิต / เดบิต
              </span>
            </div>
          </label>

          <label
            onClick={() => setPaymentMethod("qr")}
            className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all ${
              paymentMethod === "qr"
                ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="qr"
              checked={paymentMethod === "qr"}
              onChange={() => setPaymentMethod("qr")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <div className="flex items-center gap-2">
              <span className="text-base">📱</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                พร้อมเพย์ (QR PromptPay)
              </span>
            </div>
          </label>

          <label
            onClick={() => setPaymentMethod("cod")}
            className={`flex items-center gap-3 rounded-2xl border p-4 cursor-pointer transition-all sm:col-span-2 ${
              paymentMethod === "cod"
                ? "border-emerald-500 bg-emerald-50/10 shadow-sm"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={() => setPaymentMethod("cod")}
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
            />
            <div className="flex items-center gap-2">
              <span className="text-base">📦</span>
              <span className="text-xs sm:text-sm font-semibold text-gray-900">
                เก็บเงินปลายทาง (Cash on Delivery)
              </span>
            </div>
          </label>
        </div>
      </div>

      {/* สรุปและปุ่มดำเนินการ */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-sm sm:text-base font-bold text-white shadow-lg shadow-emerald-600/25 transition-all hover:bg-emerald-700 active:scale-98 disabled:opacity-50"
        >
          {isPending ? "กำลังบันทึกคำสั่งซื้อ..." : `ยืนยันการสั่งซื้อ (฿${(totalAmount / 100).toLocaleString()})`}
        </button>
        <p className="mt-2 text-center text-[11px] text-gray-400">
          ข้อมูลคำสั่งซื้อของคุณได้รับการปกป้องด้วยความปลอดภัยระดับมาตรฐานสากล
        </p>
      </div>
    </form>
  );
}
