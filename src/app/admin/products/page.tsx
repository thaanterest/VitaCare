import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Prisma } from "@prisma/client";
import ProductListClient from "./ProductListClient";

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const resolvedParams = await searchParams;
  
  const page = parseInt(resolvedParams.page || "1");
  const limit = 10;
  const skip = (page - 1) * limit;
  const q = resolvedParams.q || "";
  const cat = resolvedParams.category || "";
  const stockFilter = resolvedParams.stock || ""; // "low", "out"

  // Build where clause
  const where: Prisma.ProductWhereInput = {};
  
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
    ];
  }
  
  if (cat) {
    where.categoryId = cat;
  }

  if (stockFilter === "out") {
    where.stock = 0;
  } else if (stockFilter === "low") {
    // Cannot directly compare field with field in simple where, but we can do it via raw or just fetch and filter,
    // but actually Prisma allows lte: threshold if it's constant, but threshold is per product.
    // However, Prisma doesn't support comparing two columns directly in standard findMany easily unless using raw.
    // So if stockFilter === "low", we can just fetch all or we can use where stock <= 10 as a simple approximation 
    // or just fetch everything and filter in memory if the dataset is small. 
    // For this project, let's just use raw query or approximation.
    // Actually, Prisma does not support `where: { stock: { lte: prisma.product.fields.lowStockThreshold } }` in findMany natively for SQLite without raw.
    // Wait, since Prisma v5, we might not be able to use field references in where.
    // Let's filter in memory for 'low' if it's too complex, or just use a fixed number if not strictly required.
    // The prompt says: กรอง "สต็อกต่ำ" / "หมด". 
  }

  // Fetch data
  const productsRaw = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  // Memory filter for 'low' stock
  let filteredProducts = productsRaw;
  if (stockFilter === "low") {
    filteredProducts = productsRaw.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold);
  }

  const total = filteredProducts.length;
  const totalPages = Math.ceil(total / limit);
  const products = filteredProducts.slice(skip, skip + limit);

  const categories = await prisma.category.findMany();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">จัดการสินค้า</h1>
        <Link 
          href="/admin/products/new"
          className="bg-primary-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors"
        >
          + เพิ่มสินค้าใหม่
        </Link>
      </div>

      <ProductListClient 
        initialProducts={products}
        categories={categories}
        totalPages={totalPages}
        currentPage={page}
      />
    </div>
  );
}
