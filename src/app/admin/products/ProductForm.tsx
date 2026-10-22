"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createProductAction, updateProductAction } from "@/app/actions/admin-products";

type Category = { id: string; name: string };
type Product = any;

export default function ProductForm({
  product,
  categories,
}: {
  product?: Product;
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // สำหรับ Preview รูป
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null);

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9ก-๙]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!product) { // เฉพาะตอนเพิ่มใหม่ ถึงจะ auto-generate slug
      const slugInput = document.getElementById("slug") as HTMLInputElement;
      if (slugInput && !slugInput.value) {
        slugInput.value = generateSlug(e.target.value);
      }
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("ขนาดไฟล์ต้องไม่เกิน 2MB");
        e.target.value = "";
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    
    try {
      let res;
      if (product) {
        res = await updateProductAction(product.id, null, formData);
      } else {
        res = await createProductAction(null, formData);
      }

      if (res.success && res.redirect) {
        router.push("/admin/products");
      } else if (res.error) {
        setError(res.error);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาด");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && <div className="p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อสินค้า *</label>
            <input 
              name="name" 
              type="text" 
              required 
              defaultValue={product?.name}
              onChange={handleNameChange}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">URL Slug * (อักษรอังกฤษ/ไทย/ตัวเลข/ขีด)</label>
            <input 
              id="slug"
              name="slug" 
              type="text" 
              required 
              defaultValue={product?.slug}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่ *</label>
            <select 
              name="categoryId" 
              required 
              defaultValue={product?.categoryId || ""}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="" disabled>เลือกหมวดหมู่</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">รายละเอียดสินค้า *</label>
            <textarea 
              name="description" 
              required 
              rows={4}
              defaultValue={product?.description}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ราคา (สตางค์) *</label>
              <input 
                name="price" 
                type="number" 
                min="1"
                required 
                defaultValue={product?.price}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สต็อก (ชิ้น) *</label>
              <input 
                name="stock" 
                type="number" 
                min="0"
                required 
                defaultValue={product?.stock ?? 0}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">แจ้งเตือนเมื่อสต็อกต่ำกว่า (ชิ้น) *</label>
            <input 
              name="lowStockThreshold" 
              type="number" 
              min="0"
              required 
              defaultValue={product?.lowStockThreshold ?? 10}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500" 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">สถานะ</label>
            <select 
              name="isActive" 
              defaultValue={product?.isActive !== false ? "true" : "false"}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-1 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="true">เปิดขาย</option>
              <option value="false">ปิดขาย</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              รูปภาพ {product ? "(อัปโหลดใหม่เพื่อเปลี่ยน)" : "*"}
            </label>
            <input 
              name="image" 
              type="file" 
              accept=".jpg,.jpeg,.png,.webp"
              required={!product}
              onChange={handleImageChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            />
            <p className="text-xs text-gray-500 mt-1">ไฟล์ .jpg, .png, .webp ขนาดไม่เกิน 2MB</p>
            
            {imagePreview && (
              <div className="mt-4 p-2 border border-gray-200 rounded-lg inline-block bg-white">
                <img src={imagePreview} alt="Preview" className="h-32 object-contain" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-lg font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
        >
          ยกเลิก
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2.5 rounded-lg font-bold text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:hover:bg-primary-600"
        >
          {loading ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
        </button>
      </div>
    </form>
  );
}
