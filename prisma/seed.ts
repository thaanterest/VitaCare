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
      description: "วิตามินซี 1000 มก. สูตรเสริมภูมิคุ้มกันขั้นสูง ช่วยต้านอนุมูลอิสระ ฟื้นฟูร่างกาย ดูดซึมเร็ว ไม่ระคายเคืองกระเพาะอาหาร เหมาะสำหรับทุกวัย 90 แคปซูล",
      price: 29900, // 299.00 บาท
      imageUrl: "/products/vitamin-c.jpg",
      categoryId: getCatId("immunity"),
      stock: 120,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Fish Oil 1000 mg",
      slug: "vitacare-fish-oil-1000-mg",
      description: "น้ำมันปลาสกัดเข้มข้น 1000 มก. อุดมด้วยกรด Omega-3 (EPA+DHA) บำรุงหัวใจและหลอดเลือด เสริมสมองและความจำ ลดการอักเสบ ผ่านการกำจัดโลหะหนัก 120 ซอฟท์เจล",
      price: 45900, // 459.00 บาท
      imageUrl: "/products/fish-oil.jpg",
      categoryId: getCatId("brain"),
      stock: 85,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Collagen Plus",
      slug: "vitacare-collagen-plus",
      description: "คอลลาเจนสูตรพลัส เข้มข้นผสมวิตามินซีและไบโอติน กระตุ้นการสร้างคอลลาเจนใต้ผิว ผิวเด้งฉ่ำ ลดริ้วรอย บำรุงผม เล็บ และข้อต่อ 120 แคปซูล",
      price: 69000, // 690.00 บาท
      imageUrl: "/products/collagen-plus.jpg",
      categoryId: getCatId("beauty"),
      stock: 5, // กำลังใกล้หมด
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Probiotic",
      slug: "vitacare-probiotic",
      description: "โพรไบโอติกส์ 10 สายพันธุ์ จุลินทรีย์มีชีวิต 50,000 ล้าน CFU ฟื้นฟูสมดุลลำไส้ เสริมระบบย่อยอาหาร บรรเทาอาการท้องอืดท้องเฟ้อ เสริมภูมิคุ้มกันจากภายใน 60 แคปซูล",
      price: 55000, // 550.00 บาท
      imageUrl: "/products/probiotic.jpg",
      categoryId: getCatId("others"),
      stock: 8, // ใกล้หมด
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Multivitamin",
      slug: "vitacare-multivitamin",
      description: "วิตามินรวม 23 ชนิด และแร่ธาตุที่จำเป็นครบถ้วน เสริมพลังงาน บำรุงระบบประสาท ผิวพรรณ และภูมิคุ้มกัน เหมาะสำหรับผู้ที่ต้องการสารอาหารครบในเม็ดเดียว 60 เม็ด",
      price: 39900, // 399.00 บาท
      imageUrl: "/products/vitacare-multivitamin.png",
      categoryId: getCatId("multivitamins"),
      stock: 45,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare Calcium - D3",
      slug: "vitacare-calcium-d3",
      description: "แคลเซียมคาร์บอเนตผสมวิตามินดี 3 สูตรดูดซึมสูง เสริมความแข็งแรงของกระดูกและฟัน ป้องกันกระดูกพรุน เหมาะสำหรับทุกช่วงวัย 60 เม็ด",
      price: 49900, // 499.00 บาท
      imageUrl: "/products/vitacare-calcium-d3.png",
      categoryId: getCatId("bone-health"),
      stock: 60,
      lowStockThreshold: 10,
    },
    {
      name: "VitaCare D3 5000 IU",
      slug: "vitacare-d3-5000-iu",
      description: "วิตามินดี 3 เข้มข้น 5000 IU ในรูปแบบซอฟท์เจลดูดซึมเร็ว เหมาะสำหรับผู้ที่ไม่ค่อยได้รับแสงแดด ช่วยบำรุงกระดูก ฟัน เสริมภูมิคุ้มกัน และปรับสมดุลฮอร์โมน 60 ซอฟท์เจล",
      price: 29000,
      imageUrl: "/products/vitacare-d3-5000-iu.png",
      categoryId: getCatId("immunity"),
      stock: 30,
    },
    {
      name: "VitaCare Immune Shield Complex",
      slug: "vitacare-immune-shield",
      description: "สูตรเสริมภูมิคุ้มกันครบวงจร รวมวิตามินซี 500 มก. วิตามินดี 3 ซิงค์ และสารสกัดเบต้ากลูแคนจากยีสต์ธรรมชาติ ปกป้องร่างกายจากเชื้อโรคและไวรัส 30 แคปซูล",
      price: 75000,
      imageUrl: "/products/vitacare-immune-shield.png",
      categoryId: getCatId("immunity"),
      stock: 0, // ของหมด
    },

    // --- กระดูกและข้อ ---
    {
      name: "VitaCare Calcium + D3",
      slug: "vitacare-calcium-plus-d3",
      description: "แคลเซียมคาร์บอเนต 600 มก. ผสมวิตามินดี 3 สูตรเสริมการดูดซึมแคลเซียม บำรุงกระดูกและฟัน ลดความเสี่ยงกระดูกพรุน เหมาะสำหรับสตรีและผู้สูงอายุ 60 เม็ด",
      price: 39000,
      imageUrl: "/products/vitacare-calcium-plus-d3.png",
      categoryId: getCatId("bone-health"),
      stock: 60,
    },
    {
      name: "VitaCare Joint Flex UC-II",
      slug: "vitacare-joint-flex-ucii",
      description: "คอลลาเจนไทพ์ทู (UC-II) สูตรเฉพาะสำหรับข้อต่อ บรรเทาอาการปวดและข้อแข็งในโรคข้ออักเสบ เพิ่มความยืดหยุ่นของข้อต่อ ฟื้นฟูกระดูกอ่อน ใช้เพียง 40 มก.ต่อวัน 30 แคปซูล",
      price: 125000, // 1,250.00 บาท
      imageUrl: "/products/vitacare-joint-flex-ucii.png",
      categoryId: getCatId("bone-health"),
      stock: 15,
    },
    {
      name: "VitaCare Glucosamine 1500mg",
      slug: "vitacare-glucosamine-1500",
      description: "กลูโคซามีนซัลเฟต 1500 มก. สูตรชงดื่ม ดูดซึมเร็วกว่าแบบเม็ด ฟื้นฟูกระดูกอ่อนในข้อต่อ บรรเทาอาการปวดข้อเข่าและข้อสะโพก เสริมสร้างน้ำหล่อเลี้ยงข้อต่อ 30 ซอง",
      price: 85000,
      imageUrl: "/products/vitacare-glucosamine-1500.png",
      categoryId: getCatId("bone-health"),
      stock: 25,
    },

    // --- ผิว ผม เล็บ ---
    {
      name: "VitaCare Marine Collagen Peptides",
      slug: "vitacare-marine-collagen",
      description: "คอลลาเจนเปปไทด์ไทพ์วัน สกัดจากปลาทะเลน้ำลึก โมเลกุลขนาดเล็กดูดซึมเร็ว ชงง่าย ไม่มีกลิ่นคาว เสริมความชุ่มชื้นผิวจากภายใน ลดริ้วรอย เสริมเนื้อผมและเล็บ 150 กรัม",
      price: 99000,
      imageUrl: "/products/vitacare-marine-collagen.png",
      categoryId: getCatId("beauty"),
      stock: 80,
    },
    {
      name: "VitaCare Biotin 10,000 mcg",
      slug: "vitacare-biotin-10000",
      description: "ไบโอติน (วิตามินบี 7) ความเข้มข้นสูง 10,000 ไมโครกรัม ลดปัญหาผมร่วงและผมบาง กระตุ้นการงอกของเส้นผม บำรุงเล็บให้แข็งแรง ไม่เปราะแตก 60 แคปซูล",
      price: 49000,
      imageUrl: "/products/vitacare-biotin-10000.png",
      categoryId: getCatId("beauty"),
      stock: 3, // ต่ำกว่า threshold
    },
    {
      name: "VitaCare Grape Seed Extract",
      slug: "vitacare-grape-seed",
      description: "สารสกัดเมล็ดองุ่นมาตรฐาน อุดมด้วย OPCs (Oligomeric Proanthocyanidins) พลังต้านอนุมูลอิสระสูงกว่าวิตามินซีถึง 20 เท่า ผิวกระจ่างใส ลดจุดด่างดำ ชะลอวัยจากภายใน 30 แคปซูล",
      price: 65000,
      imageUrl: "/products/vitacare-grape-seed.png",
      categoryId: getCatId("beauty"),
      stock: 40,
    },
    {
      name: "VitaCare Astaxanthin 6mg",
      slug: "vitacare-astaxanthin-6mg",
      description: "แอสตาแซนธิน 6 มก. สารต้านอนุมูลอิสระที่แรงที่สุดในธรรมชาติ สกัดจากสาหร่าย Haematococcus ปกป้องผิวจากแสง UV ชะลอวัย ลดริ้วรอย บำรุงดวงตาและหัวใจ 30 ซอฟท์เจล",
      price: 145000,
      imageUrl: "/products/vitacare-astaxanthin-6mg.png",
      categoryId: getCatId("beauty"),
      stock: 12,
    },

    // --- โอเมก้า / น้ำมันปลา ---
    {
      name: "VitaCare Fish Oil 1000mg",
      slug: "vitacare-fish-oil-1000",
      description: "น้ำมันปลาสูตรมาตรฐาน EPA 180 มก. / DHA 120 มก. ต่อเม็ด บำรุงสมองและความจำ ดูแลสุขภาพหัวใจและหลอดเลือด ลดระดับไตรกลีเซอไรด์ ผ่านการทดสอบความบริสุทธิ์ 100 ซอฟท์เจล",
      price: 55000,
      imageUrl: "/products/vitacare-fish-oil-1000.png",
      categoryId: getCatId("brain"),
      stock: 120,
    },
    {
      name: "VitaCare Deep Sea Omega-3",
      slug: "vitacare-deep-sea-omega3",
      description: "โอเมก้า 3 เข้มข้นสูง สกัดจากปลาทะเลน้ำลึก ผ่านกระบวนการกำจัดโลหะหนักและสารปนเปื้อน ปริมาณ EPA+DHA สูงกว่าน้ำมันปลาทั่วไป เหมาะสำหรับผู้ดูแลสุขภาพหัวใจและสมองอย่างจริงจัง 60 ซอฟท์เจล",
      price: 89000,
      imageUrl: "/products/vitacare-deep-sea-omega3.png",
      categoryId: getCatId("brain"),
      stock: 0, // ของหมด
    },
    {
      name: "VitaCare Krill Oil 500mg",
      slug: "vitacare-krill-oil-500",
      description: "น้ำมันคริลล์แอนตาร์กติก 500 มก. อุดมด้วย Omega-3 และ Phospholipids ในรูปแบบที่ร่างกายดูดซึมได้ดีกว่าน้ำมันปลาทั่วไปถึง 2 เท่า ไม่มีกลิ่นคาว อุดมด้วยแอสตาแซนธินธรรมชาติ 30 ซอฟท์เจล",
      price: 155000, // 1,550.00 บาท
      imageUrl: "/products/vitacare-krill-oil-500.png",
      categoryId: getCatId("brain"),
      stock: 8,
    },
    {
      name: "VitaCare Plant Omega (Flaxseed)",
      slug: "vitacare-plant-omega-flaxseed",
      description: "โอเมก้า 3 จากพืช สกัดจากเมล็ดแฟลกซ์คุณภาพสูง อุดมด้วย ALA (Alpha-Linolenic Acid) เหมาะสำหรับผู้ทานมังสวิรัติและวีแกน ปลอดจากผลิตภัณฑ์จากสัตว์ 100% บรรจุในซอฟท์เจลจากพืช 60 แคปซูล",
      price: 49000,
      imageUrl: "/products/vitacare-plant-omega-flaxseed.png",
      categoryId: getCatId("others"),
      stock: 35,
    },
  ];

  for (const prod of productsData) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: {
        description: prod.description,
        imageUrl: prod.imageUrl,
      },
      create: prod,
    });
  }
  console.log(`- สินค้าสร้างเสร็จ: ${productsData.length} รายการ`);

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
