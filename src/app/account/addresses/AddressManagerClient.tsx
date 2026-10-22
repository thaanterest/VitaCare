"use client";

import { useState } from "react";
import { 
  createAddressAction, 
  updateAddressAction, 
  deleteAddressAction, 
  setDefaultAddressAction 
} from "@/app/actions/address";

export type AddressItem = {
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

export default function AddressManagerClient({
  initialAddresses,
  defaultName = "",
  defaultPhone = "",
}: {
  initialAddresses: AddressItem[];
  defaultName?: string;
  defaultPhone?: string;
}) {
  const [addresses, setAddresses] = useState<AddressItem[]>(initialAddresses);
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    recipientName: defaultName,
    phone: defaultPhone,
    line1: "",
    subdistrict: "",
    district: "",
    province: "",
    postalCode: "",
    isDefault: false,
  });

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      recipientName: defaultName,
      phone: defaultPhone,
      line1: "",
      subdistrict: "",
      district: "",
      province: "",
      postalCode: "",
      isDefault: addresses.length === 0,
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsOpenForm(true);
  };

  const handleOpenEdit = (addr: AddressItem) => {
    setEditingId(addr.id);
    setFormData({
      recipientName: addr.recipientName,
      phone: addr.phone,
      line1: addr.line1,
      subdistrict: addr.subdistrict,
      district: addr.district,
      province: addr.province,
      postalCode: addr.postalCode,
      isDefault: addr.isDefault,
    });
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsOpenForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const data = new FormData();
    data.append("recipientName", formData.recipientName);
    data.append("phone", formData.phone);
    data.append("line1", formData.line1);
    data.append("subdistrict", formData.subdistrict);
    data.append("district", formData.district);
    data.append("province", formData.province);
    data.append("postalCode", formData.postalCode);
    data.append("isDefault", formData.isDefault ? "true" : "false");

    try {
      if (editingId) {
        const res = await updateAddressAction(editingId, data);
        if (!res.success) {
          setErrorMessage(res.error || "ไม่สามารถแก้ไขที่อยู่ได้");
          setIsPending(false);
          return;
        }
        setSuccessMessage("แก้ไขที่อยู่เรียบร้อยแล้ว");
      } else {
        const res = await createAddressAction(data);
        if (!res.success) {
          setErrorMessage(res.error || "ไม่สามารถเพิ่มที่อยู่ได้");
          setIsPending(false);
          return;
        }
        setSuccessMessage("เพิ่มที่อยู่ใหม่เรียบร้อยแล้ว");
      }

      // รีเฟรชหน้าเพื่อให้ได้ข้อมูลล่าสุด
      window.location.reload();
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการบันทึกที่อยู่");
      setIsPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("คุณต้องการลบที่อยู่จัดส่งนี้ใช่หรือไม่?")) return;
    setIsPending(true);
    try {
      const res = await deleteAddressAction(id);
      if (res.success) {
        setAddresses(addresses.filter((a) => a.id !== id));
        setSuccessMessage("ลบที่อยู่เรียบร้อยแล้ว");
      } else {
        setErrorMessage(res.error || "ไม่สามารถลบที่อยู่ได้");
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาดในการลบที่อยู่");
    } finally {
      setIsPending(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    setIsPending(true);
    try {
      const res = await setDefaultAddressAction(id);
      if (res.success) {
        setAddresses(
          addresses.map((a) => ({
            ...a,
            isDefault: a.id === id,
          }))
        );
        setSuccessMessage("ตั้งเป็นที่อยู่จัดส่งหลักเรียบร้อยแล้ว");
      } else {
        setErrorMessage(res.error || "เกิดข้อผิดพลาด");
      }
    } catch {
      setErrorMessage("เกิดข้อผิดพลาด");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">ที่อยู่จัดส่งของฉัน</h2>
          <p className="text-xs text-gray-500 mt-0.5">จัดการที่อยู่สำหรับรับสินค้า สะดวกในการสั่งซื้อครั้งต่อไป</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition active:scale-95 self-start sm:self-auto"
        >
          <span>+</span>
          <span>เพิ่มที่อยู่ใหม่</span>
        </button>
      </div>

      {successMessage && (
        <div className="rounded-xl bg-emerald-50 p-3 text-xs sm:text-sm font-medium text-emerald-700 border border-emerald-100 flex items-center gap-2">
          <span>✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="rounded-xl bg-red-50 p-3 text-xs sm:text-sm font-medium text-red-600 border border-red-100 flex items-center gap-2">
          <span>⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Modal / Form Panel */}
      {isOpenForm && (
        <div className="rounded-2xl border-2 border-emerald-500/40 bg-emerald-50/15 p-5 shadow-sm space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm font-bold text-gray-900">
              {editingId ? "แก้ไขข้อมูลที่อยู่" : "เพิ่มที่อยู่จัดส่งใหม่"}
            </h3>
            <button
              onClick={() => setIsOpenForm(false)}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              ✕ ปิด
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">ชื่อ-นามสกุล ผู้รับ *</label>
                <input
                  type="text"
                  required
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  placeholder="เช่น สมชาย ใจดี"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">เบอร์โทรศัพท์ติดต่อ *</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="เช่น 081-234-5678"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-semibold text-gray-700">ที่อยู่ (บ้านเลขที่, อาคาร, ซอย, ถนน) *</label>
                <input
                  type="text"
                  required
                  value={formData.line1}
                  onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                  placeholder="เช่น 123/45 หมู่บ้านสุขใจ ซอย 9 ถนนสุขุมวิท"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">ตำบล / แขวง</label>
                <input
                  type="text"
                  value={formData.subdistrict}
                  onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })}
                  placeholder="เช่น บางนา"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">อำเภอ / เขต</label>
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="เช่น บางนา"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">จังหวัด</label>
                <input
                  type="text"
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                  placeholder="เช่น กรุงเทพมหานคร"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-gray-700">รหัสไปรษณีย์ *</label>
                <input
                  type="text"
                  required
                  value={formData.postalCode}
                  onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                  placeholder="เช่น 10260"
                  className="w-full rounded-xl border border-gray-200 bg-white p-2.5 text-xs text-gray-800 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <input
                id="isDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isDefault" className="text-xs font-medium text-gray-700 cursor-pointer">
                ตั้งเป็นที่อยู่จัดส่งหลัก (Default Address)
              </label>
            </div>

            <div className="pt-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-50"
              >
                {isPending ? "กำลังบันทึก..." : "บันทึกที่อยู่"}
              </button>
              <button
                type="button"
                onClick={() => setIsOpenForm(false)}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                ยกเลิก
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-12 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
            📍
          </div>
          <h3 className="text-sm font-bold text-gray-800">ยังไม่มีที่อยู่จัดส่ง</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            เพิ่มที่อยู่จัดส่งของคุณตอนนี้ เพื่อความรวดเร็วและสะดวกสบายในการสั่งซื้อสินค้า
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition"
          >
            + เพิ่มที่อยู่แรกของคุณ
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className={`rounded-2xl border p-4 sm:p-5 transition-all shadow-sm ${
                addr.isDefault
                  ? "border-emerald-500 bg-emerald-50/20"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-gray-900">{addr.recipientName}</span>
                    <span className="text-xs text-gray-400">|</span>
                    <span className="font-mono text-xs text-gray-600">{addr.phone}</span>
                    {addr.isDefault && (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                        ✓ ที่อยู่หลัก
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {addr.line1}
                    {addr.subdistrict && ` ต.${addr.subdistrict}`}
                    {addr.district && ` อ.${addr.district}`}
                    {addr.province && ` จ.${addr.province}`}
                    {` ${addr.postalCode}`}
                  </p>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-start shrink-0 pt-2 sm:pt-0">
                  {!addr.isDefault && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      disabled={isPending}
                      className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-600 hover:border-emerald-500 hover:text-emerald-700 transition"
                    >
                      ตั้งเป็นค่าเริ่มต้น
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenEdit(addr)}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition"
                  >
                    แก้ไข
                  </button>
                  <button
                    onClick={() => handleDelete(addr.id)}
                    disabled={isPending}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-medium text-red-600 hover:border-red-400 hover:bg-red-50 transition"
                  >
                    ลบ
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
