# U3 — Activities, Tasks & Calendar (Detailed Plan)

> **Giải quyết:** list phẳng, không calendar; task không ưu tiên/lặp lại; `overdue` set tay;
> không tổng hợp việc đến hạn; activity không link record. Tham chiếu: `userdocs/04`.
> **Phụ thuộc:** U1 (record link, dùng `RecordTimeline` để hiển thị activity trên record).

## 0. Mục tiêu & DoD
- 3 chế độ xem ở `/activities`: **Danh sách | Lịch | Hôm nay**.
- Task có **priority**, **recurring**, **gắn record** (lead/contact/deal/company) + link điều hướng.
- **Auto-overdue** theo `dueDate` (bỏ select thủ công).
- **"My Day"** gộp task + reminder lead + activity đến hạn.
- Tới hạn → bắn notification (nối U6).

## 1. Phạm vi file

### Tạo mới
```
components/activities/activity-calendar.tsx     # month/week/day
components/activities/my-day-panel.tsx
components/activities/priority-badge.tsx
components/activities/recurrence-editor.tsx
components/activities/related-record-picker.tsx # dùng EntityPicker (U1) đa entity
lib/activities.ts                               # auto-overdue, gom my-day, sinh recurring
```

### Sửa
```
types/index.ts                                  # Activity mở rộng
app/(dashboard)/activities/page.tsx             # 3 view toggle + filter mở rộng
components/activities/activity-form.tsx         # +priority, +recurrence, +related, +remindAt
```

## 2. Data layer

### 2.1 Types
```ts
export type ActivityPriority = "high" | "medium" | "low";
export interface RecurrenceRule { freq: "daily"|"weekly"|"monthly"; interval: number; until?: string; }
export interface Activity {                       // mở rộng
  id: string; type: ActivityType; title: string; description: string;
  dueDate: string; status: ActivityStatus;
  priority: ActivityPriority;
  remindAt?: string;
  relatedType?: RecordType; relatedId?: string;   // RecordType từ U1
  recurrence?: RecurrenceRule;
  ownerId?: string; completedAt?: string;
  // dealId/contactId cũ giữ lại để backward-compat, map sang related*
}
```

### 2.2 Helpers (`lib/activities.ts`)
```ts
export function computeStatus(a: Activity, now = new Date()): ActivityStatus {
  if (a.status === "completed") return "completed";
  return new Date(a.dueDate) < now ? "overdue" : "pending";
}
export function getMyDay(activities: Activity[], reminders: LeadReminder[], now = new Date()) {
  // trả { overdue[], today[], upcoming[] } gộp activity + lead reminder
}
export function nextOccurrence(a: Activity): Activity | null {
  // nếu recurrence: tính dueDate kế tiếp theo freq/interval, dừng nếu quá until
}
```
> **Auto-overdue:** luôn dùng `computeStatus()` để render thay vì đọc `a.status` trực tiếp;
> select "Overdue" thủ công trong list hiện tại (lines 220-232) được gỡ.

### 2.3 API (backend)
```
GET /api/activities?view=calendar&from=&to=
GET /api/activities/today
POST/PUT/DELETE /api/activities/:id
PUT /api/activities/:id/complete    (sinh occurrence kế nếu recurring)
GET /api/:recordType/:id/activities
```

## 3. UX/UI
- Toggle 3 view: `userdocs/04` §2. Calendar month/week/day: §2.1. My Day: §2.2. Form task: §3.1.
- Màu sự kiện theo type (đã có `typeColors` trong activities page — tái dùng).
- Calendar kéo-thả đổi ngày/giờ bằng @dnd-kit (như kanban deals).

## 4. Component skeleton

### 4.1 `ActivityCalendar`
```tsx
"use client";
// props: activities, view:'month'|'week'|'day', date, onChangeDate, onSelect, onMove
// month: lưới 7 cột; week: cột giờ; day: agenda dọc.
// render event chip: color theo type, click -> popover (chi tiết + link record)
// Không cần lib ngoài: tự tính lưới tháng bằng Date (lưu ý tuần bắt đầu T2).
```

### 4.2 `MyDayPanel`
```tsx
// dùng getMyDay(); 3 nhóm: Quá hạn / Hôm nay / Sắp tới
// mỗi dòng: checkbox hoàn thành + dời (snooze) + link record
```

### 4.3 `RecurrenceEditor`
```tsx
// chọn freq + interval + until; preview "Lặp mỗi 2 tuần đến 30/06"
```

## 5. Các bước thực thi
1. [ ] Mở rộng `Activity` (priority, recurrence, related*, remindAt) trong types; map dealId/contactId cũ.
2. [ ] `lib/activities.ts`: computeStatus, getMyDay, nextOccurrence.
3. [ ] Sửa `activities/page.tsx`: dùng `computeStatus` (auto-overdue), bỏ select thủ công; thêm toggle 3 view + filter (type/priority/owner/related).
4. [ ] `ActivityCalendar` (month trước, week/day sau) + kéo-thả.
5. [ ] `MyDayPanel` (gộp activity + lead reminders từ `plans/04`).
6. [ ] Nâng cấp `activity-form`: priority, recurrence, `RelatedRecordPicker`, remindAt.
7. [ ] Hoàn thành recurring → sinh occurrence kế (nextOccurrence).
8. [ ] Hiển thị activity trong `RecordTimeline`/related list của record (U1) + tạo từ trong record.
9. [ ] Bắn notification khi tới `remindAt`/quá hạn (nối U6; giai đoạn mock: toast).
10. [ ] Empty/loading/error; responsive (calendar gọn ở mobile → agenda).

## 6. Test & nghiệm thu
- [ ] Calendar tháng/tuần/ngày hiển thị đúng; kéo-thả đổi thời gian.
- [ ] Quá hạn tự tính (đổi dueDate quá khứ → tự "overdue", không cần chỉnh tay).
- [ ] Task có priority + recurring; hoàn thành tạo lần kế đúng quy tắc.
- [ ] My Day gộp đúng task + reminder + activity đến hạn theo 3 nhóm.
- [ ] Activity gắn record và điều hướng được; tạo activity từ record.
- [ ] Tới hạn có thông báo (toast/notification).

## 7. Rủi ro & giảm thiểu
- **Tự viết calendar dễ sai lịch** (đầu/cuối tháng, tuần bắt đầu T2) → viết unit test cho hàm sinh lưới tháng.
- **Recurring sinh vô hạn** → bắt buộc `until` hoặc giới hạn số lần; chỉ sinh occurrence khi hoàn thành.
- **Đổi nguồn status sang computed** có thể lệch với dữ liệu mock cũ → chuẩn hóa qua `computeStatus` ở mọi nơi render.
