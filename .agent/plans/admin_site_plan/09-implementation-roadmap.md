# 09 — Implementation Roadmap (Admin Site)

> Kế hoạch triển khai admin site theo phase. Mỗi phase có mục tiêu, công việc, tiêu chí nghiệm thu.
> Ăn khớp với roadmap backend tổng (`plans/phase_1..7`); phần admin này chi tiết hóa Phase 5–6.

## 0. Điều kiện tiên quyết

Trước khi làm admin, cần nền tảng từ roadmap gốc:
- ✅ Frontend (đã xong)
- ⬜ Backend foundation (`plans/phase_1`) — server, SQLite, router
- ⬜ Auth thật (`plans/phase_2`) — JWT, login/logout, `/auth/me`
- ⬜ Core CRUD có `owner_id` (`plans/phase_3,4`)

> Nếu auth chưa xong, **A1** dưới đây phải làm trước tiên.

---

## Phase A — Nền tảng phân quyền & ownership
**Mục tiêu:** mỗi user có danh tính, dữ liệu gắn chủ, phân quyền chạy ở cả 3 tầng.

| # | Công việc | File chính | Tham chiếu |
|---|-----------|-----------|-----------|
| A1 | Auth context FE + token + `useAuth` | `lib/auth-context.tsx` | [02] §6.4 |
| A2 | Migration: thêm cột users (status, avatar, last_login) | `server/src/db/` | [03] §2 |
| A3 | Middleware `requireAuth/requireAdmin/scopeToOwner` | `server/src/middleware/auth.js` | [02] §6.1 |
| A4 | `owner_id` filter ở mọi repository core | repositories | [02] §2 |
| A5 | `AdminGuard`, `Can`, `lib/permissions.ts` | `components/admin/` | [02] §6 |
| A6 | Sidebar: nhóm Admin chỉ hiện với admin | `components/layout/sidebar.tsx` | [01] §3.1 |
| A7 | `audit_logs` table + `audit-service.log()` helper | server | [03] §6 |

**Nghiệm thu:**
- User đăng nhập chỉ thấy lead của mình; admin thấy tất cả (kiểm chứng API + UI).
- Truy cập `/admin` bằng user thường → 403.
- Mọi mutation core ghi 1 dòng audit.

---

## Phase B — Quản lý User & Tạo tài khoản
**Mục tiêu:** admin tạo/mời/sửa/khóa/xóa user, đổi vai trò, reset MK.

| # | Công việc | Tham chiếu |
|---|-----------|-----------|
| B1 | API users CRUD + role/status/password/stats | [07] §3 |
| B2 | API invitations + trang `/accept-invite` | [07] §4, [04] §3.2 |
| B3 | `/admin/users` list (DataTable, filter, bulk) | [04] §2 |
| B4 | `UserFormDialog` + `InviteUserDialog` + validation | [04] §3 |
| B5 | `/admin/users/[id]` chi tiết + tabs | [04] §4 |
| B6 | Hành động nhạy cảm: khóa/reset/xóa + `ReassignLeadsDialog` | [04] §5 |
| B7 | Business rules: còn ≥1 admin, không tự hạ quyền | [02] §4 |

**Nghiệm thu:**
- Tạo user trực tiếp + mời qua link đều cho ra tài khoản đăng nhập được.
- Không thể khóa/xóa admin cuối cùng; không tự hạ quyền.
- Xóa user buộc reassign → không còn lead mồ côi.
- Mọi hành động ghi audit đúng action.

---

## Phase C — Chia lead: Gán thủ công
**Mục tiêu:** admin gán/bulk-assign/đổi chủ; user nhận từ pool.

| # | Công việc | Tham chiếu |
|---|-----------|-----------|
| C1 | `lead_assignments` table + repository | [03] §3 |
| C2 | API assign/bulk/claim/reassign-from-user | [07] §5 |
| C3 | `/admin/leads` tab "Gán thủ công" + `AssignableLeadTable` | [05] §2 |
| C4 | `AssignLeadDialog` + `EmployeeLoadPicker` (hiện tải + gợi ý) | [05] §2.2 |
| C5 | Nút "Đổi chủ"/bulk trên `/leads` cho admin | [05] §2.3 |
| C6 | Pool: config + bảng + `ClaimLeadDialog` (user nhận) | [05] §4 |

**Nghiệm thu:**
- Bulk-assign nhiều lead trong 1 thao tác; ghi lịch sử + audit.
- User nhận lead từ pool, bị chặn khi quá giới hạn.
- Picker hiển thị đúng tải hiện tại của từng nhân viên.

---

## Phase D — Chia lead: Luật tự động (rule-based)
**Mục tiêu:** lead mới tự chia theo luật; admin quản lý luật trực quan.

| # | Công việc | Tham chiếu |
|---|-----------|-----------|
| D1 | `lead_distribution_rules` table + repository | [03] §4 |
| D2 | `distribution-service`: match conditions + strategy (round_robin/least_load/...) | [05] §3.5 |
| D3 | Tích hợp engine vào `lead-service.create()` + khi vào pool | [05] §3.5 |
| D4 | API rules CRUD + toggle + reorder + preview + apply | [07] §6 |
| D5 | `/admin/leads` tab "Luật": `RuleList` kéo-thả ưu tiên | [05] §3.1 |
| D6 | `RuleBuilderDialog`: `ConditionRow`, `ActionEditor`, `RulePreview` | [05] §3.2 |

**Nghiệm thu:**
- Tạo lead khớp luật → tự gán đúng người theo strategy < 1s.
- Đổi thứ tự ưu tiên ảnh hưởng kết quả như mong đợi.
- Preview đếm đúng số lead khớp trước khi lưu.
- Target inactive bị bỏ qua, fallback về pool khi không có target hợp lệ.

---

## Phase E — Admin Dashboard, Audit UI, Settings
**Mục tiêu:** quan sát toàn hệ thống & cấu hình tập trung.

| # | Công việc | Tham chiếu |
|---|-----------|-----------|
| E1 | API `/admin/overview`, `/performance`, `/alerts` | [07] §10 |
| E2 | `/admin` dashboard: KPI, bảng hiệu suất, donut, feed, alerts | [06] §1 |
| E3 | API audit list + export CSV | [07] §8 |
| E4 | `/admin/audit`: `AuditTable` expandable + filter + export | [06] §2 |
| E5 | `system_settings` table + API | [03] §7, [07] §9 |
| E6 | `/admin/settings/*`: general, lead-sources, tags, sla | [06] §3 |
| E7 | Chuyển `LEAD_SOURCES`/`TAG_CONFIGS` từ hardcode → settings | [06] §3.2-3.3 |

**Nghiệm thu:**
- Dashboard phản ánh đúng số liệu theo period; click cảnh báo điều hướng đúng.
- Audit lọc & xuất CSV đúng theo bộ lọc; before/after hiển thị rõ.
- Sửa nguồn lead/tag/SLA ở settings có hiệu lực ngay trong form lead & engine.

---

## Phase F — Hoàn thiện & kiểm thử
**Mục tiêu:** chắc chắn, an toàn, mượt.

| # | Công việc |
|---|-----------|
| F1 | Test phân quyền: user không truy cập được dữ liệu/route admin (auto test) |
| F2 | Test engine chia lead: các strategy, edge case (target khóa, hết target) |
| F3 | Loading/empty/error state mọi trang admin |
| F4 | Responsive pass (tablet/mobile) cho bảng & rule builder |
| F5 | Accessibility pass (focus, aria, keyboard dnd) |
| F6 | Rate-limit login + log `auth.login_failed` |
| F7 | Seed demo: 1 admin + 4 user + 3 luật + dữ liệu mẫu |

---

## Bảng phụ thuộc (dependency)
```
A (nền tảng)
 ├─▶ B (user mgmt)
 ├─▶ C (gán thủ công) ──▶ D (luật tự động)
 └─▶ E (dashboard/audit/settings)   [E phụ thuộc một phần A7 audit, C cho số liệu]
B,C,D,E ──▶ F (kiểm thử & hoàn thiện)
```

## Thứ tự khuyến nghị
**A → B → C → D → E → F.**
Có thể song song: sau A, một người làm B (user), một người làm C/D (lead). E làm sau khi có dữ liệu từ B/C để dashboard có gì hiển thị.

## Ước lượng tương đối (story points / độ lớn)
| Phase | Độ lớn | Ghi chú |
|-------|:------:|--------|
| A | L | Nền tảng, ảnh hưởng toàn hệ thống |
| B | M | CRUD nhiều nhưng pattern lặp |
| C | M | Bulk + pool |
| D | L | Engine + builder là phần khó nhất |
| E | M | Nhiều màn nhưng mỗi màn vừa |
| F | M | Test + polish |

## Định nghĩa "Hoàn thành" (Definition of Done) cho admin site
- [ ] Phân quyền chặn ở server cho 100% endpoint admin.
- [ ] Không lead mồ côi sau xóa/khóa user.
- [ ] Lead mới tự chia theo luật, có fallback pool.
- [ ] Mọi hành động admin có audit truy vết.
- [ ] UX khớp design system; có đủ loading/empty/error.
- [ ] Responsive + accessible đạt chuẩn ở [08] §5.
- [ ] Có seed demo để chạy thử ngay.
