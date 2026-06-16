# Phần 1 — Thiết kế Cơ sở dữ liệu tổng quan

## 1.1. Quy ước chung

- **DBMS:** MySQL 8.x, charset `utf8mb4_unicode_ci`, engine `InnoDB`.
- **Mỗi Module sở hữu thư mục migration & seed riêng** (xem Phần 2).
- **Tên bảng:** snake_case, số ít, prefix theo tên module (ví dụ: `iam_users`, `crm_leads`, `sales_deals`).
- **Khóa chính:** `BIGINT UNSIGNED AUTO_INCREMENT` cho mọi bảng nghiệp vụ.
- **Soft delete:** cột `deleted_at DATETIME NULL` cho các entity chính (lead, contact, company, deal, product, quote, user).
- **Audit column chuẩn (mọi bảng nghiệp vụ):**
  - `created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP`
  - `updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
  - `created_by BIGINT UNSIGNED NULL` (FK mềm tới `iam_users.id`)
  - `updated_by BIGINT UNSIGNED NULL`
- **Quy ước FK giữa các module:**
  - **KHÔNG** dùng FK constraint ở DB level (vì migration độc lập theo module, lệch version dễ vỡ).
  - FK chỉ khai báo ở **TypeORM entity** để dễ tách module.
  - **Integrity phải được service đảm bảo** (xóa user → phải check lead/deal trước).
- **Quy ước đa hình (polymorphic):** với timeline, attachment, notification... dùng cặp `(record_type, record_id)` thay vì FK. Giá trị `record_type ∈ ENUM('lead','contact','company','deal','quote','activity')`.

---

## 1.2. Danh sách bảng theo Module

### 🟢 Module IAM (Dev 1) — prefix `iam_`

| Bảng | Mục đích | Public (Shared)? |
|---|---|---|
| `iam_users` | Người dùng hệ thống (Admin / Staff) | ✅ **Shared** |
| `iam_invitations` | Lời mời tham gia | ❌ Riêng IAM |
| `iam_audit_logs` | Nhật ký thao tác admin | ✅ **Shared** (mọi module ghi log) |
| `iam_user_prefs` | Cấu hình cá nhân (locale, timezone, notify, signature) | ❌ Riêng IAM |
| `iam_user_sessions` | Phiên đăng nhập (refresh token) | ❌ Riêng IAM |
| `iam_password_resets` | Token quên mật khẩu | ❌ Riêng IAM |

### 🟡 Module CRM Core (Dev 2) — prefix `crm_`

| Bảng | Mục đích | Public (Shared)? |
|---|---|---|
| `crm_companies` | Công ty | ✅ **Shared** |
| `crm_contacts` | Liên hệ | ✅ **Shared** |
| `crm_leads` | Lead (đầu mối) | ✅ **Shared** |
| `crm_lead_tags` | Bảng trung gian N-N giữa lead và tag | ❌ Riêng CRM Core |
| `crm_tags` | Định nghĩa tag (id, label, color, bgColor) | ✅ **Shared** |
| `crm_lead_reminders` | Reminder theo lead | ❌ Riêng CRM Core |
| `crm_lead_assignments` | Lịch sử gán lead | ❌ Riêng CRM Core |
| `crm_distribution_rules` | Luật auto-assign lead | ❌ Riêng CRM Core |
| `crm_pool_config` | Cấu hình lead pool (1 dòng) | ❌ Riêng CRM Core |
| `crm_lead_sources` | Danh mục nguồn lead (Website, LinkedIn…) | ❌ Riêng CRM Core |
| `crm_activities` | Hoạt động (call/email/meeting/task) | ✅ **Shared** |
| `crm_activity_recurrences` | Quy tắc lặp lại (1-1 với activity) | ❌ Riêng CRM Core |
| `crm_timeline_items` | Note/call log/email log/system event trên timeline | ✅ **Shared** |
| `crm_attachments` | File đính kèm (đa hình theo record) | ✅ **Shared** |
| `crm_email_templates` | Mẫu email cá nhân / shared | ✅ **Shared** |
| `crm_mention_users` | Cache user để parse @mention | ❌ Riêng CRM Core (helper) |

### 🟠 Module Sales (Dev 3) — prefix `sales_`

| Bảng | Mục đích | Public (Shared)? |
|---|---|---|
| `sales_pipelines` | Định nghĩa pipeline (New Business, Renewal…) | ❌ Riêng Sales |
| `sales_pipeline_stages` | Các cột trong pipeline | ❌ Riêng Sales |
| `sales_deals` | Cơ hội bán hàng | ✅ **Shared** |
| `sales_deal_line_items` | Sản phẩm trong deal | ❌ Riêng Sales |
| `sales_deal_stage_history` | Lịch sử chuyển stage | ❌ Riêng Sales |
| `sales_loss_reasons` | Lý do thua | ❌ Riêng Sales |
| `sales_products` | Catalog sản phẩm | ✅ **Shared** |
| `sales_tax_rates` | Bảng thuế suất | ❌ Riêng Sales |
| `sales_quotes` | Báo giá | ❌ Riêng Sales |
| `sales_quote_line_items` | Sản phẩm trong báo giá | ❌ Riêng Sales |
| `sales_quote_number_seq` | Sequence số báo giá theo năm | ❌ Riêng Sales |

### 🔵 Module Platform & Analytics (Dev 4) — prefix `platform_`

| Bảng | Mục đích | Public (Shared)? |
|---|---|---|
| `platform_notifications` | Thông báo in-app (mention, assignment, reminder…) | ✅ **Shared** |
| `platform_notification_prefs` | Cấu hình nhận notify theo user | ❌ Riêng Platform |
| `platform_saved_views` | View đã lưu (filter + column) | ✅ **Shared** |
| `platform_custom_field_defs` | Định nghĩa custom field theo entity | ✅ **Shared** |
| `platform_custom_field_values` | Giá trị custom field theo record | ✅ **Shared** |
| `platform_report_defs` | Định nghĩa report | ❌ Riêng Platform |
| `platform_goals` | Mục tiêu (personal / team) | ❌ Riêng Platform |
| `platform_dashboard_layouts` | Bố cục widget theo user | ❌ Riêng Platform |
| `platform_forecast_snapshots` | Snapshot forecast theo kỳ | ❌ Riêng Platform |
| `platform_system_settings` | Key-value cấu hình hệ thống (general, sla) | ❌ Riêng Platform |
| `platform_import_batches` | Lưu lịch sử import CSV | ❌ Riêng Platform |
| `platform_search_index` | (Optional) phục vụ global search | ❌ Riêng Platform |

---

## 1.3. Bảng SHARED (dùng chung) — Quy hoạch vùng đất chung

> Bảng shared **CHỈ** được phép **sửa schema** bởi **chủ sở hữu (Owner)** của nó.
> Các module khác chỉ đọc/ghi qua **Service export** tương ứng (xem Phần 4).

| Bảng | Owner (được sửa) | Module khác được consume (chỉ-đọc/ghi qua service) |
|---|---|---|
| `iam_users` | Dev 1 (IAM) | Tất cả module khác (qua `IamUserService`) |
| `iam_audit_logs` | Dev 1 (IAM) | Tất cả module khác (ghi log qua `AuditService`) |
| `crm_companies` | Dev 2 (CRM Core) | Sales, Platform |
| `crm_contacts` | Dev 2 (CRM Core) | Sales, Platform |
| `crm_leads` | Dev 2 (CRM Core) | Sales (convert), Platform (search/report) |
| `crm_tags` | Dev 2 (CRM Core) | Platform (settings UI), Sales |
| `crm_activities` | Dev 2 (CRM Core) | Sales, Platform (report) |
| `crm_timeline_items` | Dev 2 (CRM Core) | Sales (write), Platform (read) |
| `crm_attachments` | Dev 2 (CRM Core) | Sales (write), Platform |
| `crm_email_templates` | Dev 2 (CRM Core) | Sales (gửi từ quote), Platform (settings) |
| `sales_deals` | Dev 3 (Sales) | Platform (report/forecast/goal) |
| `sales_products` | Dev 3 (Sales) | Platform (search) |
| `platform_notifications` | Dev 4 (Platform) | Tất cả module (ghi qua `NotificationService`) |
| `platform_saved_views` | Dev 4 (Platform) | CRM Core, Sales (consume) |
| `platform_custom_field_defs` | Dev 4 (Platform) | CRM Core, Sales |
| `platform_custom_field_values` | Dev 4 (Platform) | CRM Core, Sales |

### Nguyên tắc vàng

- ❌ Module A **không được** trực tiếp `INSERT/UPDATE/DELETE` bảng shared của Module B.
- ✅ Module A gọi **service export** của Module B (qua DI của NestJS).
- ✅ Mọi thay đổi schema bảng shared phải có **chữ ký (sign-off) của Tech Lead + Owner** trong PR.
- ✅ Khi service của Owner chưa có method cần thiết, module Consumer mở ticket yêu cầu Owner bổ sung (không tự ý truy cập DB trực tiếp).

---

## 1.4. ERD rút gọn

```
iam_users ─────┬──── crm_leads (owner_id)
               ├──── crm_contacts (owner_id)
               ├──── crm_activities (owner_id)
               ├──── crm_companies (owner_id)
               ├──── sales_deals (owner_id)
               ├──── sales_quotes (owner_id)
               ├──── platform_goals (owner_id)
               └──── platform_notifications (user_id)

crm_leads ─────┬──── crm_lead_reminders
               ├──── crm_lead_tags ──── crm_tags
               ├──── crm_lead_assignments
               └──── crm_activities (lead_id)

crm_contacts ──── crm_companies (company_id)
crm_contacts ──── crm_activities (contact_id)
crm_companies ──── crm_activities (company_id)

sales_deals ────┬──── sales_deal_line_items ──── sales_products
                ├──── sales_pipelines ──── sales_pipeline_stages
                ├──── sales_deal_stage_history
                ├──── crm_contacts (contact_id)
                ├──── crm_companies (company_id)
                └──── crm_activities (deal_id)

sales_quotes ───┬──── sales_quote_line_items ──── sales_products
                ├──── sales_deal (deal_id)
                ├──── crm_contacts (contact_id)
                └──── crm_companies (company_id)

crm_timeline_items (record_type, record_id) — đa hình, FK mềm
crm_attachments (record_type, record_id) — đa hình
platform_notifications (user_id, link, type)
platform_custom_field_values (entity, record_id, field_key)
platform_saved_views (entity, user_id)
```

---

## 1.5. Lệnh tạo bảng — Mỗi Module sở hữu migration riêng

- **Cấu trúc thư mục migration:**
  ```
  server/src/modules/<module>/database/migrations/
  server/src/modules/<module>/database/seeds/
  ```
- **Công cụ:** TypeORM migrations (CLI: `typeorm-ts-node-commonjs migration:generate`, `migration:run`).
- **Quy tắc:** migration tạo bảng shared **chỉ do Owner tạo**. Module khác **không sửa migration của Owner**.
- **Thứ tự chạy migration (cố định, Tech Lead quy định trong `migration:run` script):**
  1. `iam` — vì bảng shared của IAM (`iam_users`) cần có trước
  2. `crm` — vì `crm_leads/contacts/companies` cần tồn tại để Sales reference
  3. `sales` — vì `sales_deals/products` được Platform consume
  4. `platform` — chạy cuối, là module người dùng cuối cùng

- **Seed:** mỗi module có file `seed.ts` riêng; `main.ts` (khi `NODE_ENV=development`) gọi lần lượt theo thứ tự trên.

---

## 1.6. Schema SQL chi tiết (tham khảo cho Owner viết migration)

> Đây là schema khung để Owner tham chiếu khi viết migration. Mỗi Owner tự generate migration cho bảng của mình.

### iam_users
```sql
CREATE TABLE iam_users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NULL,
  avatar_url VARCHAR(500) NULL,
  role ENUM('admin','user') NOT NULL DEFAULT 'user',
  status ENUM('active','inactive','invited','deleted') NOT NULL DEFAULT 'active',
  last_login_at DATETIME NULL,
  must_change_password BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_users_status (status),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### iam_audit_logs
```sql
CREATE TABLE iam_audit_logs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NULL,
  user_name VARCHAR(100) NULL,
  action VARCHAR(50) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id BIGINT UNSIGNED NULL,
  details JSON NULL,
  ip_address VARCHAR(45) NULL,
  user_agent VARCHAR(500) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_audit_user_created (user_id, created_at),
  INDEX idx_audit_entity (entity_type, entity_id),
  INDEX idx_audit_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_leads
```sql
CREATE TABLE crm_leads (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(150) NOT NULL,
  company VARCHAR(200) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  source VARCHAR(50) NULL,
  status ENUM('new','contacted','qualified','lost') NOT NULL DEFAULT 'new',
  score INT NOT NULL DEFAULT 0,
  in_pool BOOLEAN NOT NULL DEFAULT FALSE,
  `order` INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by BIGINT UNSIGNED NULL,
  updated_by BIGINT UNSIGNED NULL,
  deleted_at DATETIME NULL,
  INDEX idx_leads_owner (owner_id),
  INDEX idx_leads_status (status),
  INDEX idx_leads_source (source),
  INDEX idx_leads_pool (in_pool),
  INDEX idx_leads_score (score),
  INDEX idx_leads_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_contacts
```sql
CREATE TABLE crm_contacts (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  company_id BIGINT UNSIGNED NULL,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(20) NULL,
  position VARCHAR(100) NULL,
  tags JSON NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_contacts_owner (owner_id),
  INDEX idx_contacts_company (company_id),
  INDEX idx_contacts_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_companies
```sql
CREATE TABLE crm_companies (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(200) NOT NULL,
  website VARCHAR(255) NULL,
  industry VARCHAR(80) NULL,
  size VARCHAR(40) NULL,
  phone VARCHAR(20) NULL,
  address VARCHAR(500) NULL,
  tax_code VARCHAR(50) NULL,
  description TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_companies_owner (owner_id),
  INDEX idx_companies_industry (industry)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_activities
```sql
CREATE TABLE crm_activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  type ENUM('call','email','meeting','task') NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT NULL,
  lead_id BIGINT UNSIGNED NULL,
  contact_id BIGINT UNSIGNED NULL,
  company_id BIGINT UNSIGNED NULL,
  deal_id BIGINT UNSIGNED NULL,
  related_type ENUM('lead','contact','company','deal','quote') NULL,
  related_id BIGINT UNSIGNED NULL,
  due_date DATETIME NULL,
  remind_at DATETIME NULL,
  status ENUM('pending','completed','overdue') NOT NULL DEFAULT 'pending',
  priority ENUM('high','medium','low') NULL,
  completed_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_activities_owner (owner_id),
  INDEX idx_activities_due (due_date),
  INDEX idx_activities_status (status),
  INDEX idx_activities_lead (lead_id),
  INDEX idx_activities_deal (deal_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_timeline_items (polymorphic)
```sql
CREATE TABLE crm_timeline_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  record_type ENUM('lead','contact','company','deal','quote','activity') NOT NULL,
  record_id BIGINT UNSIGNED NOT NULL,
  type ENUM('note','call','email','meeting','task','system') NOT NULL,
  title VARCHAR(200) NULL,
  content TEXT NULL,
  meta JSON NULL,
  mentions JSON NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_timeline_record (record_type, record_id, created_at),
  INDEX idx_timeline_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_attachments (polymorphic)
```sql
CREATE TABLE crm_attachments (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  record_type ENUM('lead','contact','company','deal','quote','activity') NOT NULL,
  record_id BIGINT UNSIGNED NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT UNSIGNED NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  uploaded_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_attach_record (record_type, record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### crm_distribution_rules
```sql
CREATE TABLE crm_distribution_rules (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  priority INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  conditions JSON NOT NULL,
  action JSON NOT NULL,
  created_by BIGINT UNSIGNED NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_rules_priority (priority),
  INDEX idx_rules_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### sales_deals
```sql
CREATE TABLE sales_deals (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  owner_id BIGINT UNSIGNED NOT NULL,
  pipeline_id BIGINT UNSIGNED NULL,
  lead_id BIGINT UNSIGNED NULL,
  contact_id BIGINT UNSIGNED NULL,
  company_id BIGINT UNSIGNED NULL,
  title VARCHAR(200) NOT NULL,
  value DECIMAL(18,2) NOT NULL DEFAULT 0,
  currency ENUM('VND','USD') NOT NULL DEFAULT 'VND',
  stage VARCHAR(50) NOT NULL DEFAULT 'lead',
  probability INT NOT NULL DEFAULT 0,
  status ENUM('open','won','lost') NOT NULL DEFAULT 'open',
  expected_close_date DATE NULL,
  won_at DATETIME NULL,
  lost_at DATETIME NULL,
  loss_reason_id BIGINT UNSIGNED NULL,
  competitor VARCHAR(200) NULL,
  stage_entered_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_deals_owner (owner_id),
  INDEX idx_deals_stage (stage),
  INDEX idx_deals_pipeline (pipeline_id),
  INDEX idx_deals_status (status),
  INDEX idx_deals_close (expected_close_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### sales_deal_line_items
```sql
CREATE TABLE sales_deal_line_items (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  deal_id BIGINT UNSIGNED NOT NULL,
  product_id BIGINT UNSIGNED NULL,
  name VARCHAR(200) NOT NULL,
  qty DECIMAL(12,2) NOT NULL DEFAULT 1,
  unit_price DECIMAL(18,2) NOT NULL DEFAULT 0,
  discount_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
  tax_pct DECIMAL(5,2) NOT NULL DEFAULT 0,
  total DECIMAL(18,2) NOT NULL DEFAULT 0,
  INDEX idx_li_deal (deal_id),
  INDEX idx_li_product (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### sales_quotes
```sql
CREATE TABLE sales_quotes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  number VARCHAR(30) NOT NULL UNIQUE,
  title VARCHAR(200) NOT NULL,
  deal_id BIGINT UNSIGNED NULL,
  company_id BIGINT UNSIGNED NULL,
  contact_id BIGINT UNSIGNED NULL,
  status ENUM('draft','sent','accepted','rejected','expired') NOT NULL DEFAULT 'draft',
  valid_until DATE NULL,
  subtotal DECIMAL(18,2) NOT NULL DEFAULT 0,
  discount_total DECIMAL(18,2) NOT NULL DEFAULT 0,
  tax_total DECIMAL(18,2) NOT NULL DEFAULT 0,
  total DECIMAL(18,2) NOT NULL DEFAULT 0,
  currency ENUM('VND','USD') NOT NULL DEFAULT 'VND',
  terms TEXT NULL,
  owner_id BIGINT UNSIGNED NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at DATETIME NULL,
  decided_at DATETIME NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  INDEX idx_quotes_owner (owner_id),
  INDEX idx_quotes_status (status),
  INDEX idx_quotes_deal (deal_id),
  INDEX idx_quotes_contact (contact_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### platform_notifications
```sql
CREATE TABLE platform_notifications (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  type ENUM('mention','assignment','reminder','deal_stage','quote_accepted','system') NOT NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NULL,
  link VARCHAR(500) NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_notif_user_read (user_id, is_read, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### platform_custom_field_defs / values
```sql
CREATE TABLE platform_custom_field_defs (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity ENUM('lead','contact','company','deal','quote','activity') NOT NULL,
  field_key VARCHAR(80) NOT NULL,
  label VARCHAR(150) NOT NULL,
  type ENUM('text','number','date','select','checkbox') NOT NULL,
  options JSON NULL,
  required BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_field (entity, field_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE platform_custom_field_values (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  entity ENUM('lead','contact','company','deal','quote','activity') NOT NULL,
  record_id BIGINT UNSIGNED NOT NULL,
  field_key VARCHAR(80) NOT NULL,
  value TEXT NULL,
  UNIQUE KEY uq_value (entity, record_id, field_key),
  INDEX idx_value_record (entity, record_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### platform_saved_views
```sql
CREATE TABLE platform_saved_views (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  entity ENUM('lead','contact','company','deal','quote','activity') NOT NULL,
  name VARCHAR(150) NOT NULL,
  filters JSON NOT NULL,
  columns JSON NOT NULL,
  sort VARCHAR(150) NULL,
  is_shared BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_sv_user_entity (user_id, entity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

> Các bảng còn lại (`crm_tags`, `crm_lead_sources`, `crm_email_templates`, `sales_pipelines`, `sales_pipeline_stages`, `sales_loss_reasons`, `sales_products`, `sales_tax_rates`, `platform_goals`, `platform_report_defs`, `platform_dashboard_layouts`, `platform_system_settings`, ...) — mỗi Owner tự định nghĩa schema tương tự khi viết migration.
