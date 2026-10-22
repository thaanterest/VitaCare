import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link
              href="/"
              className="flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <Image
                src="/logo.png"
                alt="VitaCare Logo"
                width={36}
                height={36}
                className="h-9 w-9 rounded-xl object-contain drop-shadow-sm"
              />
              <span className="text-xl font-black tracking-tight text-emerald-600">
                Vita<span className="text-sky-500">Care</span>
              </span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              ร้านวิตามินและอาหารเสริมออนไลน์
              <br />
              คัดสรรผลิตภัณฑ์คุณภาพเพื่อสุขภาพที่ดีของคุณ
            </p>
          </div>

          {/* ลิงก์ */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              สินค้า
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/products"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  สินค้าทั้งหมด
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              บัญชี
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/account"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  บัญชีของฉัน
                </Link>
              </li>
              <li>
                <Link
                  href="/account/orders"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  ประวัติคำสั่งซื้อ
                </Link>
              </li>
              <li>
                <Link
                  href="/cart"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  ตะกร้าสินค้า
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-900">
              นโยบาย
            </h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link
                  href="/cookie-policy"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                >
                  นโยบายคุกกี้
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  className="text-sm text-gray-500 transition-colors hover:text-primary-600"
                  aria-label="ตั้งค่าคุกกี้"
                >
                  ตั้งค่าคุกกี้
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-400">
            © {currentYear} VitaCare — โปรเจกต์เพื่อการศึกษา
            ข้อมูลสินค้าเป็นตัวอย่างเท่านั้น ไม่ใช่คำแนะนำทางการแพทย์
          </p>
        </div>
      </div>
    </footer>
  );
}
