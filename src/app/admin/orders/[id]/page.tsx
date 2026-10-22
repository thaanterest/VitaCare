import { prisma } from "@/lib/prisma";
import { formatPriceWithSymbol } from "@/lib/money";
import { ORDER_STATUS_LABELS } from "@/lib/order-status";
import Link from "next/link";
import { notFound } from "next/navigation";
import StatusUpdateClient from "./StatusUpdateClient";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      items: true,
      user: { select: { name: true, email: true } },
    }
  });

  if (!order) {
    notFound();
  }

  const address = JSON.parse(order.shippingAddressSnapshot as string);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">รายละเอียดคำสั่งซื้อ: {order.orderNumber}</h1>
        <Link href="/admin/orders" className="text-sm font-medium text-primary-600 hover:underline">
          &larr; กลับไปหน้ารวมคำสั่งซื้อ
        </Link>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <StatusUpdateClient orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">รายการสินค้า</h2>
              <span className="text-sm text-gray-500">{order.items.length} รายการ</span>
            </div>
            <ul className="divide-y divide-gray-100">
              {order.items.map((item) => (
                <li key={item.id} className="p-6 flex justify-between">
                  <div>
                    <p className="font-medium text-gray-900">
                      <Link href={`/admin/products/${item.productId}/edit`} className="hover:text-primary-600 hover:underline">
                        {item.productNameSnapshot}
                      </Link>
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {formatPriceWithSymbol(item.unitPriceSnapshot)} x {item.quantity}
                    </p>
                  </div>
                  <p className="font-bold text-gray-900">{formatPriceWithSymbol(item.lineTotal)}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-8">
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="font-bold text-gray-900">สรุปการสั่งซื้อ</h2>
            </div>
            <div className="p-6 space-y-4 text-sm text-gray-600">
              <div className="flex justify-between"><dt>สถานะปัจจุบัน</dt><dd className="font-bold text-primary-700">{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS] || order.status}</dd></div>
              <div className="flex justify-between"><dt>ยอดรวมสินค้า</dt><dd className="font-medium text-gray-900">{formatPriceWithSymbol(order.subtotal)}</dd></div>
              <div className="flex justify-between border-b border-gray-100 pb-4"><dt>ค่าจัดส่ง</dt><dd className="font-medium text-gray-900">{order.shippingFee === 0 ? "ส่งฟรี" : formatPriceWithSymbol(order.shippingFee)}</dd></div>
              <div className="flex justify-between pt-2"><dt className="text-base font-bold text-gray-900">ยอดสุทธิ</dt><dd className="text-lg font-bold text-primary-700">{formatPriceWithSymbol(order.total)}</dd></div>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="border-b border-gray-100 bg-gray-50 px-6 py-4">
              <h2 className="font-bold text-gray-900">ข้อมูลลูกค้า & จัดส่ง</h2>
            </div>
            <div className="p-6 text-sm text-gray-600 space-y-3">
              <div>
                <p className="text-xs text-gray-500 mb-1">บัญชีผู้ใช้</p>
                <p className="font-medium text-gray-900">{order.user.name}</p>
                <p>{order.user.email}</p>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">ที่อยู่จัดส่ง</p>
                <p className="font-medium text-gray-900">{address.recipientName}</p>
                <p>โทร. {address.phone}</p>
                <p className="mt-1">{address.line1}</p>
                <p>แขวง/ตำบล {address.subdistrict} เขต/อำเภอ {address.district}</p>
                <p>จังหวัด {address.province} {address.postalCode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
