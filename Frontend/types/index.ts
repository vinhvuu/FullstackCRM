export type RecordType = "lead" | "contact" | "deal" | "company";
export type TimelineItemType = "note" | "call" | "email" | "meeting" | "task" | "system";

export interface MentionUser { id: string; name: string; email?: string; }

export interface EmailTemplate {
  id: string; name: string; subject: string; body: string;
  ownerId?: string; isShared: boolean;
}

export interface EmailLog {
  id: string; relatedType: RecordType; relatedId: string;
  to: string; cc?: string; bcc?: string; subject: string; body: string;
  attachments?: string[]; direction: "out" | "in";
  status: "logged" | "sent" | "draft";
  sentBy: string; sentAt: string;
}

export interface CallLog {
  id: string; relatedType: RecordType; relatedId: string;
  direction: "out" | "in";
  outcome: "connected" | "no_answer" | "busy" | "voicemail" | "wrong_number";
  durationMin?: number; note?: string; loggedBy: string; createdAt: string;
}

export interface Attachment {
  id: string; relatedType: RecordType; relatedId: string;
  fileName: string; mimeType: string; sizeBytes: number; url: string;
  uploadedBy: string; createdAt: string;
}

export interface TimelineItem {
  id: string;
  type: TimelineItemType;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
  meta?: Record<string, unknown>;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  phone?: string;
  address?: string;
  taxCode?: string;
  description?: string;
  ownerId: string;
  createdAt: string;
  contactCount?: number;
  openDealCount?: number;
  openDealValue?: number;
}

export type LeadStatus = "new" | "contacted" | "qualified" | "lost";
export type DealStage = "lead" | "qualified" | "proposal" | "negotiation" | "won" | "lost";
export type ActivityType = "call" | "email" | "meeting" | "task";
export type ActivityStatus = "pending" | "completed" | "overdue";
export type ActivityPriority = "high" | "medium" | "low";
export type RecurrenceFreq = "daily" | "weekly" | "monthly";
export interface RecurrenceRule {
  freq: RecurrenceFreq;
  interval: number;
  until?: string;
}
export type InsightPriority = "high" | "medium" | "low";

export type ReminderStatus = "pending" | "completed" | "overdue" | "snoozed";

export interface LeadReminder {
  id: string;
  leadId: string;
  date: string;
  time: string;
  note: string;
  status: ReminderStatus;
  createdAt: string;
  completedAt?: string;
}

export type LeadTag = "vip" | "hot" | "long-term" | "new" | "follow-up" | "inactive" | string;

export interface TagConfig {
  id: LeadTag;
  label: string;
  color: string;
  bgColor: string;
}

export const TAG_CONFIGS: TagConfig[] = [
  { id: "vip", label: "VIP", color: "#8B5CF6", bgColor: "#EDE9FE" },
  { id: "hot", label: "Hot", color: "#EF4444", bgColor: "#FEE2E2" },
  { id: "long-term", label: "Long-term", color: "#3B82F6", bgColor: "#DBEAFE" },
  { id: "new", label: "New", color: "#10B981", bgColor: "#D1FAE5" },
  { id: "follow-up", label: "Follow-up", color: "#F59E0B", bgColor: "#FEF3C7" },
  { id: "inactive", label: "Inactive", color: "#6B7280", bgColor: "#F3F4F6" },
];

export type ViewMode = "table" | "kanban";

export interface LeadFilters {
  status: LeadStatus[];
  source: string[];
  dateFrom: string;
  dateTo: string;
  assignee: string | "all";
  scoreMin: number;
  scoreMax: number;
}

export type QuickFilter = "all" | "new" | "recent" | "highScore" | "myLeads";

export type SortField = "name" | "source" | "status" | "score" | "createdAt";
export type SortDirection = "asc" | "desc";

export interface Lead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  status: LeadStatus;
  score: number;
  createdAt: string;
  assignee: string;
  inPool?: boolean;
  order?: number;
  tags: LeadTag[];
  reminders: LeadReminder[];
}

export interface Contact {
  id: string;
  name: string;
  company: string;
  companyId?: string;
  email: string;
  phone: string;
  position: string;
  ownerId?: string;
  tags?: string[];
  createdAt?: string;
}

export type DealStatus = "open" | "won" | "lost";

export interface Deal {
  id: string;
  title: string;
  value: number;
  stage: DealStage;
  probability: number;
  contactId: string;
  createdAt: string;
  expectedCloseDate: string;
  pipelineId?: string;
  companyId?: string;
  ownerId?: string;
  status?: DealStatus;
  wonAt?: string;
  lostAt?: string;
  lossReason?: string;
  competitor?: string;
  stageEnteredAt?: string;
}

export interface DealLineItem {
  id: string;
  dealId: string;
  productId?: string;
  name: string;
  qty: number;
  unitPrice: number;
  discountPct: number;
  taxPct?: number;
  total: number;
}

export interface PipelineStage {
  id: string;
  label: string;
  color: string;
  probability: number;
}

export interface Pipeline {
  id: string;
  name: string;
  stages: PipelineStage[];
}

export interface LossReason {
  id: string;
  label: string;
}

export interface ConvertLeadData {
  leadId: string;
  dealTitle: string;
  dealValue: number;
  dealStage: DealStage;
  expectedCloseDate: string;
  createContact: boolean;
}

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  dealId?: string;
  contactId?: string;
  dueDate: string;
  status: ActivityStatus;
  priority?: ActivityPriority;
  remindAt?: string;
  relatedType?: RecordType;
  relatedId?: string;
  recurrence?: RecurrenceRule;
  ownerId?: string;
  completedAt?: string;
}

export interface AIInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: InsightPriority;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  sender: "seller" | "lead";
  text: string;
  timestamp: Date;
}

export interface LeadInteraction {
  id: string;
  type: "call" | "email" | "meeting" | "note";
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export interface DashboardStats {
  totalLeads: number;
  leadsGrowth: number;
  totalDeals: number;
  dealsGrowth: number;
  revenue: number;
  revenueGrowth: number;
  conversionRate: number;
  conversionGrowth: number;
}

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive' | 'invited' | 'deleted';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  leadCount?: number;
  openDealCount?: number;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

export interface Invitation {
  id: number;
  email: string;
  role: UserRole;
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  invitedBy: number;
  expiresAt: string;
  createdAt: string;
}

export type AssignMethod = 'manual' | 'rule' | 'claim' | 'round_robin';

export interface LeadAssignment {
  id: number;
  leadId: number;
  fromUserId?: number;
  toUserId: number;
  assignedBy?: number;
  method: AssignMethod;
  ruleId?: number;
  note?: string;
  createdAt: string;
}

export type RuleField = 'source' | 'score' | 'status' | 'company' | 'tag' | 'email_domain';
export type RuleOp = 'eq' | 'ne' | 'in' | 'not_in' | 'gte' | 'lte' | 'contains';
export type RuleStrategy = 'round_robin' | 'least_load' | 'first_available' | 'pool';

export interface RuleCondition {
  field: RuleField;
  op: RuleOp;
  value: string | number | string[];
}

export interface RuleAction {
  type: 'assign';
  targets: number[];
  strategy: RuleStrategy;
}

export interface DistributionRule {
  id: number;
  name: string;
  priority: number;
  isActive: boolean;
  conditions: RuleCondition[];
  action: RuleAction;
  createdBy: number;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  userId: number;
  userName?: string;
  action: string;
  entityType: string;
  entityId?: number;
  details?: { before?: unknown; after?: unknown; meta?: unknown };
  ipAddress?: string;
  createdAt: string;
}

export interface SystemSetting {
  key: string;
  value: string;
  updatedBy?: number;
  updatedAt: string;
}

export interface PoolConfig {
  enabled: boolean;
  claimLimit: number;
}

export interface AdminStats {
  activeUsers: number;
  totalLeads: number;
  unassignedLeads: number;
  revenue: number;
  leadsByUser: { userId: number; name: string; count: number; pct: number }[];
  recentAudit: AuditLog[];
}

export interface EmployeePerformance {
  userId: number;
  userName: string;
  leadCount: number;
  dealCount: number;
  winRate: number;
}

export interface Alert {
  id: string;
  type: 'unassigned_lead' | 'inactive_user' | 'high_score_in_pool';
  message: string;
  severity: 'warning' | 'error';
  entityId?: number;
  createdAt: string;
}

export interface EmailLog {
  id: string;
  relatedType: RecordType;
  relatedId: string;
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  body: string;
  attachments?: string[];
  direction: "out" | "in";
  status: "logged" | "sent" | "draft";
  sentBy: string;
  sentAt: string;
}

export interface CallLog {
  id: string;
  relatedType: RecordType;
  relatedId: string;
  direction: "out" | "in";
  outcome: "connected" | "no_answer" | "busy" | "voicemail" | "wrong_number";
  durationMin?: number;
  note?: string;
  loggedBy: string;
  createdAt: string;
}

export interface Note {
  id: string;
  relatedType: RecordType;
  relatedId: string;
  body: string;
  mentions: string[];
  createdBy: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  relatedType: RecordType;
  relatedId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  url: string;
  uploadedBy: string;
  createdAt: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  ownerId?: string;
  isShared: boolean;
}

export interface Product {
  id: string;
  code?: string;
  name: string;
  group?: string;
  unitPrice: number;
  currency: "VND" | "USD";
  unit?: string;
  defaultTaxPct?: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "expired";

export interface QuoteLineItem {
  id: string;
  quoteId: string;
  productId?: string;
  name: string;
  qty: number;
  unitPrice: number;
  discountPct: number;
  taxPct: number;
  total: number;
}

export interface Quote {
  id: string;
  number: string;
  title: string;
  dealId?: string;
  companyId?: string;
  contactId?: string;
  status: QuoteStatus;
  validUntil?: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  currency: "VND" | "USD";
  terms?: string;
  ownerId?: string;
  createdAt: string;
  sentAt?: string;
  decidedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: "mention" | "assignment" | "reminder" | "deal_stage" | "quote_accepted" | "system";
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface SavedView {
  id: string;
  userId: string;
  entity: RecordType;
  name: string;
  filters: Record<string, unknown>;
  columns: string[];
  sort?: string;
  isShared: boolean;
}

export type CustomFieldType = "text" | "number" | "date" | "select" | "checkbox";

export interface CustomFieldDef {
  id: string;
  entity: RecordType;
  key: string;
  label: string;
  type: CustomFieldType;
  options?: string[];
  required: boolean;
  order: number;
}

export interface CustomFieldValue {
  entity: RecordType;
  recordId: string;
  fieldKey: string;
  value: string;
}

export interface SearchResult {
  type: RecordType | "action";
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

export interface UserPrefs {
  language: "vi" | "en";
  timezone: string;
  density: "compact" | "comfortable";
  emailSignature?: string;
  notify: Record<string, boolean>;
}

// ── U7 Analytics ──────────────────────────────────────────────────────────────

export type ReportEntity = "lead" | "deal" | "activity" | "quote";
export type ChartType = "bar" | "line" | "pie" | "table" | "kpi";

export interface ReportDef {
  id: string;
  name: string;
  entity: ReportEntity;
  chartType: ChartType;
  dimension: string;
  measure: string;
  filters: Record<string, unknown>;
  ownerId?: string;
  isShared: boolean;
  createdAt: string;
}

export interface Goal {
  id: string;
  ownerId?: string;
  isTeam: boolean;
  period: "month" | "quarter";
  periodKey: string; // e.g. "2026-Q2" or "2026-06"
  metric: "revenue" | "deals_won";
  target: number;
}

export interface ForecastBucket {
  category: "committed" | "best_case" | "pipeline";
  value: number;
}

export interface DashboardWidget {
  id: string;
  type: "kpi" | "saved-report" | "quota" | "my-day" | "forecast";
  refId?: string;
  w: number;
  h: number;
  x: number;
  y: number;
  title?: string;
}

export interface DashboardLayout {
  userId: string;
  widgets: DashboardWidget[];
}

export interface EmployeeLoad {
  userId: number;
  userName: string;
  avatarUrl?: string;
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

export interface LeadSource {
  id: string;
  name: string;
  isActive: boolean;
  order: number;
}

export interface AuditFilterParams {
  q?: string;
  userId?: number;
  action?: string;
  entityType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface SettingsSection {
  id: string;
  label: string;
}
