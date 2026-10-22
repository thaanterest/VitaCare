import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPriceWithSymbol } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import Link from "next/link";
import { redirect } from "next/navigation";

function StatusBadge({ status }: { status: string }) {
  const label = ORDER_STATUS_LABELS[status as keyof typeof ORDER_STATUS_LABELS] || status;
  
  let colorClass = "bg-gray-100 text-gray-700";
  if (status === "PENDING_PAYMENT") colorClass = "bg-amber-50 text-amber-700 border border-amber-200";
  else if (status === "PAID") colorClass = "bg-emerald-50 text-emerald-700 border border-emerald-200";
  else if (status === "SHIPPED") colorClass = "bg-sky-50 text-sky-700 border border-sky-200";
  else if (status === "DELIVERED") colorClass = "bg-teal-50 text-teal-700 border border-teal-200";
  else if (status === "CANCELLED") colorClass = "bg-red-50 text-red-700 border border-red-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
      {label}
    </span>
  );
}

export default async function AccountOrdersPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const resolvedParams = await searchParams;
  const currentStatus = resolvedParams?.status || "ALL";

  const whereClause: { userId: string; status?: string } = {
    userId: session.user.id,
  };

  if (currentStatus !== "ALL") {
    whereClause.status = currentStatus;
  }

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
    }
  });

  const filterTabs = [
    { label: "ทั้งหมด", value: "ALL" },
    { label: "รอชำระเงิน", value: "PENDING_PAYMENT" },
    { label: "ชำระแล้ว", value: "PAID" },
    { label: "กำลังจัดส่ง", value: "SHIPPED" },
    { label: "สำเร็จ", value: "DELIVERED" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
          ประวัติการสั่งซื้อ
        </h1>
        <Link href="/account" className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">
          ← กลับหน้าบัญชี
        </Link>
      </div>

      {/* Filter Tabs (Mockup Screen 7) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = currentStatus === tab.value;
          return (
            <Link
              key={tab.value}
              href={`/account/orders?status=${tab.value}`}
              className={`rounded-full px-4 py-1.5 text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl border border-gray-100 bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-400">
            📦
          </div>
          <p className="text-sm font-semibold text-gray-600">ยังไม่มีรายการสั่งซื้อในหมวดนี้</p>
          <Link
            href="/products"
            className="mt-4 inline-flex rounded-full bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            เลือกซื้อสินค้า
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition-all"
            >
              {/* Order Info */}
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 text-xl">
                  📄
                </div>
                <div>
                  <h3 className="font-mono text-sm font-black text-gray-900">
                    #{order.orderNumber}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {order.createdAt.toLocaleDateString("th-TH", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Price */}
              <div className="text-sm sm:text-base font-extrabold text-gray-900">
                {formatPriceWithSymbol(order.total)}
              </div>

              {/* Status & Action */}
              <div className="flex items-center justify-between sm:justify-end gap-4">
                <StatusBadge status={order.status} />
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
                >
                  <span>ดูรายละเอียด</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
