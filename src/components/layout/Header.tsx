"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

export default function Header() {
  const { data: session } = useSession();
  const { totalItems } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <header className="sticky top-0 z-40 w-full border-b border-primary-100 bg-white/80 backdrop-blur-lg">
      <a href="#main-content" className="skip-link">
        ข้ามไปยังเนื้อหาหลัก
      </a>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* โลโก้ */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-transform hover:scale-105"
        >
          <Image
            src="/logo.png"
            alt="VitaCare Logo"
            width={42}
            height={42}
            className="h-10 w-10 rounded-xl object-contain drop-shadow-sm"
            priority
          />
          <div className="flex flex-col">
            <span className="text-xl font-black tracking-tight leading-none text-emerald-600">
              Vita<span className="text-sky-500">Care</span>
            </span>
            <span className="text-[9px] font-semibold tracking-wider text-gray-500 leading-none mt-0.5">
              Better Health, Brighter You
            </span>
          </div>
        </Link>

        {/* Navigation - Desktop */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="เมนูหลัก"
        >
          <Link
            href="/"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            หน้าแรก
          </Link>
          <Link
            href="/products"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            หมวดหมู่สินค้า
          </Link>
          <Link
            href="/cookie-policy"
            className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
          >
            นโยบาย
          </Link>
          {isAdmin && (
            <Link
              href="/admin"
              className="rounded-lg px-3 py-2 text-sm font-medium text-amber-700 transition-colors hover:bg-amber-50"
            >
              จัดการระบบ
            </Link>
          )}
        </nav>

        {/* Search Bar - Center */}
        <form action="/products" method="GET" className="hidden lg:flex items-center relative max-w-xs w-full mx-4">
          <input
            type="text"
            name="search"
            placeholder="ค้นหาวิตามิน, อาหารเสริม..."
            className="w-full rounded-full border border-gray-200 bg-gray-50/80 py-1.5 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
          />
          <svg className="absolute left-3 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </form>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* ตะกร้า */}
          <Link
            href="/cart"
            className="relative rounded-lg p-2 text-gray-600 transition-colors hover:bg-primary-50 hover:text-primary-700"
            aria-label="ตะกร้าสินค้า"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {totalItems > 99 ? '99+' : totalItems}
              </span>
            )}
          </Link>

          {/* User menu */}
          {session?.user ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/90 py-1 pl-1 pr-3 text-sm font-medium text-gray-700 shadow-sm transition hover:border-emerald-300 hover:bg-emerald-50/50"
                aria-label="เมนูผู้ใช้"
                aria-expanded={isUserMenuOpen}
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-600 font-bold text-xs text-white">
                  {session.user.name ? session.user.name.charAt(0) : "U"}
                </div>
                <span className="max-w-[120px] truncate text-xs font-semibold sm:text-sm">
                  {session.user.name}
                </span>
                <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">เข้าสู่ระบบในชื่อ</p>
                    <p className="text-sm font-bold text-gray-800 truncate">{session.user.name}</p>
                    <p className="text-[11px] text-gray-500 truncate">{session.user.email}</p>
                  </div>
                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <span>👤</span>
                    <span>ข้อมูลส่วนตัว</span>
                  </Link>
                  <Link
                    href="/account/orders"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition"
                  >
                    <span>📦</span>
                    <span>ประวัติคำสั่งซื้อ</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium text-amber-700 hover:bg-amber-50 transition"
                    >
                      <span>🛡️</span>
                      <span>จัดการระบบ (Admin)</span>
                    </Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs sm:text-sm font-medium text-red-600 hover:bg-red-50 transition"
                  >
                    <span>🚪</span>
                    <span>ออกจากระบบ</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-emerald-600 px-4 py-2 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 active:scale-95"
            >
              เข้าสู่ระบบ
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="rounded-lg p-2 text-gray-600 hover:bg-primary-50 md:hidden"
            aria-label="เมนู"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="border-t border-gray-100 bg-white/95 backdrop-blur-md px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top-2 duration-200"
          aria-label="เมนูมือถือ"
        >
          {/* Mobile Search */}
          <form
            action="/products"
            method="GET"
            onSubmit={() => setIsMobileMenuOpen(false)}
            className="relative mb-3 w-full"
          >
            <input
              type="text"
              name="search"
              placeholder="ค้นหาวิตามิน, อาหารเสริม..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 focus:border-emerald-500 focus:bg-white focus:outline-none"
            />
            <svg className="absolute left-3 top-2.5 h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
          </form>

          <nav className="space-y-1">
            <Link
              href="/"
              className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              หน้าแรก
            </Link>
            <Link
              href="/products"
              className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              หมวดหมู่สินค้า
            </Link>
            <Link
              href="/cookie-policy"
              className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-gray-700 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              นโยบาย
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center rounded-xl px-3 py-2.5 text-sm font-semibold text-amber-700 bg-amber-50/60 hover:bg-amber-100 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                จัดการระบบ (Admin)
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
