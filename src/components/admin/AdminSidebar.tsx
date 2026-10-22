"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

export default function AdminSidebar() {
  const pathname = usePathname();

  const links = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "จัดการสินค้า", href: "/admin/products", icon: "💊" },
    { name: "จัดการคำสั่งซื้อ", href: "/admin/orders", icon: "📦" },
    { name: "บันทึก Consent (PDPA)", href: "/admin/consent-logs", icon: "🔐" },
  ];

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen fixed top-0 left-0">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/logo.png"
            alt="VitaCare Logo"
            width={36}
            height={36}
            className="h-9 w-9 rounded-xl object-contain bg-white/10 p-0.5"
          />
          <div>
            <h2 className="text-xl font-black text-white leading-tight">
              Vita<span className="text-sky-400">Care</span>
            </h2>
            <p className="text-xs text-gray-400">Admin Portal</p>
          </div>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive ? "bg-primary-600 text-white font-medium" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span>{link.icon}</span>
              <span>{link.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link 
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-gray-800 hover:text-white transition-all"
        >
          <span>🏪</span>
          <span>กลับหน้าร้าน</span>
        </Link>
        <button 
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-gray-800 hover:text-red-300 transition-all text-left"
        >
          <span>🚪</span>
          <span>ออกจากระบบ</span>
        </button>
      </div>
    </aside>
  );
}
