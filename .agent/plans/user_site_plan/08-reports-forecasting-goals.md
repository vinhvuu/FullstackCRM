# 08 — Reports, Forecasting & Goals

> Reports hiện là **4 biểu đồ tĩnh** từ mock, "Export" không chạy. Chuẩn doanh nghiệp cần
> **report builder**, **forecast doanh thu**, **quota/goals** theo nhân viên, và **leaderboard**.

## 1. Khoảng cách & mục tiêu

| Thiếu hiện tại | Bổ sung | Ưu tiên |
|----------------|---------|:------:|
| Chart cố định | **Report builder** tùy biến | M |
| Không mục tiêu | **Quota/Goals + tiến độ** | M |
| Không dự báo | **Forecast** doanh thu | S |
| Không so sánh người | **Leaderboard** | C |
| Dashboard cố định | **Widget cấu hình** | S |
| Export giả | **Export thật + lịch gửi** | M/C |
| Không drill-down | Click chart → danh sách record | S |

## 2. Report builder [M]
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Tạo báo cáo                                                  [Lưu] [Xuất]      │
│  ┌────────────────────┐  ┌──────────────────────────────────────────────────┐ │
│  │ CẤU HÌNH           │  │  XEM TRƯỚC                                         │ │
│  │ Đối tượng [Deal ▾] │  │   ┌────────────────────────────────────────┐     │ │
│  │ Loại biểu đồ        │  │   │  (bar/line/pie/bảng theo cấu hình)     │     │ │
│  │  [Cột ▾]           │  │   └────────────────────────────────────────┘     │ │
│  │ Trục X (nhóm theo)  │  │                                                  │ │
│  │  [Stage ▾]         │  │                                                  │ │
│  │ Đo lường (Y)        │  │                                                  │ │
│  │  [Tổng giá trị ▾]  │  │                                                  │ │
│  │ Bộ lọc              │  │                                                  │ │
│  │  Kỳ [Quý này ▾]    │  │                                                  │ │
│  │  Chủ [Tất cả ▾]    │  │                                                  │ │
│  └────────────────────┘  └──────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────────┘
```
- **Đối tượng:** Lead / Deal / Activity / Quote.
- **Nhóm theo (dimension):** stage, source, owner, công ty, ngành, tháng/quý, tag, lý do thua.
- **Đo lường (measure):** đếm, tổng giá trị, giá trị weighted, tỷ lệ chuyển đổi, tỷ lệ thắng.
- **Loại:** cột, đường, tròn, bảng pivot, số đơn (KPI).
- Lưu thành **báo cáo** dùng lại; ghim lên dashboard.
- **Drill-down:** click cột/lát → danh sách record tương ứng.

## 3. Quota / Goals [M]
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Mục tiêu — Quý 2/2026                                          [Đặt mục tiêu]  │
│  ──────────────────────────────────────────────────────────────────────────  │
│  CÁ NHÂN (Trần B)                                                              │
│  Doanh thu   ▓▓▓▓▓▓▓░░░  720tr / 1 tỷ      72%   (còn 23 ngày)                 │
│  Số deal     ▓▓▓▓▓▓░░░░  6 / 10            60%                                 │
│  ──────────────────────────────────────────────────────────────────────────  │
│  TOÀN ĐỘI                                                                      │
│  Doanh thu   ▓▓▓▓▓▓▓▓░░  4.2 tỷ / 5 tỷ     84%                                 │
└──────────────────────────────────────────────────────────────────────────────┘
```
- Đặt quota theo **kỳ** (tháng/quý) cho **cá nhân** & **đội**: doanh thu, số deal thắng.
- Thanh tiến độ + dự đoán "đang trên/dưới đà" (pace) so với thời gian còn lại.
- Hiển thị trên dashboard cá nhân & admin overview (admindocs).

## 4. Forecast [S]
- Dự báo doanh thu kỳ tới = Σ(giá trị deal mở × xác suất theo stage), có thể điều chỉnh thủ công (commit/best-case/pipeline).
- Phân loại: **Committed** (cam kết) / **Best case** / **Pipeline**.
- Biểu đồ forecast vs quota theo thời gian.

## 5. Leaderboard [C]
- Bảng xếp hạng nhân viên theo doanh thu/đếm deal/hoạt động trong kỳ; huy hiệu top 3.

## 6. Dashboard widget cấu hình [S]
- Cho phép thêm/bớt/sắp xếp widget trên `/` (kéo-thả): KPI, chart đã lưu, "việc hôm nay", "deal cần chú ý", quota.
- Mỗi user tự cấu hình dashboard của mình.

## 7. Export & scheduled report [M/C]
- Export báo cáo ra CSV/Excel/PDF (nút "Export" hiện tại làm cho chạy thật).
- [C] Lịch gửi báo cáo định kỳ qua email (hằng tuần/tháng).

## 8. Báo cáo dựng sẵn (presets) [M]
Cung cấp sẵn báo cáo thường dùng để dùng ngay:
- Pipeline theo stage (giá trị & đếm)
- Tỷ lệ chuyển đổi theo nguồn lead
- Lý do thua deal
- Hoạt động theo nhân viên
- Doanh thu theo tháng/quý
- Deal sắp đóng (kỳ này)

## 9. Data model (chi tiết [09])
```ts
interface ReportDef {
  id; name; entity:'lead'|'deal'|'activity'|'quote';
  chartType:'bar'|'line'|'pie'|'table'|'kpi';
  dimension; measure; filters; ownerId; isShared; createdAt;
}
interface Goal {
  id; ownerId?; team?:boolean; period:'month'|'quarter'; periodKey:string;
  metric:'revenue'|'deals_won'; target:number;
}
interface DashboardLayout { userId; widgets: {type;refId?;w;h;x;y}[]; }
```

## 10. API (chi tiết [09])
```
POST /api/reports/run            (chạy ad-hoc theo cấu hình)
GET/POST/PUT/DELETE /api/reports (báo cáo đã lưu)
GET /api/reports/:id/export?format=
GET/POST /api/goals              GET /api/forecast?period=
GET /api/leaderboard?period=     GET/PUT /api/dashboard-layout
```

## 11. Component
`ReportBuilder`, `ReportChart` (wrap recharts đã có), `ReportFilters`, `DrilldownTable`,
`GoalCard`, `GoalProgress`, `ForecastChart`, `Leaderboard`, `DashboardGrid` (kéo-thả widget),
`ScheduledReportDialog`.

## 12. Acceptance criteria
- [ ] Tạo báo cáo tùy biến (đối tượng/nhóm/đo lường/lọc), lưu & ghim dashboard.
- [ ] Drill-down từ chart vào danh sách record.
- [ ] Đặt & theo dõi quota cá nhân/đội với thanh tiến độ + pace.
- [ ] Forecast hiển thị committed/best-case/pipeline.
- [ ] Export báo cáo chạy thật; có ≥6 báo cáo dựng sẵn.
- [ ] Dashboard widget cấu hình được theo từng user.
