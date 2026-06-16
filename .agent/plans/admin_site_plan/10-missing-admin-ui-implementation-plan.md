# 10 - Ke hoach trien khai 3 UI Admin con thieu

> Pham vi: `/admin/leads`, `/admin/audit`, `/admin/settings`.
> Muc tieu cua tai lieu nay la bien cac dac ta UX o [05](./05-ux-lead-distribution.md),
> [06](./06-ux-admin-dashboard-audit-settings.md) thanh checklist co the code truc tiep trong
> codebase hien tai.

## 1. Hien trang va nguyen tac trien khai

| Route | Hien trang | Ket qua can dat |
|---|---|---|
| `/admin/leads` | Chua co page/component | Trung tam chia lead gom 3 tab: gan thu cong, luat tu dong, pool |
| `/admin/audit` | Chua co page/component | Bang nhat ky co filter, expand chi tiet, phan trang, export CSV |
| `/admin/settings` | Chua co page/component | Man cau hinh gom Chung, Nguon lead, Tag, SLA va pool |

Rang buoc hien tai:

- Repository chua co `app/api` hay backend thuc. Ba trang phai chay duoc bang mock data.
- Khong goi cac endpoint chua ton tai truc tiep trong component UI.
- Tao mot lop data adapter trong `lib/admin/` de sau nay doi mock sang REST API ma khong sua layout.
- Dung TypeScript strict, Tailwind, Shadcn/Radix va Lucide; khong inline style.
- Giu locale `vi-VN`, tien te VND va giao dien dong bo voi `/admin` va `/admin/users`.
- Moi trang phai co loading, empty, error va success feedback.

## 2. Cau truc file du kien

```text
app/(dashboard)/admin/
|-- leads/page.tsx
|-- audit/page.tsx
`-- settings/page.tsx

components/admin/
|-- shared/
|   |-- admin-page-header.tsx
|   |-- admin-stat-card.tsx
|   `-- admin-empty-state.tsx
|-- leads/
|   |-- lead-distribution-tabs.tsx
|   |-- distribution-summary.tsx
|   |-- assignable-lead-table.tsx
|   |-- lead-assignment-filters.tsx
|   |-- lead-bulk-action-bar.tsx
|   |-- assign-lead-dialog.tsx
|   |-- employee-load-picker.tsx
|   |-- rule-list.tsx
|   |-- rule-form-dialog.tsx
|   |-- condition-editor.tsx
|   |-- action-editor.tsx
|   |-- rule-preview.tsx
|   |-- pool-config-panel.tsx
|   `-- pool-lead-table.tsx
|-- audit/
|   |-- audit-filters.tsx
|   |-- audit-table.tsx
|   |-- audit-row.tsx
|   |-- audit-detail-panel.tsx
|   `-- export-audit-button.tsx
`-- settings/
    |-- settings-nav.tsx
    |-- general-settings-form.tsx
    |-- lead-source-settings.tsx
    |-- tag-settings.tsx
    |-- tag-form-dialog.tsx
    |-- sla-settings-form.tsx
    `-- sortable-setting-list.tsx

lib/admin/
|-- admin-data.ts
|-- admin-mock-data.ts
`-- admin-validation.ts
```

Khong bat buoc tach tat ca file ngay tu dau. Chi tach component khi no co state rieng, duoc tai su
dung, hoac lam `page.tsx` qua dai. Tranh de mot page vuot qua khoang 250-300 dong.

## 3. Data contract cho frontend prototype

Bo sung cac view model con thieu vao `types/index.ts`:

```ts
export interface EmployeeLoad {
  userId: number;
  userName: string;
  activeLeadCount: number;
  openDealCount: number;
}

export interface DistributionSummary {
  unassignedCount: number;
  poolCount: number;
  activeRuleCount: number;
  assignedTodayCount: number;
}

export interface AdminGeneralSettings {
  systemName: string;
  timezone: string;
  defaultRole: UserRole;
  allowSelfRegistration: boolean;
  invitationTtlHours: number;
}

export interface AdminSlaSettings {
  unassignedAlertHours: number;
  reminderLeadTimeHours: number;
  dormantLeadDays: number;
  poolEnabled: boolean;
  poolClaimLimit: number;
}
```

`lib/admin/admin-data.ts` expose cac ham async de component khong phu thuoc nguon data:

```ts
getDistributionSummary()
getAssignableLeads(filters)
getEmployeeLoads()
assignLeads(input)
getDistributionRules()
saveDistributionRule(input)
reorderDistributionRules(ids)
getPoolLeads(filters)
updatePoolConfig(input)
getAuditLogs(filters)
exportAuditLogs(filters)
getAdminSettings()
updateAdminSettings(section, input)
```

Ban mock nen tra ve `Promise`, co delay ngan va copy data truoc khi tra ve. Mutation co the luu trong
module memory cho den khi refresh trang. Khong sua truc tiep `lib/mock-data.ts` neu data chi phuc vu admin.

## 4. UI 1 - Chia lead `/admin/leads`

### 4.1 Bo cuc trang

1. Header: tieu de `Chia lead`, mo ta ngan va nut `Lam moi`.
2. Bon KPI card: Chua gan, Trong pool, Luat dang bat, Gan hom nay.
3. Tabs co query string: `?tab=manual|rules|pool`; mac dinh `manual`.
4. Noi dung tab nam trong card lon, giu chieu cao on dinh khi chuyen tab.

### 4.2 Tab Gan thu cong

- Thanh filter: search, nguon, trang thai, chu hien tai, score; co nut xoa filter.
- Bang cot: checkbox, Lead, Cong ty, Nguon, Score, Chu hien tai, Tao luc.
- Select-all chi chon cac dong tren trang hien tai.
- Khi co selection, hien sticky bulk bar o day card: so lead da chon, `Gan cho`, `Ve pool`, `Bo chon`.
- `AssignLeadDialog` hien danh sach user active kem tai hien tai va danh dau nguoi it tai nhat.
- Submit co loading; thanh cong thi cap nhat table, KPI, xoa selection va hien toast/feedback.
- Neu mot lead da doi chu trong luc dialog mo, mock service tra conflict va UI giu dialog de admin thu lai.

### 4.3 Tab Luat tu dong

- Header tab co mo ta thu tu uu tien va nut `Tao luat`.
- Moi rule hien: drag handle, priority, ten, tom tat condition, strategy, targets, switch active, menu sua/xoa.
- Dung `@dnd-kit/sortable`; sau drop cap nhat priority va rollback neu save loi.
- Rule form gom ba khoi: thong tin, condition builder, action/targets.
- Condition row thay control theo field; ngan field/operator khong tuong thich.
- Preview debounce 300-500 ms, hien so lead khop va toi da 5 lead mau.
- Xoa rule can dialog xac nhan; toggle active khong can dialog nhung phai co feedback.

### 4.4 Tab Pool

- `PoolConfigPanel`: bat/tat tu nhan va gioi han lead dang mo tren moi user.
- Bang pool tai su dung filter va cot tu tab manual, bo cot chu hien tai.
- Admin co the chon nhieu lead de gan truc tiep.
- Khi pool tat, van hien lead dang trong pool nhung them banner canh bao va khoa hanh dong tu nhan.

### 4.5 Trang thai va responsive

- Loading: skeleton cho KPI va 6 dong table/rule.
- Empty manual: `Khong co lead phu hop bo loc`.
- Empty rules: CTA `Tao luat chia lead dau tien`.
- Empty pool: `Pool dang trong`.
- Tablet: filter wrap thanh hai dong, bulk bar full width.
- Mobile: KPI 2 cot; table chuyen thanh card list; rule builder full-screen dialog.

### 4.6 Tieu chi nghiem thu

- URL luu tab va filter co ban, refresh khong mat context.
- Gan mot/nhieu lead cap nhat dung owner va summary trong mock state.
- Reorder, toggle, create, edit, delete rule deu co UI state ro rang.
- Tat pool khong lam mat lead dang o pool.
- Co the thao tac tab va dialog bang ban phim.

## 5. UI 2 - Nhat ky `/admin/audit`

### 5.1 Bo cuc trang

1. Header: `Nhat ky hoat dong`, mo ta va nut `Xuat CSV`.
2. Filter card: search, user, action, entity type, tu ngay, den ngay.
3. Result summary: tong ban ghi va chip cac filter dang ap dung.
4. Bang audit server-style pagination.

### 5.2 Bang va chi tiet

- Cot desktop: Thoi gian, Nguoi thuc hien, Hanh dong, Doi tuong, Tom tat, Mo rong.
- Mapping action thanh label tieng Viet, icon va severity trong mot constant tap trung.
- Click dong hoac chevron mo `AuditDetailPanel` ngay ben duoi.
- Detail hien before/after theo hai cot, meta va IP; format JSON de doc, khong render `[object Object]`.
- System event co avatar/icon he thong va ten `He thong`, khong de trong.
- Audit la read-only; khong co menu sua/xoa.

### 5.3 Filter, URL va export

- Dong bo filter vao query string: `q`, `user`, `action`, `entity`, `from`, `to`, `page`.
- Doi filter reset `page=1`; search debounce 300 ms.
- Validate `from <= to`; neu sai, disable apply/export va hien loi inline.
- Export CSV dung dung tap ket qua theo filter hien tai, ten file:
  `audit-log-YYYY-MM-DD.csv`.
- CSV UTF-8 BOM de mo dung tieng Viet trong Excel; cot details duoc JSON stringify.

### 5.4 Trang thai va responsive

- Loading: skeleton table.
- Empty toan bo: `Chua co hoat dong nao duoc ghi`.
- Empty do filter: `Khong tim thay nhat ky phu hop` + nut xoa filter.
- Error: error state co `Thu lai`, khong xoa filter hien tai.
- Mobile: filter nam trong collapsible panel; moi log thanh card, detail mo ben duoi card.

### 5.5 Tieu chi nghiem thu

- Filter ket hop va pagination cho ket qua nhat quan.
- Refresh/back/forward khoi phuc dung filter tu URL.
- Before/after, IP, entity va system actor hien dung voi du lieu thieu mot phan.
- CSV chi gom du lieu khop filter va hien dung tieng Viet.
- Khong co bat ky hanh dong mutation nao tren trang audit.

## 6. UI 3 - Cau hinh `/admin/settings`

### 6.1 Bo cuc va dieu huong

- Mot route `/admin/settings`, khong can tao nested route trong dot UI dau.
- Section luu trong query `?section=general|lead-sources|tags|sla`; mac dinh `general`.
- Desktop: nav card ben trai 220-240 px, form card ben phai.
- Mobile: nav doi thanh tabs ngang cuon duoc.
- Moi section co state draft rieng va nut luu rieng, tranh submit nham toan trang.

### 6.2 Chung

Field: ten he thong, mui gio, role mac dinh, cho phep tu dang ky, thoi han loi moi.

- Validation: system name khong rong; invitation TTL la so nguyen 1-720.
- Hien helper text cho cac option co anh huong den auth.
- Save button disable khi pristine hoac invalid.

### 6.3 Nguon lead

- Sortable list gom drag handle, ten, trang thai active va menu sua/xoa.
- Them/sua inline hoac dialog nho; normalize khoang trang va ngan trung ten khong phan biet hoa thuong.
- Xoa can xac nhan voi thong bao: lead cu van giu gia tri, nguon chi bien mat khoi lua chon moi.
- Khong cho xoa muc cuoi cung dang active.

### 6.4 Tag

- Bang/tag list: preview dot, key, label, mau text, mau nen, sua/xoa.
- Form tag validate key duy nhat, label khong rong, mau dung hex.
- Preview badge cap nhat truc tiep khi chon mau.
- Neu tag dang duoc dung, xoa can confirm va mo ta tac dong; ban prototype chi xoa khoi catalog.

### 6.5 SLA va pool

Field: canh bao lead chua gan, reminder mac dinh, so ngay ngu dong, bat pool, gioi han pool.

- Tat `poolEnabled` thi disable `poolClaimLimit` nhung giu gia tri draft.
- Tat ca numeric field la so nguyen duong va co don vi ro rang (`gio`, `ngay`, `lead`).
- Them khoi preview ngan mo ta ket qua cau hinh bang ngon ngu tu nhien.

### 6.6 Unsaved changes va feedback

- Khi doi section ma form hien tai dirty, mo dialog `Bo thay doi?`.
- Khi browser reload/close voi draft dirty, dung `beforeunload`.
- Save thanh cong: cap nhat baseline, toast `Da luu cau hinh` va giu nguyen section.
- Save loi: giu draft, hien loi, cho phep thu lai.
- Khong dung mot nut `Luu tat ca` chung cho bon section.

### 6.7 Tieu chi nghiem thu

- Section hien tai duoc luu tren URL va khoi phuc sau refresh.
- Moi form chi luu khi dirty va valid.
- Add/edit/delete/reorder source va tag cap nhat mock state dung.
- Unsaved-change guard hoat dong khi chuyen section va reload.
- Cau hinh pool o Settings va tab Pool cua `/admin/leads` doc cung mot data source.

## 7. Thu tu thuc hien khuyen nghi

### Phase 1 - Nen tang dung chung

- [ ] Them view model vao `types/index.ts`.
- [ ] Tao `lib/admin/admin-mock-data.ts` va `lib/admin/admin-data.ts`.
- [ ] Tao page header, stat card va empty/error pattern dung chung neu can.
- [ ] Kiem tra nav `/admin/leads`, `/admin/audit`, `/admin/settings` tu `AdminSubnav`.

### Phase 2 - `/admin/leads`

- [ ] Dung page shell, KPI va tabs.
- [ ] Hoan thanh manual assignment end-to-end.
- [ ] Hoan thanh list/builder/reorder rule.
- [ ] Hoan thanh pool config va pool table.
- [ ] Them loading, empty, error, responsive va keyboard pass.

### Phase 3 - `/admin/audit`

- [ ] Dung filters + URL state.
- [ ] Dung table/card responsive va expandable detail.
- [ ] Them pagination va export CSV UTF-8 BOM.
- [ ] Kiem tra date validation, empty/error state.

### Phase 4 - `/admin/settings`

- [ ] Dung settings nav + section URL state.
- [ ] Hoan thanh General va SLA forms.
- [ ] Hoan thanh sortable Lead Sources.
- [ ] Hoan thanh Tag CRUD + preview.
- [ ] Them dirty-state guard va feedback.

### Phase 5 - Kiem tra tong the

- [ ] Chay `npx tsc --noEmit`.
- [ ] Chay `npm run build`.
- [ ] Test desktop, tablet va mobile cho ca ba route.
- [ ] Test AdminGuard: user thuong khong vao duoc ba route.
- [ ] Test query string bang refresh, back va forward.
- [ ] Dam bao khong co fetch den endpoint chua ton tai.

## 8. Definition of Done

- Ba route render day du, khong con 404 va khong phu thuoc backend.
- Luong chinh co the demo bang mock data: gan lead, sua rule/pool, loc/export audit, sua settings.
- UI dong bo voi design system hien tai va khong sua unrelated pages.
- Moi mutation co loading, success, error va confirmation neu la hanh dong pha huy.
- Type-check va production build thanh cong.
- Data layer co the thay bang API that ma khong phai viet lai component UI.

