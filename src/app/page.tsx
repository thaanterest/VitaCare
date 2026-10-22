import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import ProductCard from "@/components/product/ProductCard";

export default async function HomePage() {
  // ดึงสินค้าขายดีจากฐานข้อมูล
  const bestSellers = await prisma.product.findMany({
    where: { isActive: true },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  const categoriesList = [
    {
      name: "วิตามินรวม",
      slug: "multivitamins",
      bg: "bg-blue-50/80 text-blue-600 border-blue-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
      ),
    },
    {
      name: "ภูมิคุ้มกัน",
      slug: "immunity",
      bg: "bg-emerald-50/80 text-emerald-600 border-emerald-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <path d="M12 8v8" />
          <path d="M8 12h8" />
        </svg>
      ),
    },
    {
      name: "ผิวพรรณ",
      slug: "beauty",
      bg: "bg-rose-50/80 text-rose-500 border-rose-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
          <circle cx="12" cy="13" r="2.5" />
        </svg>
      ),
    },
    {
      name: "สมองและความจำ",
      slug: "brain",
      bg: "bg-indigo-50/80 text-indigo-600 border-indigo-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
          <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" />
        </svg>
      ),
    },
    {
      name: "กระดูกและข้อ",
      slug: "bone-health",
      bg: "bg-amber-50/80 text-amber-600 border-amber-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 10c.7-.7 1.6-1 2.5-1a3.5 3.5 0 0 1 0 7c-.9 0-1.8-.3-2.5-1l-10-10C6.3 4.3 5.4 4 4.5 4a3.5 3.5 0 0 0 0 7c.9 0 1.8.3 2.5 1l10 10c.7.7 1.6 1 2.5 1a3.5 3.5 0 0 0 0-7c-.9 0-1.8-.3-2.5-1l-10-10" />
        </svg>
      ),
    },
    {
      name: "อาหารเสริมอื่นๆ",
      slug: "others",
      bg: "bg-teal-50/80 text-teal-600 border-teal-100/60",
      icon: (
        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 20A7 7 0 0 1 4 13a7 7 0 0 1 12.3-4.7A7 7 0 0 1 20 15a7 7 0 0 1-7 7h-2z" />
          <path d="M12 20v-8" />
          <path d="M16 12l-4 4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#eff6ff] via-[#e0f2fe] to-[#cfe6fc] py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100/80 px-3.5 py-1 text-xs font-semibold text-blue-800">
                <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
                วิตามินและอาหารเสริมมาตรฐานสากล
              </div>
              <h1 className="text-3xl font-black tracking-tight text-blue-950 sm:text-5xl lg:text-6xl leading-[1.15]">
                ดูแลสุขภาพวันนี้
                <br />
                <span className="text-blue-600">เพื่อคุณในอนาคต</span>
              </h1>
              <p className="max-w-lg text-sm sm:text-base text-gray-600 leading-relaxed">
                วิตามินและอาหารเสริมคุณภาพดี เพื่อสุขภาพที่แข็งแรงในทุกๆ วัน
                คัดสรรสูตรเข้มข้น ปลอดภัย ส่งตรงถึงมือคุณอย่างรวดเร็ว
              </p>
              <div className="pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-bold text-white shadow-md shadow-blue-600/25 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95"
                >
                  <span>ช้อปเลย</span>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Right Hero Image */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="relative h-72 w-72 sm:h-88 sm:w-88 md:h-96 md:w-96 overflow-hidden rounded-3xl shadow-xl border-4 border-white">
                <Image
                  src="/hero-banner.jpg"
                  alt="VitaCare Supplements"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Icon Bar */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {categoriesList.map((cat) => (
            <Link
              key={cat.slug}
              href={`/products?category=${cat.slug}`}
              className="group flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-md"
            >
              <div
                className={`mb-3 flex h-14 w-14 items-center justify-center rounded-2xl border ${cat.bg} shadow-sm transition-transform duration-200 group-hover:scale-105`}
              >
                {cat.icon}
              </div>
              <span className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-emerald-700 text-center tracking-tight">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. สินค้าขายดี (Best Sellers) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              สินค้าขายดี
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">วิตามินยอดนิยมที่ลูกค้าไว้วางใจมากที่สุด</p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs sm:text-sm font-bold text-emerald-600 transition-colors hover:text-emerald-700"
          >
            <span>ดูทั้งหมด</span>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:gap-6">
          {bestSellers.map((product, idx) => (
            <ProductCard
              key={product.id}
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              categoryName={product.category.name}
              stock={product.stock}
              badge={idx === 0 ? "Best Seller" : idx === 1 ? "New" : undefined}
              rating={4.8}
            />
          ))}
        </div>
      </section>

      {/* 4. Trust Badges Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-4 p-2">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">ของแท้ 100%</h4>
              <p className="text-xs text-gray-500">รับประกันคุณภาพจากแบรนด์ชั้นนำ</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 border-t sm:border-t-0 sm:border-l border-gray-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0H6.375m11.25-3V6.375a1.125 1.125 0 0 0-1.125-1.125H3.375a1.125 1.125 0 0 0-1.125 1.125v11.25" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">จัดส่งฟรี</h4>
              <p className="text-xs text-gray-500">เมื่อสั่งซื้อครบ ฿1,000 ทั่วประเทศ</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 border-t sm:border-t-0 sm:border-l border-gray-100">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-900">เปลี่ยน/คืนสินค้า</h4>
              <p className="text-xs text-gray-500">คืนสินค้าได้ภายใน 7 วันอย่างมั่นใจ</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
