# 03 — Deals & Pipeline

> Deal hiện có kanban + drag-drop tốt, nhưng **mỏng về chiều sâu**: không timeline, không sản phẩm,
> một pipeline cứng, không lý do thắng/thua. Đây là phần làm dày để đạt chuẩn bán hàng doanh nghiệp.

## 1. Khoảng cách & mục tiêu

| Thiếu hiện tại | Bổ sung | Ưu tiên |
|----------------|---------|:------:|
| Deal detail không có timeline hoạt động | **Timeline** dùng chung (như lead) | M |
| Giá trị nhập tay, không sản phẩm | **Line items** từ catalog ([06]) | M |
| Chỉ 1 pipeline | **Nhiều pipeline** | S |
| Không lý do thắng/thua | **Win/Loss reason** | M |
| Không cảnh báo deal ì | **Deal rotting** | S |
| Chỉ 1 contact | **Nhiều contact + vai trò** | S |

## 2. Deal detail nâng cấp `/deals/[id]`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ← Deal › Triển khai ERP cho ABC Corp          [Mark Won] [Mark Lost] [Sửa] ⋮ │
│  ┌──────────────────────────────────────┐  ┌──────────────────────────────┐   │
│  │ Triển khai ERP — 800.000.000đ        │  │  TÓM TẮT                     │   │
│  │ [● Proposal ▾]   Xác suất 70%        │  │  Công ty: 🏢 ABC Corp        │   │
│  │ ▓▓▓▓▓▓▓░░░ pipeline stepper          │  │  Đóng dự kiến: 30/06         │   │
│  │                                      │  │  Chủ: Trần B                 │   │
│  │ Tab: Hoạt động | Sản phẩm | Liên hệ  │  │  Tuổi deal: 12 ngày          │   │
│  │      | File                          │  │  ⚠ Chưa đổi stage 8 ngày     │   │
│  │ ─────────                            │  │                              │   │
│  │ HOẠT ĐỘNG (timeline dùng chung)      │  │  SẢN PHẨM (3)                │   │
│  │  ● 03/06 Email — gửi đề xuất         │  │  • ERP Core   x1   500tr     │   │
│  │  ● 01/06 Họp — demo                  │  │  • Triển khai x1   200tr     │   │
│  │  [+ Ghi chú][+ Gọi][+ Email][+ Task] │  │  • Bảo trì/năm x1  100tr     │   │
│  │                                      │  │  Tổng: 800tr  [Tạo báo giá]  │   │
│  └──────────────────────────────────────┘  └──────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```
> So với hiện tại (chỉ có "Deal Progress" + "Related Contact" + "Quick Actions" tĩnh), bản nâng cấp
> thêm **timeline hoạt động**, **tab sản phẩm**, **win/lost**, **cảnh báo deal ì**, **nhiều contact**.

## 3. Win / Loss flow [M]

### 3.1 Mark Won
```
┌──────────────────────────────────────────┐
│  🎉 Đánh dấu THẮNG: Triển khai ERP        │
│  ──────────────────────────────────────  │
│  Giá trị chốt   [ 800.000.000 ]          │
│  Ngày đóng      [ 07/06/2026 ]           │
│  Ghi chú        [ ........... ]          │
│  ☑ Tạo task chăm sóc sau bán             │
│                       [Hủy] [Xác nhận]   │
└──────────────────────────────────────────┘
```

### 3.2 Mark Lost — bắt buộc chọn lý do
```
┌──────────────────────────────────────────┐
│  Đánh dấu THUA: Triển khai ERP            │
│  ──────────────────────────────────────  │
│  Lý do thua *   [ Chọn lý do ▾ ]          │
│   • Giá cao                               │
│   • Chọn đối thủ                          │
│   • Không có ngân sách                    │
│   • Sai thời điểm                         │
│   • Không phản hồi                        │
│   • Khác...                               │
│  Đối thủ (nếu có) [ ............ ]         │
│  Ghi chú        [ ........... ]           │
│                       [Hủy] [Xác nhận]   │
└──────────────────────────────────────────┘
```
> Lý do thua nuôi dữ liệu cho Analytics ([08]) — phân tích vì sao mất deal.

## 4. Nhiều pipeline [S]
- Mỗi pipeline có bộ stage riêng (vd: **New Business**: Lead→Qualified→Proposal→Negotiation→Won/Lost;
  **Renewal**: Due→Contacted→Negotiation→Renewed/Churned).
- Bộ chọn pipeline ở đầu trang `/deals`: `[ New Business ▾ ]`.
- Stage hiện hardcode trong `lib/constants.ts` (`DEAL_STAGES`) → chuyển sang dữ liệu cấu hình theo pipeline.
- Quản lý pipeline/stage thuộc cấu hình (liên quan admindocs settings; ở đây người dùng chỉ chọn).

## 5. Line items / sản phẩm trong deal [M]
- Tab "Sản phẩm": thêm dòng từ catalog ([06]), mỗi dòng: sản phẩm, số lượng, đơn giá, chiết khấu, thành tiền.
- **Giá trị deal = tổng line items** (tự tính, có thể override).
- Nút "Tạo báo giá" sinh quote từ các line items (xem [06]).

```
SẢN PHẨM                          SL    ĐƠN GIÁ     CK%    THÀNH TIỀN
─────────────────────────────────────────────────────────────────────
ERP Core License                  1     500.000.000  0     500.000.000
Triển khai & đào tạo              1     200.000.000  0     200.000.000
Bảo trì năm đầu                   1     100.000.000  10     90.000.000
─────────────────────────────────────────────────────────────────────
                                          Tạm tính:        790.000.000
                                          Thuế VAT 10%:     79.000.000
                                          TỔNG:            869.000.000
[+ Thêm sản phẩm]                                    [Tạo báo giá PDF]
```

## 6. Deal rotting (cảnh báo deal ì) [S]
- Nếu deal không đổi stage > N ngày (cấu hình SLA) → badge ⚠ "ì 8 ngày" trên card kanban + detail.
- Bộ lọc nhanh ở `/deals`: "Cần chú ý" (deal ì / quá hạn đóng).
- Hiển thị **tuổi deal** và **thời gian ở stage hiện tại**.

## 7. Nhiều contact + vai trò [S]
Tab "Liên hệ" trên deal: thêm nhiều contact với vai trò: *Người quyết định / Người ảnh hưởng /
Người dùng cuối / Liên hệ chính*. Giúp bán hàng phức hợp (B2B nhiều bên).

## 8. Pipeline kanban — nâng cấp `/deals`
Bổ sung trên card hiện có:
- Tổng giá trị + số deal mỗi cột (header cột).
- Badge deal rotting.
- Avatar chủ deal.
- Bộ lọc: chủ sở hữu, công ty, khoảng giá trị, "cần chú ý".
- Tổng "weighted value" (giá trị × xác suất) cho forecast nhanh.

## 9. Data model (chi tiết [09])
```ts
interface Deal {  // mở rộng
  id; title; value; stage; probability; pipelineId; companyId?;
  ownerId; expectedCloseDate; createdAt;
  status: 'open'|'won'|'lost';
  wonAt?; lostAt?; lossReason?; competitor?;
  stageEnteredAt: string;   // cho deal rotting
}
interface DealLineItem { id; dealId; productId; name; qty; unitPrice; discountPct; total; }
interface DealContact { dealId; contactId; role: 'decision'|'influencer'|'user'|'primary'; }
interface Pipeline { id; name; stages: {id;label;color;probability}[]; }
interface LossReason { id; label; }
```

## 10. API (chi tiết [09])
```
PUT /api/deals/:id/stage          POST /api/deals/:id/won
POST /api/deals/:id/lost          GET/POST /api/deals/:id/line-items
GET/POST /api/deals/:id/contacts  GET /api/pipelines
GET /api/deals/:id/activities     (timeline dùng chung)
```

## 11. Component
`DealDetail` (nâng cấp), `PipelineSelector`, `DealStageStepper`, `WonDialog`, `LostDialog`,
`DealLineItemTable`, `DealContactsPanel`, `DealRottingBadge`, `RecordTimeline` (dùng chung).

## 12. Acceptance criteria
- [ ] Deal detail có timeline hoạt động hoạt động thật (thêm note/call/email/task).
- [ ] Thêm sản phẩm vào deal; giá trị deal tự tính từ line items.
- [ ] Mark Won/Lost; Lost bắt buộc lý do; số liệu vào Analytics.
- [ ] Chuyển pipeline & thấy bộ stage tương ứng.
- [ ] Deal ì hiển thị cảnh báo; bộ lọc "Cần chú ý" hoạt động.
- [ ] Header kanban hiển thị tổng giá trị/đếm theo cột.
