import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "นโยบายคุกกี้",
  description:
    "นโยบายคุกกี้ของ VitaCare — ข้อมูลเกี่ยวกับคุกกี้ที่เราใช้และสิทธิ์ของคุณ",
};

export default function CookiePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-6">
        <Link
          href="/"
          className="text-sm text-primary-600 hover:underline flex items-center gap-1"
        >
          ← กลับหน้าหลัก
        </Link>
      </div>

      <h1 className="mb-2 text-3xl font-bold text-gray-900">
        🍪 นโยบายคุกกี้ (Cookie Policy)
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        เวอร์ชัน 1.0 · อัปเดตล่าสุด: 1 ตุลาคม 2568
      </p>

      <div className="space-y-8 text-gray-700 text-base leading-relaxed">
        {/* Section 1 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            1. คุกกี้คืออะไร?
          </h2>
          <p>
            คุกกี้ (Cookie) คือไฟล์ข้อความขนาดเล็กที่ถูกจัดเก็บลงในอุปกรณ์ของคุณเมื่อคุณเยี่ยมชมเว็บไซต์ VitaCare
            คุกกี้ช่วยให้เว็บไซต์จดจำการตั้งค่าและการกระทำของคุณในช่วงเวลาหนึ่ง
            ทำให้ไม่ต้องป้อนข้อมูลซ้ำทุกครั้งที่กลับมาเยี่ยมชม
          </p>
        </section>

        {/* Section 2 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            2. ประเภทคุกกี้ที่เราใช้
          </h2>

          <div className="space-y-4">
            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-green-100 text-green-800 rounded-full">
                  จำเป็นเสมอ
                </span>
                <h3 className="font-semibold text-gray-900">
                  คุกกี้ที่จำเป็น (Necessary)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                คุกกี้เหล่านี้จำเป็นต่อการทำงานขั้นพื้นฐานของเว็บไซต์ เช่น การรักษาสถานะการล็อกอิน การจัดการตะกร้าสินค้า
                และการรักษาความปลอดภัยของเซสชัน ไม่สามารถปิดการใช้งานได้
              </p>
              <table className="mt-3 w-full text-xs text-gray-500">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1 font-medium">ชื่อคุกกี้</th>
                    <th className="text-left py-1 font-medium">วัตถุประสงค์</th>
                    <th className="text-left py-1 font-medium">อายุ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono">aquavita_consent</td>
                    <td className="py-1">บันทึกการตั้งค่าความยินยอมคุกกี้</td>
                    <td className="py-1">6 เดือน</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono">next-auth.session-token</td>
                    <td className="py-1">จัดการเซสชันผู้ใช้</td>
                    <td className="py-1">30 วัน</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full">
                  เลือกได้
                </span>
                <h3 className="font-semibold text-gray-900">
                  คุกกี้เชิงฟังก์ชัน (Functional)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                คุกกี้เหล่านี้ช่วยให้เว็บไซต์จดจำตัวเลือกต่าง ๆ ของคุณ เช่น ภาษา ขนาดตัวอักษร
                หรือภูมิภาคที่คุณอยู่ เพื่อมอบประสบการณ์ที่ดีขึ้นและเป็นส่วนตัวมากขึ้น
              </p>
              <table className="mt-3 w-full text-xs text-gray-500">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1 font-medium">ชื่อคุกกี้</th>
                    <th className="text-left py-1 font-medium">วัตถุประสงค์</th>
                    <th className="text-left py-1 font-medium">อายุ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono">aquavita_lang</td>
                    <td className="py-1">จดจำการตั้งค่าภาษา</td>
                    <td className="py-1">1 ปี</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 text-purple-800 rounded-full">
                  เลือกได้
                </span>
                <h3 className="font-semibold text-gray-900">
                  คุกกี้วิเคราะห์ (Analytics)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                คุกกี้เหล่านี้ช่วยให้เราเข้าใจว่าผู้เยี่ยมชมใช้เว็บไซต์อย่างไร
                ข้อมูลทั้งหมดถูกรวบรวมและรายงานโดยไม่ระบุตัวตน ช่วยให้เราปรับปรุงเว็บไซต์ให้ดีขึ้น
              </p>
              <table className="mt-3 w-full text-xs text-gray-500">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1 font-medium">ชื่อคุกกี้</th>
                    <th className="text-left py-1 font-medium">วัตถุประสงค์</th>
                    <th className="text-left py-1 font-medium">อายุ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono">_ga</td>
                    <td className="py-1">Google Analytics — แยกแยะผู้เยี่ยมชม</td>
                    <td className="py-1">2 ปี</td>
                  </tr>
                  <tr>
                    <td className="py-1 font-mono">_ga_*</td>
                    <td className="py-1">Google Analytics — ข้อมูลเซสชัน</td>
                    <td className="py-1">2 ปี</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="rounded-xl border border-gray-200 p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2 py-0.5 bg-orange-100 text-orange-800 rounded-full">
                  เลือกได้
                </span>
                <h3 className="font-semibold text-gray-900">
                  คุกกี้การตลาด (Marketing)
                </h3>
              </div>
              <p className="text-sm text-gray-600">
                คุกกี้เหล่านี้ถูกตั้งค่าผ่านไซต์ของเราโดยพันธมิตรโฆษณา
                พวกเขาอาจใช้คุกกี้เหล่านี้เพื่อสร้างโปรไฟล์ความสนใจของคุณ
                และแสดงโฆษณาที่เกี่ยวข้องบนไซต์อื่น ๆ
              </p>
              <table className="mt-3 w-full text-xs text-gray-500">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-1 font-medium">ชื่อคุกกี้</th>
                    <th className="text-left py-1 font-medium">วัตถุประสงค์</th>
                    <th className="text-left py-1 font-medium">อายุ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-1 font-mono">_fbp</td>
                    <td className="py-1">Facebook Pixel — ติดตามการแปลง</td>
                    <td className="py-1">3 เดือน</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Section 3 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            3. สิทธิ์ของคุณตาม พ.ร.บ. PDPA
          </h2>
          <p className="mb-3">
            ภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 คุณมีสิทธิ์ดังต่อไปนี้:
          </p>
          <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
            <li>
              <strong>สิทธิ์เพิกถอนความยินยอม:</strong> คุณสามารถเพิกถอนความยินยอมได้ทุกเมื่อ
              โดยคลิก &quot;ตั้งค่าคุกกี้&quot; ที่ด้านล่างของหน้าเว็บ
            </li>
            <li>
              <strong>สิทธิ์เข้าถึง:</strong> ขอรับสำเนาข้อมูลส่วนบุคคลที่เราเก็บรักษา
            </li>
            <li>
              <strong>สิทธิ์ลบข้อมูล:</strong> ขอให้เราลบข้อมูลส่วนบุคคลของคุณ
            </li>
            <li>
              <strong>สิทธิ์คัดค้าน:</strong> คัดค้านการประมวลผลข้อมูลส่วนบุคคลของคุณ
            </li>
          </ul>
        </section>

        {/* Section 4 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            4. วิธีจัดการคุกกี้
          </h2>
          <p className="mb-3">
            คุณสามารถจัดการคุกกี้ได้ 2 วิธี:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>
              <strong>ผ่านเว็บไซต์ VitaCare:</strong> คลิกปุ่ม &ldquo;ตั้งค่าคุกกี้&rdquo; ที่แบนเนอร์ด้านล่าง
              หรือผ่านลิงก์&ldquo;นโยบายคุกกี้&rdquo;ในส่วนท้ายเว็บ
            </li>
            <li>
              <strong>ผ่านการตั้งค่าเบราว์เซอร์:</strong> เบราว์เซอร์ส่วนใหญ่อนุญาตให้คุณปฏิเสธหรือลบคุกกี้
              โปรดดูวิธีการในคู่มือของเบราว์เซอร์ที่คุณใช้งาน
            </li>
          </ol>
          <p className="mt-3 text-sm text-gray-500">
            หมายเหตุ: การปิดใช้งานคุกกี้บางประเภทอาจส่งผลต่อการทำงานของเว็บไซต์
          </p>
        </section>

        {/* Section 5 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            5. การอัปเดตนโยบาย
          </h2>
          <p>
            เราอาจอัปเดตนโยบายคุกกี้นี้เป็นครั้งคราว หากมีการเปลี่ยนแปลงที่สำคัญ
            เราจะแจ้งให้คุณทราบผ่านแบนเนอร์คุกกี้และขอความยินยอมใหม่จากคุณ
            วันที่อัปเดตล่าสุดจะแสดงที่ด้านบนของหน้านี้
          </p>
        </section>

        {/* Section 6 */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            6. ติดต่อเรา
          </h2>
          <p>
            หากคุณมีคำถามเกี่ยวกับนโยบายคุกกี้นี้หรือต้องการใช้สิทธิ์ของคุณ
            กรุณาติดต่อเจ้าหน้าที่คุ้มครองข้อมูลส่วนบุคคล (DPO) ของ VitaCare ที่:
          </p>
          <address className="mt-3 not-italic text-sm text-gray-600 bg-gray-50 rounded-xl p-4">
            <strong>VitaCare Co., Ltd.</strong>
            <br />
            อีเมล: privacy@vitacare.example.th
            <br />
            โทรศัพท์: 02-XXX-XXXX
            <br />
            วันทำการ: จันทร์ – ศุกร์ เวลา 9:00 – 18:00 น.
          </address>
        </section>
      </div>
    </div>
  );
}
