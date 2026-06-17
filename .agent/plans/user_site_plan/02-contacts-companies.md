# 02 — Contacts & Companies/Accounts

> **Khoảng cách lớn nhất của CRM hiện tại.** Hiện `company` chỉ là một chuỗi text trên contact.
> Doanh nghiệp B2B cần **Company/Account là entity riêng**, gom contact, deal, hoạt động về một tổ chức.

## 1. Mục tiêu
- Tạo entity **Company (Account)** độc lập.
- Liên kết: 1 Company có nhiều Contact, nhiều Deal, nhiều Activity.
- Mỗi Contact/Company có **timeline lịch sử** (mọi tương tác).
- Add/Edit/Delete hoạt động thật (thay nút tĩnh hiện tại).
- Chống trùng (dedupe) khi tạo.

## 2. Mô hình quan hệ
```
Company (Account)
 ├── Contacts[]        (nhân sự thuộc công ty)
 ├── Deals[]           (cơ hội với công ty)
 ├── Activities[]      (gọi/họp/email/note liên quan)
 └── Files[]           (hợp đồng, hồ sơ)

Contact
 ├── company_id  ───▶ Company
 ├── Deals[]           (deal mà contact tham gia)
 ├── Activities[]
 └── Timeline          (tổng hợp mọi tương tác)
```

## 3. Companies — danh sách `/companies` (route mới)

### 3.1 Wireframe
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Công ty                                            [ ⭱ Nhập ] [ + Thêm công ty]│
│  Quản lý tổ chức khách hàng & đối tác                                          │
│                                                                                │
│  🔍 Tìm công ty...   [Ngành ▾] [Quy mô ▾] [Chủ sở hữu ▾]   [⊞ Lưới] [☰ Bảng]  │
│                                                                                │
│  CÔNG TY            NGÀNH        # CONTACT  # DEAL   GIÁ TRỊ MỞ    CHỦ      ⋮   │
│  ──────────────────────────────────────────────────────────────────────────  │
│  🏢 ABC Corp        Công nghệ      5         3       1.2 tỷ       Trần B   ⋮   │
│  🏢 XYZ Ltd         Bán lẻ         2         1       300 tr       Vũ E     ⋮   │
│  🏢 DEF Group       Sản xuất       8         4       2.5 tỷ       Trần B   ⋮   │
│  ──────────────────────────────────────────────────────────────────────────  │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 3.2 Company detail `/companies/[id]`
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Công ty › ABC Corp                                   [Sửa] [Thêm deal] [⋮]  │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │ 🏢 ABC Corp              │  │ Tab: Tổng quan | Liên hệ | Deal | Hoạt    │   │
│  │ Công nghệ · 50-200 NV    │  │      động | File                          │   │
│  │ 🌐 abccorp.com           │  │ ────────                                  │   │
│  │ 📞 028-1234567           │  │ TỔNG QUAN                                 │   │
│  │ 📍 Q1, TP.HCM            │  │  Mô tả công ty...                         │   │
│  │ 👤 Chủ: Trần Thị B       │  │  Doanh thu năm: ...  Mã số thuế: ...      │   │
│  │                          │  │                                          │   │
│  │ ── Tóm tắt ──            │  │ LIÊN HỆ (5)              [+ Thêm contact] │   │
│  │ Contacts:  5             │  │  • Nguyễn A — CEO        📞 ✉             │   │
│  │ Deal mở:   3 (1.2 tỷ)    │  │  • Lê C — CTO            📞 ✉             │   │
│  │ Deal thắng: 2            │  │                                          │   │
│  │ Hoạt động cuối: hôm qua  │  │ DEAL (3)                                  │   │
│  └──────────────────────────┘  │  • Triển khai ERP — 800tr — Proposal      │   │
│                                 │  • Gói bảo trì — 400tr — Negotiation       │   │
│                                 │ TIMELINE HOẠT ĐỘNG                        │   │
│                                 │  (dùng lại pattern timeline của lead)     │   │
│                                 └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 4. Contacts — nâng cấp `/contacts`

### 4.1 Vấn đề hiện tại & sửa
| Hiện tại | Nâng cấp |
|----------|----------|
| `company` là text | Liên kết `company_id` (chọn/tạo công ty) |
| Add/Edit/Delete tĩnh | Form thật + lưu + validation |
| Chỉ grid card | Thêm chế độ bảng + sắp xếp + bộ lọc |
| Không lịch sử | Timeline tương tác trên contact detail |

### 4.2 Contact detail `/contacts/[id]` (nâng cấp)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Liên hệ › Nguyễn Văn A                          [Sửa] [Gọi] [Email] [⋮]    │
│  ┌──────────────────────────┐  ┌──────────────────────────────────────────┐   │
│  │ (A) Nguyễn Văn A         │  │ Tab: Tổng quan | Deal | Hoạt động | File │   │
│  │ CEO @ 🏢 ABC Corp ───────┼──┼─▶ link tới company                       │   │
│  │ ✉ a@abc.com  📞 0901...   │  │ TIMELINE                                  │   │
│  │ 👤 Chủ: Trần B           │  │  ● 03/06 Gọi điện — quan tâm gói ERP       │   │
│  │ 🏷 [VIP] [Hot]           │  │  ● 02/06 Email — gửi báo giá              │   │
│  │                          │  │  ● 01/06 Họp — demo sản phẩm              │   │
│  │ [+ Ghi chú] [+ Task]     │  │  [+ Thêm tương tác]                       │   │
│  └──────────────────────────┘  └──────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```
> **Tái sử dụng:** timeline + form tương tác đã có ở `leads/[id]/page.tsx` (lines 424-497) → tách thành
> component dùng chung `RecordTimeline` (xem [05] §timeline & [08]/admindocs component pattern).

## 5. Dedupe (chống trùng) [S]
Khi tạo Contact/Company:
- Kiểm tra email/tên/website trùng → cảnh báo inline: *"Có thể đã tồn tại: ABC Corp (abccorp.com)"* + nút "Mở bản ghi" / "Vẫn tạo".
- Khi import (xem [07]) áp cùng luật, cho chọn: bỏ qua / cập nhật / tạo mới.

## 6. Form Company (tạo/sửa)
```
Tên công ty *          [ ............................ ]
Website                [ ............................ ]   (dùng để dedupe)
Ngành                  [ Công nghệ ▾ ]
Quy mô                 [ 50-200 nhân viên ▾ ]
Điện thoại             [ ............................ ]
Địa chỉ                [ ............................ ]
Mã số thuế             [ ............................ ]
Mô tả                  [ textarea ]
Chủ sở hữu             [ (auto = người tạo) ▾ ]
                                              [Hủy] [Lưu]
```

## 7. Data model (chi tiết [09])
```ts
interface Company {
  id: number; name: string; website?: string; industry?: string;
  size?: string; phone?: string; address?: string; taxCode?: string;
  description?: string; ownerId: number; createdAt: string;
  // computed
  contactCount?: number; openDealCount?: number; openDealValue?: number;
}
// Contact bổ sung: companyId?: number; ownerId: number; tags: string[];
```
SQL: bảng `companies`; `contacts.company_id` FK; index theo `owner_id`, `name`.

## 8. API (chi tiết [09])
```
GET/POST /api/companies            GET/PUT/DELETE /api/companies/:id
GET /api/companies/:id/contacts    GET /api/companies/:id/deals
GET /api/companies/:id/activities  POST /api/companies/dedupe-check
PUT /api/contacts/:id  (gắn company_id)
```

## 9. Component mới
`CompanyTable`, `CompanyCard`, `CompanyDetail`, `CompanyFormDialog`, `CompanyPicker` (select-or-create),
`RecordTimeline` (dùng chung lead/contact/company/deal), `RelatedListPanel` (contacts/deals/activities),
`DedupeWarning`.

## 10. Acceptance criteria
- [ ] Tạo company; gắn nhiều contact vào company; xem ngược danh sách contact/deal của company.
- [ ] Contact detail hiển thị timeline tổng hợp + link tới company.
- [ ] Add/Edit/Delete contact & company hoạt động thật, có validation.
- [ ] Dedupe cảnh báo khi trùng website/email.
- [ ] Có chế độ lưới + bảng, bộ lọc theo ngành/chủ sở hữu.
- [ ] Empty/loading/error đầy đủ; responsive (grid→1 cột, bảng→card).
