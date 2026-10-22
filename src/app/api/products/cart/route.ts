import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productIds } = await request.json();

    if (!Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ products: [] });
    }

    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        // ดึงมาหมดแม้ isActive=false เพื่อจะได้แจ้งเตือนลูกค้าว่าสินค้านี้ถูกยกเลิกแล้ว
      },
      select: {
        id: true,
        name: true,
        price: true,
        stock: true,
        isActive: true,
        imageUrl: true,
        slug: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Cart API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
