"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatPriceWithSymbol } from "@/lib/money";
import { calculateShippingFee } from "@/lib/shipping";

type FreshProductInfo = {
  id: string;
  name: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
  slug: string;
};

export default function CartPage() {
  const { items, updateItem, removeItem, clearCart } = useCart();
  const [products, setProducts] = useState<Record<string, FreshProductInfo>>({});
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลราคา/สต็อกล่าสุด
  useEffect(() => {
    async function fetchFreshData() {
      if (items.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const productIds = items.map((i) => i.productId);
        const res = await fetch("/api/products/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds }),
        });
        
        if (res.ok) {
          const data = await res.json();
          const productMap: Record<string, FreshProductInfo> = {};
          data.products.forEach((p: FreshProductInfo) => {
            productMap[p.id] = p;
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error("Failed to fetch cart products", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFreshData();
  }, [items]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-500">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="mt-3 text-sm">กำลังโหลดตะกร้าสินค้า...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="mb-4 inline-flex rounded-3xl bg-emerald-50 p-6 text-emerald-500">
          <svg className="h-16 w-16" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900">ตะกร้าสินค้าของคุณว่างเปล่า</h2>
        <p className="mt-2 text-sm text-gray-500">เลือกซื้อวิตามินและอาหารเสริมเพื่อสุขภาพที่ดีของคุณ</p>
        <Link
          href="/products"
          className="mt-6 inline-flex rounded-full bg-emerald-600 px-8 py-3 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-95"
        >
          เริ่มเลือกซื้อสินค้า
        </Link>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId];
    if (p && p.isActive && p.stock > 0) {
      return sum + p.price * item.quantity;
    }
    return sum;
  }, 0);

  // ส่วนลดจำลอง 100 บาท เพื่อให้ตรงกับ Screen 4 ของ Mockup เมื่อยอดครบ 1000 บาท
  const discount = subtotal >= 100000 ? 10000 : 0;
  const shippingFee = calculateShippingFee(subtotal);
  const total = Math.max(0, subtotal - discount + shippingFee);

  const hasInvalidItems = items.some(item => {
    const p = products[item.productId];
    return !p || !p.isActive || p.stock === 0;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          ตะกร้าสินค้า <span className="text-emerald-600 text-lg">({items.length} รายการ)</span>
        </h1>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
        >
          ล้างทั้งหมด
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Cart Items List (Mockup Screen 4 layout) */}
        <div className="lg:col-span-7 space-y-3">
          {items.map((item) => {
            const p = products[item.productId];
            if (!p) return null;
            const isUnavailable = !p.isActive || p.stock === 0;

            return (
              <div
                key={item.productId}
                className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200"
              >
                {/* Image */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-50 p-2">
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1"
                  >
                    {p.name}
                  </Link>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatPriceWithSymbol(p.price)} / ชิ้น
                  </p>
                </div>

                {/* Stepper */}
                {!isUnavailable ? (
                  <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-0.5 shrink-0">
                    <button
                      onClick={() => updateItem(item.productId, item.quantity - 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-emerald-700 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItem(item.productId, item.quantity + 1)}
                      disabled={item.quantity >= p.stock}
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-500 hover:bg-white hover:text-emerald-700 transition-colors disabled:opacity-30"
                    >
                      +
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-red-500 font-semibold">สินค้าหมด</span>
                )}

                {/* Price */}
                <div className="w-20 text-right font-extrabold text-sm text-gray-900 shrink-0">
                  {formatPriceWithSymbol(p.price * item.quantity)}
                </div>

                {/* Trash Button */}
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  aria-label="ลบสินค้า"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>

        {/* Order Summary (Mockup Screen 4) */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              สรุปคำสั่งซื้อ
            </h2>

            <div className="space-y-3 text-xs sm:text-sm text-gray-600">
              <div className="flex justify-between">
                <span>ยอดรวมสินค้า</span>
                <span className="font-semibold text-gray-900">{formatPriceWithSymbol(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>ส่วนลด</span>
                  <span className="font-semibold">-{formatPriceWithSymbol(discount)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>ค่าจัดส่ง</span>
                <span className="font-semibold text-emerald-600">
                  {shippingFee === 0 ? "ฟรี" : formatPriceWithSymbol(shippingFee)}
                </span>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-3 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">ยอดชำระทั้งหมด</span>
                <span className="text-2xl font-black text-emerald-600">
                  {formatPriceWithSymbol(total)}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/checkout"
                className={`flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-700 active:scale-[0.98] ${
                  hasInvalidItems ? "pointer-events-none opacity-50" : ""
                }`}
              >
                <span>ดำเนินการสั่งซื้อ</span>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
