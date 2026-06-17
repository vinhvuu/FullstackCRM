# U7 — Analytics: Report Builder, Quota/Goals, Forecast, Dashboard (Detailed Plan)

> **Giải quyết:** report tĩnh, export giả; không quota/goals; không forecast; dashboard cố định.
> Tham chiếu: `userdocs/08`. **Phụ thuộc:** dữ liệu từ U2–U5 (deal status/line items/quote, loss reason).

## 0. Mục tiêu & DoD
- **Report builder** tùy biến (đối tượng/nhóm/đo lường/lọc) + lưu + drill-down + ≥6 preset.
- **Quota/Goals** cá nhân & đội theo kỳ + thanh tiến độ + pace.
- **Forecast** committed/best-case/pipeline.
- **Dashboard widget** cấu hình (kéo-thả). Leaderboard [C].

## 1. Phạm vi file

### Tạo mới
```
app/(dashboard)/reports/builder/page.tsx
app/(dashboard)/goals/page.tsx
components/reports/report-builder.tsx
components/reports/report-chart.tsx          # wrap recharts (đã có lib)
components/reports/report-filters.tsx
components/reports/drilldown-table.tsx
components/reports/report-presets.tsx
components/goals/goal-card.tsx
components/goals/goal-progress.tsx
components/goals/goal-form-dialog.tsx
components/reports/forecast-chart.tsx
components/reports/leaderboard.tsx           # [C]
components/dashboard/dashboard-grid.tsx      # widget cấu hình
lib/analytics.ts                             # aggregate engine (dimension x measure)
lib/forecast.ts
```

### Sửa
```
types/index.ts                               # ReportDef, Goal, DashboardLayout, ForecastBucket
lib/mock-data.ts                             # goals[], reportDefs[], dashboardLayout
app/(dashboard)/reports/page.tsx             # thêm "Tạo báo cáo" + presets + export thật
app/(dashboard)/page.tsx                     # dùng DashboardGrid (widget) + quota + "việc hôm nay"
lib/constants.ts                             # DIMENSIONS, MEASURES theo entity
```

## 2. Data layer

### 2.1 Types
```ts
export type ReportEntity = "lead"|"deal"|"activity"|"quote";
export type ChartType = "bar"|"line"|"pie"|"table"|"kpi";
export interface ReportDef {
  id:string; name:string; entity:ReportEntity; chartType:ChartType;
  dimension:string; measure:string; filters:Record<string,unknown>;
  ownerId?:string; isShared:boolean; createdAt:string;
}
export interface Goal {
  id:string; ownerId?:string; isTeam:boolean;
  period:"month"|"quarter"; periodKey:string;   // "2026-Q2"
  metric:"revenue"|"deals_won"; target:number;
}
export interface ForecastBucket { category:"committed"|"best_case"|"pipeline"; value:number; }
export interface DashboardWidget { type:string; refId?:string; w:number; h:number; x:number; y:number; }
export interface DashboardLayout { userId:string; widgets:DashboardWidget[]; }
```

### 2.2 Aggregate engine (`lib/analytics.ts`)
```ts
// dimension: stage|source|owner|company|industry|month|quarter|tag|loss_reason
// measure: count|sum_value|weighted_value|conversion_rate|win_rate
export function runReport(def: ReportDef, data: {leads:Lead[];deals:Deal[];activities:Activity[];quotes:Quote[]}) {
  // 1) lọc theo def.filters
  // 2) nhóm theo def.dimension
  // 3) tính def.measure cho mỗi nhóm -> [{ name, value }]
}
export function drilldown(def: ReportDef, bucketName: string) { /* trả record của 1 cột/lát */ }
```

### 2.3 Forecast (`lib/forecast.ts`)
```ts
export function forecast(deals: Deal[], period: string): ForecastBucket[] {
  // committed: deal stage cao (negotiation+) đóng trong kỳ
  // best_case: + proposal
  // pipeline: tất cả deal mở weighted (value*probability)
}
export function goalProgress(goal: Goal, deals: Deal[]) {
  // actual theo metric; pace = actual / (target * elapsed/totalDays)
}
```

### 2.4 API (backend)
```
POST /api/reports/run            GET/POST/PUT/DELETE /api/reports
GET /api/reports/:id/export?format=csv
GET/POST /api/goals              GET /api/forecast?period=
GET /api/leaderboard?period=     GET/PUT /api/dashboard-layout
```

## 3. UX/UI (wireframe ở `userdocs/08`)
- Report builder §2 · Quota/Goals §3 · Forecast §4 · Dashboard widgets §6 · Presets §8.
- `ReportChart` tái dùng recharts đã có (Bar/Line/Pie) + chế độ bảng/pivot + KPI số.

## 4. Component skeleton

### 4.1 `ReportBuilder`
```tsx
"use client";
// trái: cấu hình (entity, chartType, dimension, measure, filters)
// phải: ReportChart(runReport(def, data)) cập nhật realtime
// click cột/lát -> DrilldownTable(drilldown(def, name))
// Lưu -> reportDefs; "Ghim dashboard" -> thêm widget
```

### 4.2 `GoalCard` + `GoalProgress`
```tsx
// hiển thị actual/target, %, thanh tiến độ, pace badge (trên/dưới đà), ngày còn lại
```

### 4.3 `DashboardGrid`
```tsx
// widget: kpi | saved-report | my-day(U3) | deals-attention(U2) | quota
// kéo-thả sắp xếp (@dnd-kit); lưu DashboardLayout theo user
```

## 5. Các bước thực thi
1. [ ] Types ReportDef/Goal/DashboardLayout/ForecastBucket; constants DIMENSIONS/MEASURES.
2. [ ] `lib/analytics.ts` (runReport + drilldown) + `lib/forecast.ts`.
3. [ ] `ReportChart` (wrap recharts, đủ bar/line/pie/table/kpi).
4. [ ] `reports/builder/page.tsx` = `ReportBuilder` + `ReportFilters` + `DrilldownTable`.
5. [ ] `report-presets` (≥6 báo cáo dựng sẵn) trên `reports/page.tsx`; export thật (dùng `lib/csv.ts` từ U6).
6. [ ] `goals/page.tsx` + `GoalCard`/`GoalProgress`/`GoalFormDialog`.
7. [ ] `ForecastChart` (committed/best-case/pipeline).
8. [ ] `DashboardGrid` + widget; thay dashboard `/` cố định; thêm quota + "việc hôm nay".
9. [ ] `Leaderboard` [C].
10. [ ] Empty/loading/error; responsive (chart full-width mobile).

## 6. Test & nghiệm thu
- [ ] Tạo báo cáo: đổi dimension/measure/filter → chart cập nhật đúng số.
- [ ] Drill-down từ cột/lát ra danh sách record khớp.
- [ ] Lưu báo cáo & ghim dashboard; export CSV chạy thật.
- [ ] Đặt quota cá nhân/đội; tiến độ + pace tính đúng theo thời gian còn lại.
- [ ] Forecast phân loại committed/best-case/pipeline hợp lý.
- [ ] Dashboard kéo-thả widget; lưu layout theo user.
- [ ] ≥6 preset hiển thị số liệu đúng (pipeline theo stage, conversion theo source, loss reason, hoạt động theo NV, doanh thu theo tháng, deal sắp đóng).

## 7. Rủi ro & giảm thiểu
- **Aggregate sai khi thiếu dữ liệu** (U2–U5 chưa xong) → engine chịu được field optional; gate U7 sau khi có deal status/line items.
- **Hiệu năng tính ở client** với nhiều record → giai đoạn backend tính bằng SQL GROUP BY + index.
- **Quyền dữ liệu**: user chỉ thấy báo cáo trên dữ liệu của mình; admin thấy toàn đội (theo `admindocs/02`).
- **pace gây hiểu nhầm** đầu kỳ (mẫu nhỏ) → ẩn/được chú thích khi elapsed < ngưỡng.
