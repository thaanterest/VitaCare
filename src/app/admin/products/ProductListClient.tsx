"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPriceWithSymbol } from "@/lib/money";
import { deleteProductAction, quickUpdateStockAction } from "@/app/actions/admin-products";

type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  price: number;
  stock: number;
  lowStockThreshold: number;
  isActive: boolean;
  category: { id: string; name: string };
};

type Category = { id: string; name: string };

export default function ProductListClient({
  initialProducts,
  categories,
  totalPages,
  currentPage,
}: {
  initialProducts: ProductWithCategory[];
  categories: Category[];
  totalPages: number;
  currentPage: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [q, setQ] = useState(searchParams.get("q") || "");
  const [stockUpdating, setStockUpdating] = useState<string | null>(null);

  const updateFilters = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(name, value);
    else params.delete(name);
    params.set("page", "1");
    router.push(`/admin/products?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters("q", q);
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะลบสินค้า "${name}"?\n(หากสินค้านี้มีประวัติการสั่งซื้อแล้ว ระบบจะทำการ 'ปิดการขาย' แทนการลบเพื่อรักษาข้อมูล)`)) {
      const res = await deleteProductAction(id);
      if (res.message) alert(res.message);
      if (!res.success && res.error) alert(res.error);
    }
  };

  const handleStockUpdate = async (id: string, newStock: number) => {
    setStockUpdating(id);
    const res = await quickUpdateStockAction(id, newStock);
    if (!res.success) alert(res.error);
    setStockUpdating(null);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Filters */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4 bg-gray-50">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <input 
            type="text" 
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="ค้นหาชื่อสินค้า..." 
            className="w-full sm:w-64 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
          />
          <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium">ค้นหา</button>
        </form>
        <div className="flex gap-2">
          <select 
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onChange={(e) => updateFilters("category", e.target.value)}
            defaultValue={searchParams.get("category") || ""}
          >
            <option value="">ทุกหมวดหมู่</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            onChange={(e) => updateFilters("stock", e.target.value)}
            defaultValue={searchParams.get("stock") || ""}
          >
            <option value="">ทุกสถานะสต็อก</option>
            <option value="low">สต็อกต่ำ</option>
            <option value="out">สินค้าหมด</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">รูปภาพ</th>
              <th className="px-6 py-4">ชื่อสินค้า</th>
              <th className="px-6 py-4">หมวดหมู่</th>
              <th className="px-6 py-4 text-right">ราคา</th>
              <th className="px-6 py-4 text-center">สต็อก</th>
              <th className="px-6 py-4 text-center">สถานะ</th>
              <th className="px-6 py-4 text-center">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {initialProducts.map(p => {
              const isLowStock = p.stock > 0 && p.stock <= p.lowStockThreshold;
              const isOut = p.stock === 0;

              return (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <Image
                      src={p.imageUrl}
                      alt={p.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded object-cover border border-gray-200"
                      unoptimized
                    />
                  </td>
                  <td className="px-6 py-3">
                    <p className="font-medium text-gray-900">{p.name}</p>
                    {isLowStock && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">สต็อกต่ำ ({p.stock}/{p.lowStockThreshold})</span>}
                    {isOut && <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700">สินค้าหมด</span>}
                  </td>
                  <td className="px-6 py-3 text-gray-600">{p.category.name}</td>
                  <td className="px-6 py-3 text-right font-medium text-gray-900">{formatPriceWithSymbol(p.price)}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => handleStockUpdate(p.id, p.stock - 1)}
                        disabled={p.stock <= 0 || stockUpdating === p.id}
                        className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                      >-</button>
                      <span className="w-8 text-center">{p.stock}</span>
                      <button 
                        onClick={() => handleStockUpdate(p.id, p.stock + 1)}
                        disabled={stockUpdating === p.id}
                        className="w-6 h-6 rounded bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                      >+</button>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${p.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {p.isActive ? "เปิดขาย" : "ปิดขาย"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center space-x-3">
                    <Link href={`/admin/products/${p.id}/edit`} className="text-blue-600 hover:underline">แก้ไข</Link>
                    <button onClick={() => handleDelete(p.id, p.name)} className="text-red-600 hover:underline">ลบ</button>
                  </td>
                </tr>
              );
            })}
            {initialProducts.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">ไม่พบข้อมูลสินค้า</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t border-gray-100 flex justify-center gap-2 bg-gray-50">
          <button 
            disabled={currentPage <= 1}
            onClick={() => updateFilters("page", (currentPage - 1).toString())}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            ก่อนหน้า
          </button>
          <span className="px-4 py-1 text-gray-600">หน้า {currentPage} จาก {totalPages}</span>
          <button 
            disabled={currentPage >= totalPages}
            onClick={() => updateFilters("page", (currentPage + 1).toString())}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            ถัดไป
          </button>
        </div>
      )}
    </div>
  );
}
