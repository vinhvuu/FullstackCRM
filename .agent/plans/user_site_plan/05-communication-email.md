# 05 — Communication & Email

> Hiện nút "Send Email"/"Call" chỉ **cuộn tới form ghi chú** — không có giao tiếp thật.
> Chuẩn doanh nghiệp cần **log/gửi email**, **template**, **ghi chú @mention**, **log cuộc gọi**,
> và **đính kèm file** — tất cả hội tụ trên **timeline** của record.

## 1. Khoảng cách & mục tiêu

| Thiếu hiện tại | Bổ sung | Ưu tiên |
|----------------|---------|:------:|
| Không gửi/log email | **Email composer + log** trên record | M |
| Không template | **Email template + biến** | S |
| Ghi chú thường | **Note @mention** đồng nghiệp | S |
| Không log cuộc gọi có cấu trúc | **Call logging** (kết quả, thời lượng) | M |
| Không đính kèm | **File attachments** | M |
| Timeline rời rạc theo trang | **RecordTimeline dùng chung** | M |

## 2. RecordTimeline — nền tảng giao tiếp [M]
Tách timeline + composer hiện có ở `leads/[id]` thành component dùng chung cho **mọi record**
(lead, contact, deal, company).

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  [📝 Ghi chú] [📞 Gọi] [✉ Email] [📅 Họp] [✓ Task]   ← composer tabs           │
│  ──────────────────────────────────────────────────────────────────────────  │
│  (nội dung composer theo tab đang chọn)                                        │
│  ──────────────────────────────────────────────────────────────────────────  │
│  Bộ lọc timeline: [Tất cả][Ghi chú][Email][Gọi][Họp][Task][File]              │
│                                                                                │
│  ● 07/06 14:20  ✉ Email — "Báo giá ERP"        bởi Trần B   [Xem][⋮]          │
│       Đã gửi tới a@abc.com · đính kèm bao-gia.pdf                              │
│  ● 07/06 09:00  📞 Gọi — Kết nối (5 phút)        bởi Trần B                    │
│       Kết quả: Quan tâm, hẹn gọi lại thứ 3                                     │
│  ● 06/06 16:30  📝 Ghi chú — @Vũ E xem giúp deal này nhé                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

## 3. Email [M/S]

### 3.1 Email composer (gửi & log)
```
┌────────────────────────────────────────────────────────┐
│  Soạn email                                       ✕      │
│  ──────────────────────────────────────────────────────  │
│  Tới      [ a@abc.com ]                  Template [ ▾ ]  │
│  CC/BCC   [ ............ ]                                │
│  Tiêu đề  [ Báo giá triển khai ERP ]                     │
│  ──────────────────────────────────────────────────────  │
│  [ Soạn nội dung... chèn biến {{contact.name}} ]         │
│  ──────────────────────────────────────────────────────  │
│  📎 bao-gia.pdf (đính kèm)        [+ Đính kèm] [+ Chữ ký]│
│  ──────────────────────────────────────────────────────  │
│  ☑ Ghi vào timeline      [ Lưu nháp ]  [ Gửi ]          │
└────────────────────────────────────────────────────────┘
```
- **Giai đoạn 1 (không cần email server):** "log email" — ghi lại nội dung đã gửi thủ công vào timeline.
- **Giai đoạn 2:** tích hợp gửi thật (SMTP / nhà cung cấp) — kiến trúc để mở rộng, không bắt buộc ngay.
- Biến động: `{{contact.name}}`, `{{company.name}}`, `{{deal.title}}`, `{{owner.name}}`.

### 3.2 Email template [S]
- Thư viện template cá nhân + dùng chung: tên, tiêu đề, nội dung có biến.
- Quản lý ở settings cá nhân; chọn nhanh trong composer.

## 4. Call logging [M]
```
┌──────────────────────────────────────────┐
│  Ghi nhận cuộc gọi                         │
│  ──────────────────────────────────────  │
│  Hướng     (•) Gọi đi  ( ) Gọi đến        │
│  Kết quả   [ Kết nối ▾ ]                   │
│   • Kết nối · Không nghe máy · Bận ·       │
│     Để lại lời nhắn · Sai số              │
│  Thời lượng [ 5 ] phút                     │
│  Ghi chú    [ ............ ]               │
│  ☑ Tạo task theo dõi  [ +3 ngày ▾ ]       │
│                       [Hủy] [Lưu]         │
└──────────────────────────────────────────┘
```
- Kết quả cuộc gọi nuôi Analytics (tỷ lệ kết nối, hoạt động/ngày).

## 5. Note @mention [S]
- Trong ghi chú gõ `@` → gợi ý đồng nghiệp → tạo **notification** cho người được nhắc ([07]).
- Hữu ích cho phối hợp nội bộ trên một deal/contact.

## 6. File attachments [M]
- Đính kèm file vào **record** (lead/contact/deal/company) và vào **email/activity**.
- Tab "File" trên mỗi record: tên, loại, kích thước, người tải, ngày; tải xuống/xóa.
- Giới hạn dung lượng & loại file cấu hình (settings/admin).
```
TAB FILE
┌──────────────────────────────────────────────────┐
│  [⭱ Tải lên]   Kéo-thả file vào đây                │
│  📄 hop-dong-abc.pdf   2.3MB  · Trần B · 06/06  ⭳🗑│
│  📊 bao-gia.xlsx       180KB  · Trần B · 05/06  ⭳🗑│
└──────────────────────────────────────────────────┘
```

## 7. Data model (chi tiết [09])
```ts
interface EmailLog {
  id; relatedType; relatedId; to; cc?; bcc?; subject; body;
  attachments?: number[]; direction:'out'|'in'; status:'logged'|'sent'|'draft';
  sentBy; sentAt;
}
interface CallLog {
  id; relatedType; relatedId; direction:'out'|'in';
  outcome:'connected'|'no_answer'|'busy'|'voicemail'|'wrong_number';
  durationMin?; note?; loggedBy; createdAt;
}
interface Note { id; relatedType; relatedId; body; mentions:number[]; createdBy; createdAt; }
interface Attachment {
  id; relatedType; relatedId; fileName; mimeType; sizeBytes; url;
  uploadedBy; createdAt;
}
interface EmailTemplate { id; name; subject; body; ownerId?; isShared; }
```

## 8. API (chi tiết [09])
```
POST /api/emails            (log/gửi)        GET /api/<entity>/:id/emails
POST /api/calls             (log cuộc gọi)   GET /api/<entity>/:id/calls
POST /api/notes             (mention)        GET /api/<entity>/:id/notes
POST /api/attachments       (upload)         GET /api/<entity>/:id/attachments
GET/POST/PUT/DELETE /api/email-templates
GET /api/<entity>/:id/timeline   (gộp mọi loại, phân trang)
```

## 9. Component
`RecordTimeline` (dùng chung — lõi), `TimelineComposer` (tabs note/call/email/meeting/task),
`EmailComposerDialog`, `EmailTemplatePicker`, `CallLogDialog`, `MentionInput`, `AttachmentPanel`,
`FileUploader` (kéo-thả).

## 10. Acceptance criteria
- [ ] Mọi record (lead/contact/deal/company) dùng chung một timeline + composer.
- [ ] Log/gửi email ghi vào timeline; chọn template & chèn biến.
- [ ] Log cuộc gọi có kết quả/thời lượng; tùy chọn tạo task theo dõi.
- [ ] @mention tạo notification cho người được nhắc.
- [ ] Đính kèm/tải/xóa file trên record; hiển thị ở tab File.
- [ ] Lọc timeline theo loại; phân trang khi dài.
