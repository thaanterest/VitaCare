"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

type Category = {
  id: string;
  name: string;
  slug: string;
};

const priceRanges = [
  { label: "ต่ำกว่า ฿300", value: "under-300" },
  { label: "฿300 - ฿500", value: "300-500" },
  { label: "฿501 - ฿800", value: "501-800" },
  { label: "มากกว่า ฿800", value: "over-800" },
];

export default function ProductFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const currentCategory = searchParams.get("category") || "";
  const currentPriceRange = searchParams.get("priceRange") || "";
  const hasActiveFilter = Boolean(currentCategory || currentPriceRange);

  const updateParam = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        if (params.get(name) === value) {
          params.delete(name); // Toggle off if clicked again
        } else {
          params.set(name, value);
        }
      } else {
        params.delete(name);
      }
      router.push(`/products?${params.toString()}`);
    },
    [router, searchParams]
  );

  const clearAllFilters = () => {
    router.push("/products");
  };

  return (
    <aside className="w-full lg:w-64 shrink-0 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-sm">
      {/* Mobile Toggle Button (Visible only on < lg) */}
      <div className="flex items-center justify-between lg:hidden">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="flex items-center gap-2 text-sm font-bold text-gray-900"
          aria-expanded={isMobileOpen}
        >
          <svg className="h-4 w-4 text-emerald-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          <span>ตัวกรองสินค้า</span>
          {hasActiveFilter && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
              {(currentCategory ? 1 : 0) + (currentPriceRange ? 1 : 0)}
            </span>
          )}
        </button>

        <div className="flex items-center gap-2">
          {hasActiveFilter && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              ล้างทั้งหมด
            </button>
          )}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="p-1 text-gray-400 hover:text-gray-600"
            aria-label="ย่อ/ขยายตัวกรอง"
          >
            <svg
              className={`h-4 w-4 transition-transform duration-200 ${isMobileOpen ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filter Content (Collapsible on mobile, always open on lg) */}
      <div className={`mt-4 lg:mt-0 space-y-6 ${isMobileOpen ? "block" : "hidden lg:block"}`}>
        {/* Header on Desktop */}
        <div className="hidden lg:flex items-center justify-between pb-1 border-b border-gray-100">
          <span className="text-sm font-bold text-gray-900">ตัวกรองสินค้า</span>
          {hasActiveFilter && (
            <button
              onClick={clearAllFilters}
              className="text-xs font-semibold text-rose-500 hover:underline"
            >
              ล้างทั้งหมด
            </button>
          )}
        </div>
      {/* 1. หมวดหมู่ */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">หมวดหมู่</h3>
        <div className="space-y-1.5 text-xs sm:text-sm">
          <button
            onClick={() => updateParam("category", "")}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
              currentCategory === ""
                ? "bg-emerald-50 font-bold text-emerald-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                currentCategory === "" ? "bg-emerald-600" : "bg-gray-300"
              }`}
            />
            <span>ทั้งหมด</span>
          </button>

          {categories.map((cat) => {
            const isActive = currentCategory === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => updateParam("category", cat.slug)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                  isActive
                    ? "bg-emerald-50 font-bold text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`h-2 w-2 rounded-full ${
                    isActive ? "bg-emerald-600" : "bg-gray-300"
                  }`}
                />
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* 2. ราคา */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 mb-3">ราคา</h3>
        <div className="space-y-1.5 text-xs sm:text-sm">
          {priceRanges.map((pr) => {
            const isActive = currentPriceRange === pr.value;
            return (
              <button
                key={pr.value}
                onClick={() => updateParam("priceRange", pr.value)}
                className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                  isActive
                    ? "bg-emerald-50 font-bold text-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span
                  className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${
                    isActive
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-gray-300 bg-white"
                  }`}
                >
                  {isActive && <span className="h-1.5 w-1.5 bg-white rounded-full" />}
                </span>
                <span>{pr.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  </aside>
  );
}
