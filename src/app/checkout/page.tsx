"use client";

import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { calculateShippingFee } from "@/lib/shipping";
import { formatPriceWithSymbol } from "@/lib/money";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import CheckoutForm from "./CheckoutForm";
import Link from "next/link";

type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  isActive: boolean;
  imageUrl: string;
};

export default function CheckoutPage() {
  const { items } = useCart();
  const { status } = useSession();
  const router = useRouter();
  
  const [products, setProducts] = useState<Record<string, CartProduct>>({});
  const [loading, setLoading] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Fetch product prices
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
          const productMap: Record<string, CartProduct> = {};
          data.products.forEach((p: CartProduct) => {
            productMap[p.id] = p;
          });
          setProducts(productMap);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchFreshData();
  }, [items]);

  if (status === "loading" || loading) {
    return <div className="p-12 text-center text-gray-500">กำลังโหลด...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-50 text-3xl shadow-sm border border-emerald-100">
          🛒
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">ยังไม่มีสินค้าในตะกร้าของคุณ</h2>
        <p className="text-xs sm:text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
          คุณยังไม่มีสินค้าที่เลือกไว้สำหรับชำระเงิน กรุณาเลือกสินค้าวิตามินและอาหารเสริมที่คุณต้องการก่อนดำเนินการสั่งซื้อ
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/products"
            className="rounded-full bg-emerald-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition"
          >
            🛍️ เลือกซื้อสินค้าเลย
          </Link>
          <Link
            href="/account/addresses"
            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-xs sm:text-sm font-semibold text-gray-700 hover:border-emerald-500 hover:text-emerald-700 transition"
          >
            📍 จัดการที่อยู่จัดส่งของคุณ
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const p = products[item.productId];
    return p && p.isActive && p.stock > 0 ? sum + p.price * item.quantity : sum;
  }, 0);
  const shippingFee = calculateShippingFee(subtotal);
  const totalAmount = subtotal + shippingFee;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 bg-gray-50 min-h-screen rounded-2xl">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">ชำระเงิน</h1>
      
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
        {/* Form */}
        <div className="lg:col-span-7 rounded-2xl bg-white p-6 shadow-sm sm:p-8">
          <CheckoutForm totalAmount={totalAmount} />
        </div>

        {/* Order Summary */}
        <div className="mt-8 lg:col-span-5 lg:mt-0">
          <div className="rounded-2xl bg-white p-6 shadow-sm sm:p-8 sticky top-24">
            <h2 className="text-lg font-medium text-gray-900 mb-4">สรุปคำสั่งซื้อ</h2>
            
            <ul className="divide-y divide-gray-200 mb-6 max-h-60 overflow-y-auto pr-2">
              {items.map(item => {
                const p = products[item.productId];
                if (!p) return null;
                return (
                  <li key={item.productId} className="py-4 flex justify-between text-sm">
                    <div className="pr-4">
                      <p className="font-medium text-gray-900 line-clamp-1">{p.name}</p>
                      <p className="text-gray-500">จำนวน: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">{formatPriceWithSymbol(p.price * item.quantity)}</p>
                  </li>
                );
              })}
            </ul>

            <dl className="space-y-4 text-sm text-gray-600">
              <div className="flex justify-between"><dt>ยอดรวม</dt><dd className="font-medium text-gray-900">{formatPriceWithSymbol(subtotal)}</dd></div>
              <div className="flex justify-between border-b border-gray-200 pb-4"><dt>ค่าจัดส่ง</dt><dd className="font-medium text-gray-900">{shippingFee === 0 ? "ส่งฟรี" : formatPriceWithSymbol(shippingFee)}</dd></div>
              <div className="flex justify-between pt-2"><dt className="text-base font-bold text-gray-900">ยอดสุทธิ</dt><dd className="text-xl font-bold text-primary-700">{formatPriceWithSymbol(totalAmount)}</dd></div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
