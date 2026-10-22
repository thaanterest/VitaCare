import { getProductBySlug } from "@/services/product";
import { formatPriceWithSymbol } from "@/lib/money";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import AddToCartButton from "@/components/product/AddToCartButton";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProductBySlug(resolvedParams.slug);

  if (!product) {
    notFound();
  }

  // คำนวณราคาเต็มจำลอง เพื่อแสดงส่วนลดเหมือนใน mockup
  const originalPrice = Math.round(product.price * 1.28);
  const discountPercent = Math.round(((originalPrice - product.price) / originalPrice) * 100);

  // จุดเด่นสินค้าตามหมวดหมู่
  const defaultFeatures = [
    "ช่วยบำรุงหัวใจและหลอดเลือด",
    "บำรุงสมองและความจำ เสริมสมาธิ",
    "ลดการอักเสบของร่างกาย เสริมภูมิคุ้มกัน",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-gray-500">
        <ol className="flex items-center space-x-2">
          <li>
            <Link href="/" className="hover:text-emerald-600 transition-colors">หน้าแรก</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li>
            <Link href="/products" className="hover:text-emerald-600 transition-colors">สินค้าทั้งหมด</Link>
          </li>
          <li className="text-gray-300">/</li>
          <li className="font-semibold text-gray-800" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
        {/* Left: Gallery (Thumbnails + Big Image) */}
        <div className="lg:col-span-6 flex flex-col-reverse sm:flex-row gap-4">
          {/* Thumbnails */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            {[product.imageUrl, product.imageUrl, product.imageUrl].map((img, i) => (
              <div
                key={i}
                className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-2xl border-2 p-2 bg-white cursor-pointer transition-all ${
                  i === 0 ? "border-emerald-500 shadow-sm" : "border-gray-200 opacity-70 hover:opacity-100"
                }`}
              >
                <Image src={img} alt="thumbnail" fill className="object-contain p-1" unoptimized />
              </div>
            ))}
          </div>

          {/* Big Preview Image */}
          <div className="relative aspect-square flex-1 overflow-hidden rounded-3xl border border-gray-100 bg-white p-8 shadow-sm flex items-center justify-center">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-contain p-6"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Right: Product Info & Purchase Options */}
        <div className="lg:col-span-6 flex flex-col justify-center space-y-6">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              {product.category.name}
            </span>
            <h1 className="mt-1 text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {product.name}
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              อาหารเสริมเกรดพรีเมียม มาตรฐานการผลิตระดับสากล
            </p>

            {/* Stars & Reviews */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex text-amber-400 text-sm">★★★★★</div>
              <span className="text-xs font-bold text-gray-800">4.8</span>
              <span className="text-xs text-gray-400">(98 รีวิว)</span>
            </div>
          </div>

          {/* Price & Discount */}
          <div className="flex items-baseline gap-3 rounded-2xl bg-gray-50/80 p-4 border border-gray-100">
            <span className="text-3xl font-black text-emerald-700">
              {formatPriceWithSymbol(product.price)}
            </span>
            <span className="text-base text-gray-400 line-through">
              {formatPriceWithSymbol(originalPrice)}
            </span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
              ลด {discountPercent}%
            </span>
          </div>

          {/* Key Bullet Features */}
          <div className="space-y-2.5">
            {defaultFeatures.map((feat, index) => (
              <div key={index} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 text-xs font-black">
                  ✓
                </span>
                <span>{feat}</span>
              </div>
            ))}
          </div>

          {/* Add to Cart Stepper & CTA */}
          <div className="pt-2">
            <AddToCartButton productId={product.id} stock={product.stock} />
          </div>

          {/* Stock info */}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span className={`h-2 w-2 rounded-full ${product.stock > 0 ? "bg-emerald-500" : "bg-red-500"}`} />
            <span>
              {product.stock > 0
                ? `มีสินค้าในสต็อกพร้อมส่งทันที (${product.stock} ชิ้น)`
                : "สินค้าหมดชั่วคราว"}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs: รายละเอียดสินค้า & รีวิว */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex border-b border-gray-100 gap-8">
          <button className="border-b-2 border-emerald-600 pb-3 text-sm font-bold text-emerald-700">
            รายละเอียดสินค้า
          </button>
          <button className="pb-3 text-sm font-semibold text-gray-400 hover:text-gray-600">
            รีวิว (98)
          </button>
        </div>

        <div className="text-sm leading-relaxed text-gray-600 space-y-4 max-w-3xl">
          <p>{product.description}</p>
          <p className="text-xs text-gray-400 italic">
            * ข้อมูลสินค้าเป็นตัวอย่างเพื่อการศึกษา ไม่ใช่วิตามินจริงและไม่มีสรรพคุณในการรักษาโรคโดยตรง
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4 p-2">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-bold text-gray-900">ของแท้ 100%</h4>
            <p className="text-xs text-gray-500">การันตีคุณภาพทุกชิ้น</p>
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
            <p className="text-xs text-gray-500">เมื่อสั่งซื้อครบ ฿1,000</p>
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
            <p className="text-xs text-gray-500">ภายใน 7 วันอย่างมั่นใจ</p>
          </div>
        </div>
      </div>
    </div>
  );
}
