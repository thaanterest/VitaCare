"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

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

  const currentCategory = searchParams.get("category") || "";
  const currentPriceRange = searchParams.get("priceRange") || "";

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

  return (
    <aside className="w-full lg:w-64 shrink-0 space-y-6 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
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
    </aside>
  );
}
