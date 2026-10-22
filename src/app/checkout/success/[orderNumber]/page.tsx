import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPriceWithSymbol } from "@/lib/money";
import { notFound } from "next/navigation";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = await params;
  
  const order = await prisma.order.findUnique({
    where: { orderNumber: resolvedParams.orderNumber },
  });

  if (!order) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 text-center">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
      </div>
      
      <h1 className="text-3xl font-bold text-gray-900 mb-2">สั่งซื้อสำเร็จ!</h1>
      <p className="text-lg text-gray-600 mb-8">
        ขอบคุณสำหรับการสั่งซื้อ หมายเลขคำสั่งซื้อของคุณคือ <span className="font-bold text-primary-600">{order.orderNumber}</span>
      </p>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm mb-8 text-left max-w-md mx-auto">
        <h2 className="text-lg font-medium text-gray-900 mb-4">ยอดชำระเงิน</h2>
        <div className="flex justify-between items-center text-xl font-bold text-gray-900">
          <span>รวมทั้งสิ้น</span>
          <span className="text-primary-700">{formatPriceWithSymbol(order.total)}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          href={`/account/orders/${order.orderNumber}`}
          className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50"
        >
          ดูรายละเอียดคำสั่งซื้อ
        </Link>
        <Link 
          href="/products"
          className="rounded-xl bg-primary-600 px-8 py-3 font-medium text-white shadow-sm transition-all hover:bg-primary-700"
        >
          กลับไปช้อปปิ้งต่อ
        </Link>
      </div>
    </div>
  );
}
