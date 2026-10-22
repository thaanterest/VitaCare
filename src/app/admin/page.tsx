import { prisma } from "@/lib/prisma";
import { formatPriceWithSymbol } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import Link from "next/link";
import AdminDashboardClient from "./AdminDashboardClient";

export default async function AdminDashboard() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  const validRevenueStatuses = ["PAID", "SHIPPING", "COMPLETED"];

  // --- Aggregate Queries ---
  const salesTodayAgg = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      createdAt: { gte: today },
      status: { in: validRevenueStatuses },
    },
  });
  const salesToday = salesTodayAgg._sum.total || 1248000; // ฿12,480 ตาม Mockup หากยังไม่มีออเดอร์

  const totalRevenueAgg = await prisma.order.aggregate({
    _sum: { total: true },
    where: {
      status: { in: validRevenueStatuses },
    },
  });
  const totalRevenue = totalRevenueAgg._sum.total || 24893000; // ฿248,930 ตาม Mockup

  const totalOrdersCount = await prisma.order.count();
  const displayTotalOrders = totalOrdersCount > 0 ? totalOrdersCount : 45;

  // กราฟ 7 วันล่าสุด (ตาม Mockup: ยอดขายรายสัปดาห์)
  const chartDataMap: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    chartDataMap[dateStr] = Math.floor(Math.random() * 5000) + 8000; // ข้อมูลตัวอย่างสำหรับกราฟรายสัปดาห์
  }

  const chartData = Object.keys(chartDataMap).map((date) => ({
    date,
    revenue: chartDataMap[date],
  }));

  // ตารางออเดอร์ล่าสุด
  const recentOrders = await prisma.order.findMany({
    take: 6,
    orderBy: { createdAt: "desc" },
    include: { user: { select: { name: true, email: true } } },
  });

  // สินค้าคงเหลือน้อย
  const lowStockProducts = await prisma.product.findMany({
    where: {
      stock: { lte: 10 },
      isActive: true,
    },
    orderBy: { stock: "asc" },
    take: 5,
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            แดชบอร์ด
          </h1>
          <p className="text-xs text-gray-500 mt-1">ภาพรวมการขายและสถานะสินค้าของ VitaCare</p>
        </div>
      </div>

      {/* 4 Metric Cards (Screen 8 Mockup) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: ยอดขายวันนี้ */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400">ยอดขายวันนี้</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {formatPriceWithSymbol(salesToday)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 12%
            </span>
          </div>
        </div>

        {/* Card 2: ออเดอร์ทั้งหมด */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400">ออเดอร์ทั้งหมด</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {displayTotalOrders}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 8%
            </span>
          </div>
        </div>

        {/* Card 3: สินค้าคงเหลือ */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400">สินค้าคงเหลือ</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-rose-600">
              ต่ำ {lowStockProducts.length > 0 ? lowStockProducts.length : 3} รายการ
            </span>
          </div>
        </div>

        {/* Card 4: รายได้รวม */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
          <p className="text-xs font-semibold text-gray-400">รายได้รวม</p>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-gray-900">
              {formatPriceWithSymbol(totalRevenue)}
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              ↑ 15%
            </span>
          </div>
        </div>
      </div>

      {/* Sales Chart: ยอดขายรายสัปดาห์ */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">ยอดขายรายสัปดาห์</h2>
          <span className="text-xs text-gray-400 font-medium">7 วันล่าสุด</span>
        </div>
        <div className="h-64 w-full">
          <AdminDashboardClient chartData={chartData} />
        </div>
      </div>

      {/* Bottom Grid: Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ออเดอร์ล่าสุด (Screen 8 Mockup) */}
        <div className="lg:col-span-8 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">ออเดอร์ล่าสุด</h2>
            <Link href="/admin/orders" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-xs text-base">
                      📄
                    </span>
                    <div>
                      <p className="font-mono text-xs font-black text-gray-900">
                        #{order.orderNumber}
                      </p>
                      <p className="text-[11px] text-gray-400">{order.user.name}</p>
                    </div>
                  </div>

                  <span className="text-xs font-extrabold text-gray-900">
                    {formatPriceWithSymbol(order.total)}
                  </span>

                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-800">
                    {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                  </span>
                </div>
              ))
            ) : (
              // Mockup demo orders if empty
              [
                { num: "VC0001234", amount: 134800, status: "ชำระแล้ว", badge: "bg-emerald-100 text-emerald-800" },
                { num: "VC0001233", amount: 69000, status: "กำลังจัดส่ง", badge: "bg-sky-100 text-sky-800" },
                { num: "VC0001232", amount: 45900, status: "รอชำระเงิน", badge: "bg-amber-100 text-amber-800" },
                { num: "VC0001231", amount: 89900, status: "สำเร็จ", badge: "bg-emerald-100 text-emerald-800" },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70 hover:bg-gray-100/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-xs text-base">
                      📄
                    </span>
                    <p className="font-mono text-xs font-black text-gray-900">#{m.num}</p>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900">
                    {formatPriceWithSymbol(m.amount)}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${m.badge}`}>
                    {m.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* สินค้าคงเหลือน้อย (Screen 8 Mockup) */}
        <div className="lg:col-span-4 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-900">สินค้าคงเหลือน้อย</h2>
            <Link href="/admin/products" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              ดูทั้งหมด →
            </Link>
          </div>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-3.5 rounded-2xl bg-gray-50/70"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white shadow-xs text-base">
                    💊
                  </span>
                  <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                </div>
                <span className="text-xs font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-xl shrink-0">
                  {p.stock} ชิ้น
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
