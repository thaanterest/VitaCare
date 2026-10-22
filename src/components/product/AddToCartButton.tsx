"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

export default function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleDecrease = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncrease = () => {
    if (quantity < stock) setQuantity(quantity + 1);
  };

  const handleAddToCart = () => {
    if (stock > 0) {
      addItem(productId, quantity);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
      setQuantity(1);
    }
  };

  if (stock === 0) {
    return (
      <div className="w-full">
        <button
          type="button"
          disabled
          className="w-full rounded-2xl bg-gray-200 py-3.5 text-sm font-bold text-gray-500 cursor-not-allowed"
        >
          สินค้าหมดชั่วคราว
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      {/* Quantity Stepper */}
      <div className="flex items-center gap-4">
        <span className="text-xs font-semibold text-gray-700">จำนวน:</span>
        <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-0.5">
          <button
            type="button"
            onClick={handleDecrease}
            disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="ลดจำนวน"
          >
            -
          </button>
          <span className="w-10 text-center text-sm font-bold text-gray-900">
            {quantity}
          </span>
          <button
            type="button"
            onClick={handleIncrease}
            disabled={quantity >= stock}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-white hover:text-emerald-700 disabled:opacity-30 disabled:hover:bg-transparent"
            aria-label="เพิ่มจำนวน"
          >
            +
          </button>
        </div>
      </div>

      {/* Action Buttons: Add to Cart + Wishlist */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            />
          </svg>
          <span>{showToast ? "✓ เพิ่มลงตะกร้าแล้ว!" : "เพิ่มลงตะกร้า"}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400 shadow-sm transition-all hover:border-rose-200 hover:text-rose-500 hover:scale-105 active:scale-95"
          aria-label="บันทึกรายการโปรด"
        >
          <svg
            className={`h-5 w-5 ${isWishlisted ? "fill-rose-500 text-rose-500 stroke-rose-500" : "fill-none stroke-current"}`}
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
