import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import AddressManagerClient from "./AddressManagerClient";

export default async function AccountAddressesPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/account/addresses");
  }

  const [user, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, phone: true },
    }),
    prisma.address.findMany({
      where: { userId: session.user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Sidebar Menu (Screen 6 Mockup) */}
        <div className="md:col-span-4 space-y-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-3 shadow-sm space-y-1">
            <Link
              href="/account"
              className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <span className="text-base">👤</span>
              <span>ข้อมูลส่วนตัว</span>
            </Link>

            <Link
              href="/account/addresses"
              className="flex items-center gap-3 rounded-xl bg-emerald-50 px-3.5 py-2.5 text-xs sm:text-sm font-bold text-emerald-700 transition-colors"
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
              <span className="text-base">🛍️</span>
              <span>เลือกซื้อสินค้า</span>
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

        {/* Right Main Content Panel */}
        <div className="md:col-span-8">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
            <AddressManagerClient
              initialAddresses={addresses}
              defaultName={user?.name || ""}
              defaultPhone={user?.phone || ""}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
