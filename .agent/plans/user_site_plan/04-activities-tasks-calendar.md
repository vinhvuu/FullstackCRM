# 04 — Activities, Tasks & Calendar

> Activities hiện là **list phẳng** với filter trạng thái. Chuẩn doanh nghiệp cần **calendar**,
> **task có ưu tiên/lặp lại**, **"My Day"** tổng hợp việc đến hạn, và **nhắc nhở tự động**.

## 1. Khoảng cách & mục tiêu

| Thiếu hiện tại | Bổ sung | Ưu tiên |
|----------------|---------|:------:|
| Không calendar | **Calendar** ngày/tuần/tháng | M |
| Task không ưu tiên/lặp lại | **Priority + Recurring** | M |
| `overdue` set tay | **Tự động overdue** theo dueDate | M |
| Không tổng hợp đa record | **"My Day" / Today** | S |
| Activity không điều hướng tới record | **Liên kết & link** tới lead/contact/deal/company | M |
| Không nhắc real-time | **Notification** khi tới hạn (xem [07]) | M |

## 2. Activities — 3 chế độ xem `/activities`

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Hoạt động                                              [+ Thêm hoạt động]      │
│  [☰ Danh sách]  [📅 Lịch]  [☀ Hôm nay]      Lọc: type, trạng thái, người       │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 2.1 Calendar view [M]
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ◀ Tháng 6, 2026 ▶            [Ngày][Tuần][Tháng]                              │
│  T2     T3     T4     T5     T6     T7     CN                                  │
│  ──────────────────────────────────────────────────────────────────────────  │
│   1      2      3      4      5      6      7                                  │
│         ●Gọi  ●Họp           ●Demo  ━━━━━━ (hôm nay)                            │
│         ABC          ●Email                                                    │
│  ──────────────────────────────────────────────────────────────────────────  │
│   8      9     10  ...                                                         │
│  Màu theo type: gọi(xanh) email(tím) họp(cam) task(lục)                        │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Click ngày → tạo nhanh; click sự kiện → popover chi tiết + link tới record.
- Kéo-thả đổi ngày/giờ (tái dùng @dnd-kit như kanban).
- Tuần: cột giờ; Ngày: agenda dọc.

### 2.2 "My Day" / Hôm nay [S]
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ☀ Hôm nay — Thứ Bảy, 07/06/2026                                              │
│  ── QUÁ HẠN (3) ──                                                            │
│   ⚠ Gọi lại Nguyễn A (ABC Corp)        hạn hôm qua    [Hoàn thành][Dời]       │
│   ⚠ Gửi báo giá XYZ                     hạn 05/06       ...                    │
│  ── HÔM NAY (5) ──                                                            │
│   ☐ 09:00 Họp demo DEF Group                            [Hoàn thành]          │
│   ☐ 14:00 Gọi chốt hợp đồng ABC                         ...                   │
│  ── SẮP TỚI (tuần này) ──                                                     │
│   ☐ Theo dõi reminder lead "Hoàng Mai"                                        │
└──────────────────────────────────────────────────────────────────────────────┘
```
> Tổng hợp **task + reminder lead** ([reminders đã có](../plans/04_followup_reminders.md)) +
> activity đến hạn — một nơi duy nhất để sale biết "hôm nay làm gì".

### 2.3 List view (nâng cấp từ hiện tại)
Giữ list hiện có, bổ sung: cột **ưu tiên** (cao/TB/thấp), **record liên kết** (badge + link),
sắp xếp theo dueDate, auto-overdue.

## 3. Task nâng cao [M]

### 3.1 Form task
```
Tiêu đề *        [ ............................ ]
Loại             ( ) Gọi (•) Task ( ) Email ( ) Họp
Ưu tiên          ( ) Cao  (•) Trung bình  ( ) Thấp
Hạn              [ 07/06/2026 ] [ 14:00 ]
Liên kết tới     [ 🔍 Lead/Contact/Deal/Company ▾ ]   ← gắn record
Nhắc trước       [ 30 phút ▾ ]
Lặp lại          [ Không ▾ ]  (Hằng ngày/Tuần/Tháng/Tùy chỉnh)
Mô tả            [ textarea ]
                                              [Hủy] [Lưu]
```

### 3.2 Recurring (lặp lại) [M]
- Sinh các lần kế tiếp theo quy tắc; hoàn thành 1 lần → tạo lần sau.
- Hiển thị icon ⟳ trên task lặp lại.

### 3.3 Auto-overdue [M]
- Trạng thái `overdue` **tính tự động** khi `dueDate < now` và chưa `completed` (bỏ select thủ công hiện tại).
- Badge đỏ + đếm số quá hạn ở sidebar/notification.

## 4. Liên kết activity ↔ record [M]
- Mọi activity gắn 1 record (lead/contact/deal/company). Hiển thị badge + link điều hướng.
- Tạo activity từ ngay trong record detail (nút có sẵn ở lead detail → mở rộng cho contact/deal/company).
- Timeline của record kéo các activity liên quan (dùng `RecordTimeline` chung — [02]/[03]).

## 5. Nhắc nhở (Reminders) — hợp nhất
- Lead reminders đã có (`plans/04`) + task reminders → cùng một hệ thống nhắc.
- Tới hạn → đẩy **notification** (chuông + toast, xem [07]) và xuất hiện ở "My Day".

## 6. Data model (chi tiết [09])
```ts
interface Activity {  // mở rộng
  id; type:'call'|'email'|'meeting'|'task'; title; description;
  priority:'high'|'medium'|'low';
  dueDate; remindAt?; completedAt?;
  status:'pending'|'completed'|'overdue';   // overdue tính tự động
  // liên kết đa hình
  relatedType?: 'lead'|'contact'|'deal'|'company'; relatedId?: number;
  ownerId;
  recurrence?: { freq:'daily'|'weekly'|'monthly'; interval:number; until?:string };
}
```

## 7. API (chi tiết [09])
```
GET /api/activities?view=calendar&from=&to=
GET /api/activities/today           (my day: task+reminder+activity đến hạn)
POST/PUT/DELETE /api/activities/:id
PUT /api/activities/:id/complete    (tạo lần lặp tiếp nếu recurring)
GET /api/<entity>/:id/activities    (timeline record)
```

## 8. Component
`ActivityCalendar` (month/week/day), `MyDayPanel`, `ActivityFormDialog` (nâng cấp `activity-form.tsx`),
`PriorityBadge`, `RecurrenceEditor`, `RelatedRecordPicker`, `ActivityListView` (nâng cấp).

## 9. Acceptance criteria
- [ ] Xem hoạt động dạng lịch tháng/tuần/ngày; kéo-thả đổi thời gian.
- [ ] Task có ưu tiên, lặp lại, gắn record và link điều hướng được.
- [ ] Quá hạn tự tính; "My Day" gộp task + reminder + activity đến hạn.
- [ ] Tới hạn bắn notification (tích hợp [07]).
- [ ] Tạo activity từ trong record; timeline record hiển thị đúng.
