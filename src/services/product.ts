import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

type ProductFilters = {
  q?: string;
  search?: string;
  category?: string;
  sort?: string;
  priceRange?: string;
};

export async function getProducts(filters?: ProductFilters) {
  const where: Prisma.ProductWhereInput = {
    isActive: true,
  };

  const query = filters?.search || filters?.q;
  if (query) {
    where.OR = [
      { name: { contains: query } },
      { description: { contains: query } },
    ];
  }

  if (filters?.category) {
    where.category = {
      slug: filters.category,
    };
  }

  if (filters?.priceRange) {
    if (filters.priceRange === "under-300") {
      where.price = { lt: 30000 };
    } else if (filters.priceRange === "300-500") {
      where.price = { gte: 30000, lte: 50000 };
    } else if (filters.priceRange === "501-800") {
      where.price = { gte: 50100, lte: 80000 };
    } else if (filters.priceRange === "over-800") {
      where.price = { gt: 80000 };
    }
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  
  if (filters?.sort === "price-asc") {
    orderBy = { price: "asc" };
  } else if (filters?.sort === "price-desc") {
    orderBy = { price: "desc" };
  } else if (filters?.sort === "popularity") {
    orderBy = { stock: "asc" }; // สินค้าที่เหลือน้อยกว่า / ขายดีกว่า
  }

  return await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return await prisma.product.findUnique({
    where: { slug, isActive: true },
    include: { category: true },
  });
}

export async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: "asc" },
  });
}
