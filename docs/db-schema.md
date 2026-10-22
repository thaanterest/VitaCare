# Database Schema

แผนภาพ Entity-Relationship (ER Diagram) ของระบบ AquaVita

```mermaid
erDiagram
    User ||--o{ Address : "has"
    User ||--o{ Order : "places"
    Category ||--o{ Product : "contains"
    Product ||--o{ OrderItem : "included_in"
    Order ||--o{ OrderItem : "has"

    User {
        String id PK
        String email UK
        String name
        String passwordHash
        String role "CUSTOMER | ADMIN"
        String phone
        DateTime createdAt
        DateTime updatedAt
    }

    Category {
        String id PK
        String name
        String slug UK
        DateTime createdAt
        DateTime updatedAt
    }

    Product {
        String id PK
        String name
        String slug UK
        String description
        Int price "in satang"
        String imageUrl
        String categoryId FK
        Int stock
        Int lowStockThreshold
        Boolean isActive
        DateTime createdAt
        DateTime updatedAt
    }

    Address {
        String id PK
        String userId FK
        String recipientName
        String phone
        String line1
        String subdistrict
        String district
        String province
        String postalCode
        Boolean isDefault
        DateTime createdAt
        DateTime updatedAt
    }

    Order {
        String id PK
        String orderNumber UK
        String userId FK
        String status "PENDING_PAYMENT|PAID|SHIPPING|COMPLETED|CANCELLED"
        Int subtotal "in satang"
        Int shippingFee "in satang"
        Int total "in satang"
        String shippingAddressSnapshot "JSON string"
        String note
        DateTime createdAt
        DateTime updatedAt
    }

    OrderItem {
        String id PK
        String orderId FK
        String productId FK
        String productNameSnapshot
        Int unitPriceSnapshot "in satang"
        Int quantity
        Int lineTotal "in satang"
    }

    ConsentLog {
        String id PK
        String userId FK "nullable"
        String anonymousId "UUID"
        String policyVersion
        String action
        Boolean analytics
        Boolean functional
        Boolean marketing
        String userAgent
        DateTime createdAt "append-only"
    }
```

## รายละเอียดตาราง

- **User**: เก็บข้อมูลผู้ใช้และผู้ดูแลระบบ
- **Category**: หมวดหมู่สินค้า
- **Product**: สินค้า (ใช้สตางค์สำหรับราคากัน float issues, ใช้ isActive สำหรับ soft delete)
- **Address**: ที่อยู่จัดส่งของผู้ใช้ (ผู้ใช้ 1 คนมีหลายที่อยู่ได้)
- **Order**: คำสั่งซื้อ (เก็บ snapshot ที่อยู่เพื่อไม่ให้ประวัติเปลี่ยน)
- **OrderItem**: รายการสินค้าในแต่ละคำสั่งซื้อ (เก็บ snapshot ชื่อและราคา)
- **ConsentLog**: บันทึกความยินยอมคุกกี้ (PDPA) เป็นแบบ Append-only ไม่มีการลบ
