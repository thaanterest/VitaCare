import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import ProfileForm from "./ProfileForm";

export default async function AccountPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Sidebar Menu (Screen 6 Mockup) */}
        <div className="md:col-span-4 space-y-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm space-y-1">
            <Link
              href="/account"
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 transition-colors"
            >
              <span className="text-base">👤</span>
              <span>ข้อมูลส่วนตัว</span>
            </Link>

            <Link
              href="/account/addresses"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base">📍</span>
              <span>ที่อยู่จัดส่ง</span>
            </Link>

            <Link
              href="/account/orders"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base">📦</span>
              <span>ประวัติการสั่งซื้อ</span>
            </Link>

            <Link
              href="/products"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base">❤️</span>
              <span>รายการโปรด</span>
            </Link>

            <Link
              href="/cookie-policy"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base">🛡️</span>
              <span>ตั้งค่าความเป็นส่วนตัว</span>
            </Link>
          </div>
        </div>

        {/* Right Content Card (Screen 6 Mockup) */}
        <div className="md:col-span-8">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-black text-gray-900 tracking-tight">
              ข้อมูลส่วนตัว
            </h2>

            {/* User Profile Header Card */}
            <div className="flex items-center justify-between rounded-2xl bg-gray-50/70 p-4 border border-gray-100">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-500 text-white font-bold text-lg shadow-sm">
                  {user.name ? user.name.charAt(0) : "U"}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{user.name}</h3>
                  <p className="text-xs text-gray-400">{user.email}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-emerald-600 cursor-pointer">
                แก้ไข
              </span>
            </div>

            {/* Profile Form */}
            <ProfileForm user={user} />
          </div>
        </div>
      </div>
    </div>
  );
}
