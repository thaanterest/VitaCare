# VitaCare

โปรเจกต์เว็บร้านขายวิตามินและอาหารเสริมออนไลน์ สร้างด้วย Next.js (App Router), Tailwind CSS v4, Prisma (SQLite) และ Auth.js

## 1. การติดตั้งและการตั้งค่าเบื้องต้น

```bash
# 1. ติดตั้ง Dependencies
npm install

# 2. คัดลอกและตั้งค่า Environment Variables
cp .env.example .env
# (ตรวจสอบ .env ว่าข้อมูลถูกต้อง หรือปรับเปลี่ยนรหัสผ่านผู้ดูแลระบบตามต้องการ)

# 3. เตรียมฐานข้อมูล (สร้างตาราง)
npx prisma migrate dev --name init

# 4. ใส่ข้อมูลจำลอง (Seed)
npx prisma db seed
```

## 2. การรันโปรเจกต์

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่ `http://localhost:3000`

## 3. ข้อมูลผู้ใช้จำลอง (Seed Data)
สามารถใช้ล็อกอินเข้าสู่ระบบได้เลย:
- **Admin**: `admin@vitacare.dev` (หรือ `admin@aquavita.dev`) | `Admin@1234`
- **Customer**: `customer@vitacare.dev` (หรือ `customer@aquavita.dev`) | `Customer@1234`

## 4. โครงสร้างไฟล์ที่สำคัญ
- `prisma/schema.prisma` - โครงสร้างตารางในฐานข้อมูล
- `src/lib/order-status.ts` - กำหนดสถานะออเดอร์และการเปลี่ยนสถานะ (Single Source of Truth)
- `src/lib/money.ts` - ฟังก์ชันจัดการสกุลเงิน (แปลงสตางค์ <-> บาท)
- `src/proxy.ts` - ควบคุมสิทธิ์การเข้าถึงหน้าเว็บ (Next.js 16 Proxy)
- `docs/` - เอกสารการออกแบบฐานข้อมูล, สิทธิ์ผู้ใช้งาน และนโยบายคุกกี้

## 5. คำเตือน
- **ราคา**: เก็บในฐานข้อมูลเป็น "สตางค์" (จำนวนเต็ม) เพื่อป้องกันปัญหาความแม่นยำของทศนิยม
- **สินค้า**: ข้อมูลทั้งหมดเป็นตัวอย่างเพื่อการศึกษา ไม่ใช่วิตามินจริงและไม่มีสรรพคุณทางการแพทย์