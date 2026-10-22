import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("เริ่ม Seed ข้อมูล...");

  // 1. สร้าง Admin และ Customer (ทั้ง VitaCare และ AquaVita)
  const adminPassword = await hash(process.env.SEED_ADMIN_PASSWORD || "Admin@1234", 10);
  const customerPassword = await hash(process.env.SEED_CUSTOMER_PASSWORD || "Customer@1234", 10);

  const adminUsers = ["admin@vitacare.dev", "admin@aquavita.dev"];
  for (const email of adminUsers) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: adminPassword, role: "ADMIN" },
      create: {
        email,
        name: "ผู้ดูแลระบบ VitaCare",
        passwordHash: adminPassword,
        role: "ADMIN",
      },
    });
  }

  const customerUsers = ["customer@vitacare.dev", "customer@aquavita.dev"];
  for (const email of customerUsers) {
    await prisma.user.upsert({
      where: { email },
      update: { passwordHash: customerPassword, role: "CUSTOMER" },
      create: {
        email,
        name: "ลูกค้า สมมติ",
        passwordHash: customerPassword,
        role: "CUSTOMER",
      },
    });
  }
  console.log(`- ผู้ใช้สร้างเสร็จ: ${adminUsers.join(", ")}, ${customerUsers.join(", ")}`);

  // 2. สร้างหมวดหมู่ (ตาม UI Mockup 6 หมวดหมู่)
  const categoriesData = [
    { name: "วิตามินรวม", slug: "multivitamins" },
    { name: "ภูมิคุ้มกัน", slug: "immunity" },
    { name: "ผิวพรรณ", slug: "beauty" },
    { name: "สมองและความจำ", slug: "brain" },
    { name: "กระดูกและข้อ", slug: "bone-health" },
    { name: "อาหารเสริมอื่นๆ", slug: "others" },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  const categories = await prisma.category.findMany();
  console.log(`- หมวดหมู่สร้างเสร็จ: ${categories.length} รายการ`);

  // Helper ฟังก์ชันหา ID ของหมวดหมู่
  const getCatId = (slug: string) => categories.find((c) => c.slug === slug)?.id || categories[0].id;

  // 3. สร้างสินค้า (สอดคล้องกับ UI Mockup)
  const productsData = [
    // --- สินค้า Best Seller ตาม Mockup ---
    {
      name: "VitaCare Vitamin C 1000 mg",
      slug: "vitacare-vitamin-c-1000-mg",
      description: "วิตามินซีธรรมชาติ 1000 มก. เสริมภูมิคุ้มกันร่างกาย ดูดซึมง่าย ไม่ระคายเคืองกระเพาะ 90 แคปซูล",
      price: 29900, // 299.00 บาท
      imageUrl: "/products/vitamin-c.jpg",
      categoryId: getCatId("immunity"),
      stock: 120,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Fish Oil 1000 mg",
      slug: "vitacare-fish-oil-1000-mg",
      description: "Omega-3 สำหรับหัวใจและสมอง ช่วยบำรุงหัวใจและหลอดเลือด บำรุงสมองและความจำ ลดการอักเสบของร่างกาย 120 ซอฟท์เจล",
      price: 45900, // 459.00 บาท
      imageUrl: "/products/fish-oil.jpg",
      categoryId: getCatId("brain"),
      stock: 85,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Collagen Plus",
      slug: "vitacare-collagen-plus",
      description: "คอลลาเจนเข้มข้นเพื่อผิวพรรณสดใส นุ่มชุ่มชื้น บำรุงผิว ผม และเล็บอย่างล้ำลึก 120 แคปซูล",
      price: 69000, // 690.00 บาท
      imageUrl: "/products/collagen-plus.jpg",
      categoryId: getCatId("beauty"),
      stock: 5, // กำลังใกล้หมด
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Probiotic",
      slug: "vitacare-probiotic",
      description: "โพรไบโอติกส์เพื่อสุขภาพลำไส้และระบบย่อยอาหารที่ดี จุลินทรีย์มีชีวิต 50 พันล้าน CFU 60 แคปซูล",
      price: 55000, // 550.00 บาท
      imageUrl: "/products/probiotic.jpg",
      categoryId: getCatId("others"),
      stock: 8, // ใกล้หมด
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Multivitamin",
      slug: "vitacare-multivitamin",
      description: "วิตามินรวมเข้มข้นสารอาหารครบถ้วน เสริมพลังงานและความสดชื่นในทุกวัน 60 เม็ด",
      price: 39900, // 399.00 บาท
      imageUrl: "/products/vitamin-c.jpg",
      categoryId: getCatId("multivitamins"),
      stock: 45,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Calcium - D3",
      slug: "vitacare-calcium-d3",
      description: "แคลเซียมผสมวิตามินดี 3 เพื่อบำรุงกระดูกและฟันให้แข็งแรง ดูดซึมเต็มประสิทธิภาพ 60 เม็ด",
      price: 49900, // 499.00 บาท
      imageUrl: "/products/fish-oil.jpg",
      categoryId: getCatId("bone-health"),
      stock: 60,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare D3 5000 IU",
      slug: "vitacare-d3-5000-iu",
      description: "วิตามินดี 3 เข้มข้น สำหรับผู้ที่ไม่ค่อยเจอแสงแดด 60 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 29000,
      imageUrl: "/products/placeholder-green.svg",
      categoryId: getCatId("immunity"),
      stock: 30,
    },
    {
      name: "VitaCare Immune Shield Complex",
      slug: "vitacare-immune-shield",
      description: "รวมวิตามินซี ดี ซิงค์ และสารสกัดเบต้ากลูแคน ในสูตรเดียว 30 แคปซูล (ข้อมูลตัวอย่าง)",
      price: 75000,
      imageUrl: "/products/placeholder-green.svg",
      categoryId: getCatId("immunity"),
      stock: 0, // ของหมด
    },

    // --- กระดูกและข้อ ---
    {
      name: "VitaCare Calcium + D3",
      slug: "vitacare-calcium-plus-d3",
      description: "แคลเซียมคาร์บอเนตผสมวิตามินดี 3 เพื่อการดูดซึมที่ดีขึ้น 60 เม็ด (ข้อมูลตัวอย่าง)",
      price: 39000,
      imageUrl: "/products/placeholder-blue.svg",
      categoryId: getCatId("bone-health"),
      stock: 60,
    },
    {
      name: "VitaCare Joint Flex UC-II",
      slug: "vitacare-joint-flex-ucii",
      description: "คอลลาเจนไทพ์ทู ลดอาการปวดข้อและเพิ่มความยืดหยุ่น 30 แคปซูล (ข้อมูลตัวอย่าง)",
      price: 125000, // 1,250.00 บาท
      imageUrl: "/products/placeholder-blue.svg",
      categoryId: getCatId("bone-health"),
      stock: 15,
    },
    {
      name: "VitaCare Glucosamine 1500mg",
      slug: "vitacare-glucosamine-1500",
      description: "กลูโคซามีนซัลเฟต ชงดื่มบรรเทาอาการข้อเสื่อม 30 ซอง (ข้อมูลตัวอย่าง)",
      price: 85000,
      imageUrl: "/products/placeholder-blue.svg",
      categoryId: getCatId("bone-health"),
      stock: 25,
    },

    // --- ผิว ผม เล็บ ---
    {
      name: "VitaCare Marine Collagen Peptides",
      slug: "vitacare-marine-collagen",
      description: "คอลลาเจนเปปไทด์จากปลาทะเลน้ำลึก ชงง่าย ไม่มีกลิ่นคาว 150 กรัม (ข้อมูลตัวอย่าง)",
      price: 99000,
      imageUrl: "/products/placeholder-pink.svg",
      categoryId: getCatId("beauty"),
      stock: 80,
    },
    {
      name: "VitaCare Biotin 10,000 mcg",
      slug: "vitacare-biotin-10000",
      description: "ไบโอตินความเข้มข้นสูง ลดผมร่วง บำรุงเล็บแข็งแรง 60 แคปซูล (ข้อมูลตัวอย่าง)",
      price: 49000,
      imageUrl: "/products/placeholder-pink.svg",
      categoryId: getCatId("beauty"),
      stock: 3, // ต่ำกว่า threshold
    },
    {
      name: "VitaCare Grape Seed Extract",
      slug: "vitacare-grape-seed",
      description: "สารสกัดเมล็ดองุ่น อุดมด้วย OPCs ผิวกระจ่างใส 30 แคปซูล (ข้อมูลตัวอย่าง)",
      price: 65000,
      imageUrl: "/products/placeholder-pink.svg",
      categoryId: getCatId("beauty"),
      stock: 40,
    },
    {
      name: "VitaCare Astaxanthin 6mg",
      slug: "vitacare-astaxanthin-6mg",
      description: "แอสตาแซนธิน ราชินีสารต้านอนุมูลอิสระ ชะลอวัย 30 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 145000,
      imageUrl: "/products/placeholder-pink.svg",
      categoryId: getCatId("beauty"),
      stock: 12,
    },

    // --- โอเมก้า / น้ำมันปลา ---
    {
      name: "VitaCare Fish Oil 1000mg",
      slug: "vitacare-fish-oil-1000",
      description: "น้ำมันปลามาตรฐาน EPA 180mg / DHA 120mg บำรุงสมองและหัวใจ 100 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 55000,
      imageUrl: "/products/placeholder-yellow.svg",
      categoryId: getCatId("brain"),
      stock: 120,
    },
    {
      name: "VitaCare Deep Sea Omega-3",
      slug: "vitacare-deep-sea-omega3",
      description: "โอเมก้า 3 เข้มข้น ผ่านการสกัดไร้โลหะหนัก 60 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 89000,
      imageUrl: "/products/placeholder-yellow.svg",
      categoryId: getCatId("brain"),
      stock: 0, // ของหมด
    },
    {
      name: "VitaCare Krill Oil 500mg",
      slug: "vitacare-krill-oil-500",
      description: "น้ำมันคริลล์ ดูดซึมดีเยี่ยม ไม่เหม็นคาวปลา 30 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 155000, // 1,550.00 บาท
      imageUrl: "/products/placeholder-yellow.svg",
      categoryId: getCatId("brain"),
      stock: 8,
    },
    {
      name: "VitaCare Plant Omega (Flaxseed)",
      slug: "vitacare-plant-omega-flaxseed",
      description: "โอเมก้าจากน้ำมันเมล็ดแฟลกซ์ สำหรับผู้ทานมังสวิรัติ 60 ซอฟท์เจล (ข้อมูลตัวอย่าง)",
      price: 49000,
      imageUrl: "/products/placeholder-yellow.svg",
      categoryId: getCatId("others"),
      stock: 35,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {},
      create: prod,
    });
  }
  console.log(`- สินค้าสร้างเสร็จ: 18 รายการ`);

  console.log("=== Seed เสร็จสมบูรณ์ ===");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
