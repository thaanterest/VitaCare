"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { formatPriceWithSymbol } from "@/lib/money";
import { useCart } from "@/context/CartContext";

type ProductCardProps = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName?: string;
  stock: number;
  badge?: string; // "Best Seller" | "New" | etc.
  rating?: number;
};

export default function ProductCard({
  id,
  slug,
  name,
  price,
  imageUrl,
  categoryName,
  stock,
  badge,
  rating = 4.8,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (stock > 0) {
      addItem(id, 1);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1500);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Top badges & Favorite button */}
      <div className="absolute left-3 top-3 z-10 flex items-center gap-1.5">
        {badge && (
          <span
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold tracking-wide text-white shadow-sm ${
              badge === "Best Seller"
                ? "bg-rose-500"
                : badge === "New"
                ? "bg-emerald-500"
                : "bg-amber-500"
            }`}
          >
            {badge}
          </span>
        )}
      </div>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-400 shadow-sm transition-all hover:scale-110 hover:text-rose-500"
        aria-label="บันทึกรายการโปรด"
      >
        <svg
          className={`h-4 w-4 transition-colors ${
            isLiked ? "fill-rose-500 text-rose-500 stroke-rose-500" : "fill-none stroke-current"
          }`}
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

      {/* Product Image */}
      <Link href={`/products/${slug}`} className="relative aspect-square w-full overflow-hidden bg-gray-50/60 p-5 flex items-center justify-center">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
          unoptimized
        />
      </Link>

      {/* Product Details */}
      <div className="flex flex-1 flex-col p-4">
        {categoryName && (
          <span className="text-[11px] font-medium text-emerald-600 mb-0.5">
            {categoryName}
          </span>
        )}
        <Link href={`/products/${slug}`}>
          <h3 className="text-sm font-bold text-gray-900 transition-colors group-hover:text-emerald-600 line-clamp-1">
            {name}
          </h3>
        </Link>

        {/* Stars rating */}
        <div className="mt-1 flex items-center gap-1">
          <div className="flex text-amber-400 text-xs">
            ★★★★★
          </div>
          <span className="text-[11px] text-gray-400 font-medium">({rating})</span>
        </div>

        {/* Price and Cart Button */}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <div>
            <span className="text-base font-extrabold text-gray-900">
              {formatPriceWithSymbol(price)}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={stock === 0}
            className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all active:scale-95 shadow-sm ${
              isAdded
                ? "bg-emerald-700 text-white"
                : "bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md"
            } disabled:opacity-40 disabled:cursor-not-allowed`}
            aria-label="เพิ่มลงตะกร้า"
            title="เพิ่มลงตะกร้า"
          >
            {isAdded ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
