# 00 — Tổng quan & Tầm nhìn Admin Site

## 1. Bối cảnh

VanhCorp CRM hiện là một ứng dụng **Next.js 14 frontend hoàn chỉnh** nhưng chạy hoàn toàn trên
**mock data** (`lib/mock-data.ts`). Các tính năng nghiệp vụ cho sale đã tốt: Dashboard, Leads
(table + kanban, filter, tag, reminder, convert), Deals (pipeline), Contacts, Activities.

**Vấn đề:** phần quản trị gần như chưa có. Không thể vận hành như một CRM thật cho một đội sale vì thiếu:

- Không có đăng nhập thật, không phân biệt người dùng → mọi người thấy cùng một tập dữ liệu.
- Không tạo/quản lý được tài khoản cho nhân viên.
- Không có khái niệm "lead này của ai" → không kiểm soát, không chia việc.
- Không có nhật ký thao tác (audit) → không truy vết được ai làm gì.
- Không có cấu hình hệ thống tập trung.

## 2. Tầm nhìn

> Biến CRM thành hệ thống vận hành được cho một **đội sale**: Admin tạo tài khoản, phân quyền,
> chia lead cho từng nhân viên (thủ công hoặc theo luật tự động), theo dõi hiệu suất và kiểm soát
> toàn bộ hoạt động — trong khi mỗi User chỉ thấy và xử lý lead được giao.

## 3. Gap Analysis (Hiện trạng → Mục tiêu)

| Lĩnh vực | Hiện trạng | Mục tiêu (admin site) |
|----------|-----------|----------------------|
| Xác thực | ❌ Login chỉ là UI | ✅ Auth thật (JWT), session, đổi/quên mật khẩu |
| Người dùng | ❌ Không có | ✅ CRUD user, mời qua email, kích hoạt/khóa, reset MK |
| Phân quyền | ❌ Không có | ✅ RBAC 2 cấp Admin/User, kiểm soát theo module |
| Sở hữu lead | 🟡 Có field `assignee` (text tự do) | ✅ `owner_id` thật, gắn user, lọc theo quyền |
| Chia lead | ❌ Không có | ✅ Gán thủ công + bulk + luật tự động + pool nhận |
| Audit | ❌ Không có | ✅ Nhật ký mọi thao tác quan trọng, lọc & xem |
| Admin dashboard | ❌ Không có | ✅ Tổng quan toàn hệ thống, hiệu suất theo user |
| Cấu hình | 🟡 Settings cá nhân | ✅ Cấu hình hệ thống: nguồn lead, SLA, tag, vai trò |

## 4. Đối tượng người dùng (Personas)

### 4.1 Admin (quản trị viên / trưởng nhóm sale)
- **Mục tiêu:** kiểm soát toàn bộ, không bỏ sót lead, chia việc công bằng, theo dõi hiệu suất.
- **Công việc chính:** tạo tài khoản nhân viên, cấu hình luật chia lead, gán/đổi lead, xem audit, xem dashboard tổng.
- **Tần suất:** hàng ngày, thao tác nhanh, cần bulk action.

### 4.2 User (nhân viên sale)
- **Mục tiêu:** xử lý tốt lead được giao, không bị nhiễu bởi dữ liệu người khác.
- **Công việc chính:** xem lead của mình, cập nhật trạng thái, đặt reminder, convert deal.
- **Giới hạn:** không thấy lead người khác, không vào được khu admin.

## 5. Nguyên tắc thiết kế (Design Principles)

1. **Kế thừa, không phá vỡ** — dùng lại design system, component và pattern hiện có. Admin trông "cùng một nhà" với app sale.
2. **An toàn theo mặc định** — mọi route/API admin chặn từ phía server; ẩn UI không đủ quyền; xác nhận trước hành động phá hủy.
3. **Thao tác hàng loạt là first-class** — chia lead, đổi chủ, khóa user… đều có bulk action.
4. **Truy vết được** — mọi hành động admin quan trọng đều ghi audit.
5. **Tối thiểu nhập liệu** — ưu tiên chọn từ danh sách, gợi ý thông minh, giá trị mặc định hợp lý.
6. **Phản hồi rõ ràng** — loading, empty, error, success state đầy đủ; toast cho mọi hành động.
7. **Responsive** — admin dùng được trên tablet; bảng có chế độ thu gọn cho mobile.

## 6. Phạm vi (Scope)

### Trong phạm vi (In scope)
- Quản lý user & tạo tài khoản (CRUD, mời, khóa, reset MK, đổi vai trò).
- RBAC 2 cấp + bảo vệ route/API.
- Chia lead: gán thủ công, bulk assign, rule-based engine, pool tự nhận, reassign.
- Audit log.
- Admin dashboard (tổng quan + hiệu suất theo user).
- System settings (nguồn lead, tag, SLA reminder, luật chia).

### Ngoài phạm vi (Out of scope — giai đoạn sau)
- Phân quyền RBAC tùy biến nhiều cấp (chỉ làm 2 cấp như đã chốt).
- Phòng ban/team nhiều tầng.
- SSO/OAuth bên thứ ba.
- Billing, multi-tenant.
- Email server thật (mời user dùng token link; tích hợp email là phần mở rộng).

## 7. Thước đo thành công

- Admin tạo được tài khoản và nhân viên đăng nhập được trong < 2 phút.
- 100% lead có chủ sở hữu rõ ràng (không còn lead "vô chủ" ngoài pool có chủ đích).
- Lead mới được chia tự động theo luật trong < 1s sau khi tạo.
- Mọi hành động admin đều có bản ghi audit truy vết được.
- User không bao giờ thấy dữ liệu ngoài quyền (kiểm chứng bằng test phân quyền).
