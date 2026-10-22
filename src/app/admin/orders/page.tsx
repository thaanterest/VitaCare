import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPriceWithSymbol } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const page = parseInt(resolvedParams.page || "1");
  const limit = 20;
  const skip = (page - 1) * limit;
  const statusFilter = resolvedParams.status || "";
  const q = resolvedParams.q || "";

  // Build where clause
  const where: any = {};
  
  if (statusFilter) {
    where.status = statusFilter;
  }

  if (q) {
    where.OR = [
      { orderNumber: { contains: q } },
      { user: { email: { contains: q } } },
    ];
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { user: { select: { email: true, name: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">จัดการคำสั่งซื้อ</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Filters - Simple Server Component Forms approach */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <form className="flex flex-col sm:flex-row gap-4">
            <input 
              name="q"
              type="text" 
              defaultValue={q}
              placeholder="ค้นหาเลขที่ออเดอร์, อีเมลลูกค้า..." 
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2 text-sm focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            />
            <select 
              name="status"
              defaultValue={statusFilter}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
            >
              <option value="">ทุกสถานะ</option>
              {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button type="submit" className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm font-medium">ค้นหา</button>
            {(q || statusFilter) && (
              <Link href="/admin/orders" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium text-center">
                ล้าง
              </Link>
            )}
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">เลขที่คำสั่งซื้อ</th>
                <th className="px-6 py-4">วันที่</th>
                <th className="px-6 py-4">ลูกค้า</th>
                <th className="px-6 py-4 text-right">ยอดรวม</th>
                <th className="px-6 py-4 text-center">สถานะ</th>
                <th className="px-6 py-4 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900">{order.orderNumber}</td>
                  <td className="px-6 py-4 text-gray-600">{order.createdAt.toLocaleDateString('th-TH')}</td>
                  <td className="px-6 py-4">
                    <p className="text-gray-900">{order.user.name}</p>
                    <p className="text-xs text-gray-500">{order.user.email}</p>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-gray-900">{formatPriceWithSymbol(order.total)}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <Link href={`/admin/orders/${order.id}`} className="text-blue-600 hover:underline font-medium">
                      ดูรายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">ไม่พบข้อมูลคำสั่งซื้อ</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-100 flex justify-center gap-2 bg-gray-50">
            {page > 1 && (
              <Link 
                href={`/admin/orders?page=${page - 1}&q=${q}&status=${statusFilter}`}
                className="px-3 py-1 rounded border border-gray-300 bg-white"
              >
                ก่อนหน้า
              </Link>
            )}
            <span className="px-4 py-1 text-gray-600">หน้า {page} จาก {totalPages}</span>
            {page < totalPages && (
              <Link 
                href={`/admin/orders?page=${page + 1}&q=${q}&status=${statusFilter}`}
                className="px-3 py-1 rounded border border-gray-300 bg-white"
              >
                ถัดไป
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
