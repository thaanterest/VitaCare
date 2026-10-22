import { getProducts, getCategories } from "@/services/product";
import ProductFilters from "@/components/product/ProductFilters";
import ProductCard from "@/components/product/ProductCard";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  const products = await getProducts(resolvedParams);
  const categories = await getCategories();

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Title & Count */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
            สินค้าทั้งหมด
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500">
            พบสินค้าทั้งหมด {products.length} รายการ
          </p>
        </div>

        {/* Sort Select */}
        <form method="GET" className="flex items-center gap-2">
          {resolvedParams.category && (
            <input type="hidden" name="category" value={resolvedParams.category} />
          )}
          {resolvedParams.priceRange && (
            <input type="hidden" name="priceRange" value={resolvedParams.priceRange} />
          )}
          {resolvedParams.search && (
            <input type="hidden" name="search" value={resolvedParams.search} />
          )}
          <span className="text-xs text-gray-500 shrink-0">เรียงตาม:</span>
          <select
            name="sort"
            defaultValue={resolvedParams.sort || "popularity"}
            className="rounded-xl border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-xs font-medium text-gray-700 shadow-sm focus:border-emerald-500 focus:outline-none"
          >
            <option value="popularity">ความนิยม</option>
            <option value="newest">ใหม่ล่าสุด</option>
            <option value="price-asc">ราคา: ต่ำไปสูง</option>
            <option value="price-desc">ราคา: สูงไปต่ำ</option>
          </select>
        </form>
      </div>

      {/* Main Layout: Sidebar on Left, Products on Right */}
      <div className="flex flex-col gap-6 lg:gap-8 lg:flex-row lg:items-start">
        {/* Left Sidebar */}
        <ProductFilters categories={categories} />

        {/* Right Product Grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 sm:p-16 text-center shadow-sm">
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
              </div>
              <h3 className="text-base font-bold text-gray-900">ไม่พบสินค้าที่ตรงกับเงื่อนไข</h3>
              <p className="mt-1 text-xs text-gray-500">ลองล้างตัวกรอง หรือค้นหาด้วยคำใหม่อีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-3 xl:gap-5">
              {products.map((product, idx) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  name={product.name}
                  price={product.price}
                  imageUrl={product.imageUrl}
                  categoryName={product.category.name}
                  stock={product.stock}
                  badge={idx === 0 ? "Best Seller" : idx === 4 ? "New" : undefined}
                  rating={4.8}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
