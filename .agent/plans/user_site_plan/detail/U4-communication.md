# U4 — Communication: Email, Call log, Notes @mention, Attachments (Detailed Plan)

> **Giải quyết:** nút "Send Email"/"Call" chỉ cuộn tới form note; không log email/cuộc gọi có cấu trúc;
> không @mention; không đính kèm file. Tham chiếu: `userdocs/05`.
> **Phụ thuộc:** U1 (`RecordTimeline`, `TimelineComposer`).

## 0. Mục tiêu & DoD
- **Email**: composer log/gửi + template + biến; ghi vào timeline.
- **Call log**: kết quả, thời lượng, tùy chọn tạo task theo dõi.
- **Note @mention**: nhắc đồng nghiệp → tạo notification (nối U6).
- **Attachments**: đính kèm file vào record/email; tab File.
- Tất cả hội tụ trên `RecordTimeline` của mọi record.

## 1. Phạm vi file

### Tạo mới
```
components/comm/email-composer-dialog.tsx
components/comm/email-template-picker.tsx
components/comm/call-log-dialog.tsx
components/comm/mention-input.tsx
components/comm/attachment-panel.tsx
components/comm/file-uploader.tsx
lib/templates.ts                 # render biến {{...}}
lib/mentions.ts                  # parse @mention
```

### Sửa
```
types/index.ts                   # EmailLog, CallLog, Note, Attachment, EmailTemplate
lib/mock-data.ts                 # emailTemplates[], vài attachment/email/call mẫu
components/shared/timeline-composer.tsx   # nối các tab mở dialog tương ứng (từ U1)
app/(dashboard)/settings/page.tsx         # quản lý template + chữ ký (nối U6 settings)
```

## 2. Data layer

### 2.1 Types
```ts
export interface EmailLog {
  id: string; relatedType: RecordType; relatedId: string;
  to: string; cc?: string; bcc?: string; subject: string; body: string;
  attachments?: string[]; direction: "out"|"in"; status: "logged"|"sent"|"draft";
  sentBy: string; sentAt: string;
}
export interface CallLog {
  id: string; relatedType: RecordType; relatedId: string;
  direction: "out"|"in";
  outcome: "connected"|"no_answer"|"busy"|"voicemail"|"wrong_number";
  durationMin?: number; note?: string; loggedBy: string; createdAt: string;
}
export interface Note {
  id: string; relatedType: RecordType; relatedId: string;
  body: string; mentions: string[]; createdBy: string; createdAt: string;
}
export interface Attachment {
  id: string; relatedType: RecordType; relatedId: string;
  fileName: string; mimeType: string; sizeBytes: number; url: string;
  uploadedBy: string; createdAt: string;
}
export interface EmailTemplate { id: string; name: string; subject: string; body: string; ownerId?: string; isShared: boolean; }
```

### 2.2 Helpers
```ts
// lib/templates.ts
export function renderTemplate(tpl: string, ctx: Record<string,string>) {
  return tpl.replace(/\{\{(\w+(?:\.\w+)?)\}\}/g, (_, k) => ctx[k] ?? "");
}
// ctx ví dụ: { "contact.name": "...", "company.name": "...", "deal.title": "...", "owner.name": "..." }

// lib/mentions.ts
export function parseMentions(body: string, users: {id:string;name:string}[]): string[] { /* @Name -> id[] */ }
```

### 2.3 API (backend)
```
POST /api/emails    GET /api/:recordType/:id/emails
POST /api/calls     GET /api/:recordType/:id/calls
POST /api/notes     GET /api/:recordType/:id/notes
POST /api/attachments (multipart)  GET /api/:recordType/:id/attachments  DELETE /api/attachments/:id
GET/POST/PUT/DELETE /api/email-templates
GET /api/:recordType/:id/timeline   (gộp tất cả, phân trang)
```
> **Upload (backend):** lưu file vào thư mục/`data/uploads` hoặc object storage; trả URL. Giới hạn loại/kích thước.

## 3. UX/UI
- Email composer: `userdocs/05` §3.1; template picker chèn biến.
- Call log: `userdocs/05` §4 (kết quả + thời lượng + tạo task follow-up).
- @mention: `userdocs/05` §5. Attachments/tab File: `userdocs/05` §6.
- `TimelineComposer` tabs (từ U1): Note mở inline; Call/Email mở dialog; kết quả ghi thành `TimelineItem`.

## 4. Component skeleton

### 4.1 `EmailComposerDialog`
```tsx
"use client";
// props: relatedType, relatedId, defaultTo, onLogged
// fields: to/cc/bcc/subject/body + EmailTemplatePicker + FileUploader + chữ ký
// Giai đoạn 1: status='logged' (ghi lại thủ công). Giai đoạn 2: gọi API gửi -> 'sent'.
// onLogged -> thêm TimelineItem type='email' (meta: to, attachments)
```

### 4.2 `CallLogDialog`
```tsx
// direction, outcome(select), durationMin, note, checkbox "tạo task theo dõi +N ngày"
// onSubmit -> TimelineItem type='call' (meta: outcome, durationMin) + (option) tạo Activity task (U3)
```

### 4.3 `MentionInput`
```tsx
// textarea + popup gợi ý khi gõ '@'; trả body + mentions[]
// onSubmit -> Note + tạo Notification cho mỗi mention (U6)
```

### 4.4 `FileUploader` / `AttachmentPanel`
```tsx
// kéo-thả + chọn file; hiển thị tên/size/loại; tải xuống/xóa; validate loại/kích thước
```

## 5. Các bước thực thi
1. [ ] Thêm types EmailLog/CallLog/Note/Attachment/EmailTemplate.
2. [ ] `lib/templates.ts` (render biến) + `lib/mentions.ts` (parse @).
3. [ ] Mock: emailTemplates[], vài email/call/attachment mẫu gắn record.
4. [ ] `EmailComposerDialog` + `EmailTemplatePicker`.
5. [ ] `CallLogDialog` (+ tùy chọn tạo task qua U3).
6. [ ] `MentionInput` + tạo notification (U6; mock: toast).
7. [ ] `FileUploader` + `AttachmentPanel` + tab File trên record.
8. [ ] Nối `TimelineComposer` (U1): Note/Call/Email/Meeting/Task mở đúng dialog; ghi `TimelineItem`.
9. [ ] Settings: quản lý template + chữ ký email (nối U6).
10. [ ] (Backend) endpoint emails/calls/notes/attachments + upload.

## 6. Test & nghiệm thu
- [ ] Log email từ record → xuất hiện trên timeline với người nhận + đính kèm.
- [ ] Chọn template → nội dung điền biến đúng ({{contact.name}}...).
- [ ] Log cuộc gọi với kết quả/thời lượng; tùy chọn tạo task follow-up hoạt động.
- [ ] @mention gợi ý đúng người, tạo notification cho người được nhắc.
- [ ] Đính kèm/tải/xóa file; validate loại & kích thước; hiển thị ở tab File.
- [ ] Lọc timeline theo loại; phân trang khi dài.

## 7. Rủi ro & giảm thiểu
- **Gửi email thật** phụ thuộc SMTP/dịch vụ → tách giai đoạn: "log thủ công" trước, "gửi thật" sau (không chặn tiến độ).
- **Upload file** rủi ro bảo mật (loại/kích thước, path traversal) → validate chặt, sinh tên ngẫu nhiên, giới hạn MIME.
- **@mention sai người trùng tên** → gợi ý kèm email; lưu id chứ không lưu tên.
