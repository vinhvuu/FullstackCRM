import {
  Lead,
  User,
  DistributionRule,
  AuditLog,
  LeadSource,
  TagConfig,
  AdminGeneralSettings,
  AdminSlaSettings,
  EmployeeLoad,
  DistributionSummary,
  PoolConfig,
} from "@/types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockUsers: User[] = [
  { id: 1, name: "Admin User", email: "admin@vanhcorp.vn", role: "admin", status: "active", createdAt: "2026-01-01" },
  { id: 2, name: "Hoàng An", email: "hoangan@vanhcorp.vn", role: "user", status: "active", createdAt: "2026-01-15", leadCount: 12, openDealCount: 3 },
  { id: 3, name: "Trần Minh", email: "tranminh@vanhcorp.vn", role: "user", status: "active", createdAt: "2026-02-01", leadCount: 8, openDealCount: 2 },
  { id: 4, name: "Lê Thị Mai", email: "lethimai@vanhcorp.vn", role: "user", status: "active", createdAt: "2026-02-10", leadCount: 15, openDealCount: 4 },
  { id: 5, name: "Phạm Hùng", email: "phamhung@vanhcorp.vn", role: "user", status: "inactive", createdAt: "2026-02-20", leadCount: 0, openDealCount: 0 },
];

export const mockLeads: Lead[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    company: "Công ty ABC",
    email: "minh.nv@abc.vn",
    phone: "0901234567",
    source: "Website",
    status: "new",
    score: 85,
    createdAt: "2026-06-01",
    assignee: "",
    tags: ["hot"],
    reminders: [],
  },
  {
    id: "2",
    name: "Trần Thị Lan",
    company: "XYZ Corporation",
    email: "lan.tt@xyz.vn",
    phone: "0902345678",
    source: "LinkedIn",
    status: "contacted",
    score: 72,
    createdAt: "2026-06-05",
    assignee: "",
    tags: [],
    reminders: [],
  },
  {
    id: "3",
    name: "Lê Văn Hùng",
    company: "Tech Solutions",
    email: "hung.lv@tech.vn",
    phone: "0903456789",
    source: "Referral",
    status: "qualified",
    score: 90,
    createdAt: "2026-06-08",
    assignee: "Hoàng An",
    tags: ["vip"],
    reminders: [],
  },
  {
    id: "4",
    name: "Phạm Thị Hương",
    company: "Global Trading",
    email: "huong.pt@global.vn",
    phone: "0904567890",
    source: "Website",
    status: "new",
    score: 65,
    createdAt: "2026-06-10",
    assignee: "",
    tags: [],
    reminders: [],
  },
  {
    id: "5",
    name: "Vũ Ngọc Anh",
    company: "FPT Corporation",
    email: "anh.vn@fpt.vn",
    phone: "0905678901",
    source: "Facebook",
    status: "contacted",
    score: 78,
    createdAt: "2026-06-11",
    assignee: "Trần Minh",
    tags: ["follow-up"],
    reminders: [],
  },
  {
    id: "6",
    name: "Đỗ Minh Quân",
    company: "Viettel",
    email: "quan.dm@viettel.vn",
    phone: "0906789012",
    source: "LinkedIn",
    status: "new",
    score: 55,
    createdAt: "2026-06-12",
    assignee: "",
    tags: [],
    reminders: [],
  },
  {
    id: "7",
    name: "Ngô Thị Thu",
    company: "Mobifone",
    email: "thu.nt@mobifone.vn",
    phone: "0907890123",
    source: "Website",
    status: "qualified",
    score: 88,
    createdAt: "2026-06-13",
    assignee: "Lê Thị Mai",
    tags: ["vip", "hot"],
    reminders: [],
  },
  {
    id: "8",
    name: "Bùi Văn Tùng",
    company: "VNPT",
    email: "tung.bv@vnpt.vn",
    phone: "0908901234",
    source: "Referral",
    status: "new",
    score: 45,
    createdAt: "2026-06-14",
    assignee: "",
    tags: ["long-term"],
    reminders: [],
  },
];

let leadData = [...mockLeads];

function getUnassignedLeads() {
  return leadData.filter((l) => !l.assignee && l.status !== "lost");
}

function getPoolLeadsFromData() {
  return leadData.filter((l) => l.inPool && l.status !== "lost");
}

export const mockDistributionRules: DistributionRule[] = [
  {
    id: 1,
    name: "Lead VIP tự động gán cho Mai",
    priority: 1,
    isActive: true,
    conditions: [{ field: "score", op: "gte", value: 80 }],
    action: { type: "assign", targets: [4], strategy: "least_load" },
    createdBy: 1,
    createdAt: "2026-06-01",
  },
  {
    id: 2,
    name: "Lead từ Website gán轮循",
    priority: 2,
    isActive: true,
    conditions: [{ field: "source", op: "eq", value: "Website" }],
    action: { type: "assign", targets: [2, 3, 4], strategy: "round_robin" },
    createdBy: 1,
    createdAt: "2026-06-02",
  },
  {
    id: 3,
    name: "Lead referral cho Hoàng An",
    priority: 3,
    isActive: false,
    conditions: [{ field: "source", op: "eq", value: "Referral" }],
    action: { type: "assign", targets: [2], strategy: "first_available" },
    createdBy: 1,
    createdAt: "2026-06-03",
  },
];

let rulesData = [...mockDistributionRules];

export const mockAuditLogs: AuditLog[] = [
  {
    id: 1,
    userId: 1,
    userName: "Admin User",
    action: "create",
    entityType: "lead",
    entityId: 1,
    details: { after: { name: "Nguyễn Văn Minh", source: "Website" } },
    ipAddress: "192.168.1.100",
    createdAt: "2026-06-01T10:00:00Z",
  },
  {
    id: 2,
    userId: 2,
    userName: "Hoàng An",
    action: "assign",
    entityType: "lead",
    entityId: 3,
    details: { before: { assignee: null }, after: { assignee: "Hoàng An" } },
    ipAddress: "192.168.1.101",
    createdAt: "2026-06-08T14:30:00Z",
  },
  {
    id: 3,
    userId: 1,
    userName: "Admin User",
    action: "update",
    entityType: "user",
    entityId: 4,
    details: { before: { role: "user" }, after: { role: "user", name: "Lê Thị Mai" } },
    ipAddress: "192.168.1.100",
    createdAt: "2026-06-10T09:00:00Z",
  },
  {
    id: 4,
    userId: 1,
    userName: "Admin User",
    action: "create",
    entityType: "distribution_rule",
    entityId: 1,
    details: { after: { name: "Lead VIP tự động gán cho Mai" } },
    ipAddress: "192.168.1.100",
    createdAt: "2026-06-01T10:05:00Z",
  },
  {
    id: 5,
    userId: 3,
    userName: "Trần Minh",
    action: "convert",
    entityType: "lead",
    entityId: 5,
    details: { after: { dealId: "d1", dealTitle: "Lead #5 conversion" } },
    ipAddress: "192.168.1.102",
    createdAt: "2026-06-12T16:00:00Z",
  },
  {
    id: 6,
    userId: 0,
    userName: "Hệ thống",
    action: "auto_assign",
    entityType: "lead",
    entityId: 7,
    details: { after: { assignee: "Lê Thị Mai", ruleId: 1 } },
    createdAt: "2026-06-13T08:00:00Z",
  },
  {
    id: 7,
    userId: 1,
    userName: "Admin User",
    action: "delete",
    entityType: "tag",
    entityId: 99,
    details: { before: { label: "Old Tag" } },
    ipAddress: "192.168.1.100",
    createdAt: "2026-06-14T11:00:00Z",
  },
  {
    id: 8,
    userId: 2,
    userName: "Hoàng An",
    action: "update",
    entityType: "lead",
    entityId: 3,
    details: { before: { status: "contacted" }, after: { status: "qualified" } },
    ipAddress: "192.168.1.101",
    createdAt: "2026-06-09T15:45:00Z",
  },
];

export const mockLeadSources: LeadSource[] = [
  { id: "website", name: "Website", isActive: true, order: 1 },
  { id: "linkedin", name: "LinkedIn", isActive: true, order: 2 },
  { id: "facebook", name: "Facebook", isActive: true, order: 3 },
  { id: "referral", name: "Referral", isActive: true, order: 4 },
  { id: "zalo", name: "Zalo", isActive: false, order: 5 },
  { id: "ads", name: "Quảng cáo", isActive: true, order: 6 },
];

let sourcesData = [...mockLeadSources];

export const mockTagConfigs: TagConfig[] = [
  { id: "vip", label: "VIP", color: "#8B5CF6", bgColor: "#EDE9FE" },
  { id: "hot", label: "Hot", color: "#EF4444", bgColor: "#FEE2E2" },
  { id: "long-term", label: "Long-term", color: "#3B82F6", bgColor: "#DBEAFE" },
  { id: "new", label: "New", color: "#10B981", bgColor: "#D1FAE5" },
  { id: "follow-up", label: "Follow-up", color: "#F59E0B", bgColor: "#FEF3C7" },
  { id: "inactive", label: "Inactive", color: "#6B7280", bgColor: "#F3F4F6" },
];

let tagsData = [...mockTagConfigs];

export const mockGeneralSettings: AdminGeneralSettings = {
  systemName: "VanhCorp CRM",
  timezone: "Asia/Ho_Chi_Minh",
  defaultRole: "user",
  allowSelfRegistration: false,
  invitationTtlHours: 72,
};

export const mockSlaSettings: AdminSlaSettings = {
  unassignedAlertHours: 24,
  reminderLeadTimeHours: 48,
  dormantLeadDays: 7,
  poolEnabled: true,
  poolClaimLimit: 5,
};

let generalSettingsData = { ...mockGeneralSettings };
let slaSettingsData = { ...mockSlaSettings };

let poolConfigData: PoolConfig = { enabled: true, claimLimit: 5 };

export async function getDistributionSummary(): Promise<DistributionSummary> {
  await delay(200);
  const unassignedCount = leadData.filter((l) => !l.assignee && l.status !== "lost").length;
  const poolCount = getPoolLeadsFromData().length;
  const activeRuleCount = rulesData.filter((r) => r.isActive).length;
  const today = new Date().toISOString().split("T")[0];
  const assignedTodayCount = leadData.filter((l) => l.createdAt === today && l.assignee).length;

  return {
    unassignedCount,
    poolCount,
    activeRuleCount,
    assignedTodayCount,
  };
}

export async function getEmployeeLoads(): Promise<EmployeeLoad[]> {
  await delay(150);
  return mockUsers
    .filter((u) => u.status === "active" && u.role === "user")
    .map((u) => ({
      userId: u.id,
      userName: u.name,
      avatarUrl: u.avatarUrl,
      activeLeadCount: leadData.filter((l) => l.assignee === u.name && l.status !== "lost").length,
      openDealCount: u.openDealCount || 0,
    }));
}

export interface LeadFilters {
  search?: string;
  source?: string;
  status?: string;
  assignee?: string;
  scoreMin?: number;
  scoreMax?: number;
}

export async function getAssignableLeads(filters: LeadFilters): Promise<Lead[]> {
  await delay(200);
  let result = getUnassignedLeads().filter((l) => !l.inPool);

  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term) ||
        l.email.toLowerCase().includes(term)
    );
  }
  if (filters.source && filters.source !== "all") {
    result = result.filter((l) => l.source === filters.source);
  }
  if (filters.status && filters.status !== "all") {
    result = result.filter((l) => l.status === filters.status);
  }
  if (filters.scoreMin) {
    result = result.filter((l) => l.score >= filters.scoreMin!);
  }
  if (filters.scoreMax) {
    result = result.filter((l) => l.score <= filters.scoreMax!);
  }

  return result;
}

export async function assignLeads(leadIds: string[], userId: number, userName: string): Promise<{ success: boolean; error?: string }> {
  await delay(300);
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) {
    return { success: false, error: "User not found" };
  }

  for (const id of leadIds) {
    const lead = leadData.find((l) => l.id === id);
    if (lead && !lead.assignee) {
      lead.assignee = userName;
      lead.inPool = false;
    }
  }
  return { success: true };
}

export async function moveToPool(leadIds: string[]): Promise<{ success: boolean }> {
  await delay(200);
  for (const id of leadIds) {
    const lead = leadData.find((l) => l.id === id);
    if (lead) {
      lead.assignee = "";
      lead.inPool = true;
    }
  }
  return { success: true };
}

export async function removeFromPool(leadIds: string[]): Promise<{ success: boolean }> {
  await delay(200);
  for (const id of leadIds) {
    const lead = leadData.find((l) => l.id === id);
    if (lead) {
      lead.inPool = false;
    }
  }
  return { success: true };
}

export async function getDistributionRules(): Promise<DistributionRule[]> {
  await delay(150);
  return [...rulesData].sort((a, b) => a.priority - b.priority);
}

function matchCondition(lead: Lead, condition: { field: string; op: string; value: string | number | string[] }): boolean {
  const leadValue = (lead as Record<string, unknown>)[condition.field];
  
  switch (condition.op) {
    case "eq":
      return leadValue === condition.value;
    case "ne":
      return leadValue !== condition.value;
    case "in":
      return Array.isArray(condition.value) && condition.value.includes(String(leadValue));
    case "not_in":
      return Array.isArray(condition.value) && !condition.value.includes(String(leadValue));
    case "gte":
      return typeof leadValue === "number" && typeof condition.value === "number" && leadValue >= condition.value;
    case "lte":
      return typeof leadValue === "number" && typeof condition.value === "number" && leadValue <= condition.value;
    case "contains":
      return typeof leadValue === "string" && typeof condition.value === "string" && leadValue.includes(condition.value);
    default:
      return false;
  }
}

function matchAllConditions(lead: Lead, conditions: { field: string; op: string; value: string | number | string[] }[]): boolean {
  return conditions.every((c) => matchCondition(lead, c));
}

function getEmployeeLoadCount(userName: string): number {
  return leadData.filter((l) => l.assignee === userName && l.status !== "lost").length;
}

function pickAssignee(targets: number[], strategy: string): number | null {
  if (targets.length === 0) return null;
  
  if (strategy === "least_load") {
    let minLoad = Infinity;
    let chosen = targets[0];
    for (const userId of targets) {
      const user = mockUsers.find((u) => u.id === userId);
      if (user) {
        const load = getEmployeeLoadCount(user.name);
        if (load < minLoad) {
          minLoad = load;
          chosen = userId;
        }
      }
    }
    return chosen;
  }
  
  if (strategy === "round_robin") {
    const sorted = [...targets].sort((a, b) => {
      const userA = mockUsers.find((u) => u.id === a);
      const userB = mockUsers.find((u) => u.id === b);
      return getEmployeeLoadCount(userA?.name || "") - getEmployeeLoadCount(userB?.name || "");
    });
    return sorted[0];
  }
  
  return targets[0];
}

export async function applyDistributionRules(): Promise<{
  success: boolean;
  assignedCount: number;
  details: { leadId: string; leadName: string; userName: string; ruleName: string }[];
}> {
  await delay(400);
  const details: { leadId: string; leadName: string; userName: string; ruleName: string }[] = [];
  const sortedRules = [...rulesData].filter((r) => r.isActive).sort((a, b) => a.priority - b.priority);
  const poolLeads = getPoolLeadsFromData();

  for (const lead of poolLeads) {
    for (const rule of sortedRules) {
      if (matchAllConditions(lead, rule.conditions)) {
        const userId = pickAssignee(rule.action.targets, rule.action.strategy);
        if (userId) {
          const user = mockUsers.find((u) => u.id === userId);
          if (user) {
            lead.assignee = user.name;
            lead.inPool = false;
            details.push({
              leadId: lead.id,
              leadName: lead.name,
              userName: user.name,
              ruleName: rule.name,
            });
            break;
          }
        }
      }
    }
  }

  return {
    success: true,
    assignedCount: details.length,
    details,
  };
}

export async function saveDistributionRule(rule: Partial<DistributionRule> & { id?: number }): Promise<DistributionRule> {
  await delay(300);
  if (rule.id) {
    const idx = rulesData.findIndex((r) => r.id === rule.id);
    if (idx !== -1) {
      rulesData[idx] = { ...rulesData[idx], ...rule };
      return rulesData[idx];
    }
  }
  const newRule: DistributionRule = {
    id: Math.max(...rulesData.map((r) => r.id)) + 1,
    name: rule.name || "New Rule",
    priority: rule.priority || rulesData.length + 1,
    isActive: rule.isActive ?? true,
    conditions: rule.conditions || [],
    action: rule.action || { type: "assign", targets: [], strategy: "round_robin" },
    createdBy: 1,
    createdAt: new Date().toISOString(),
  };
  rulesData.push(newRule);
  return newRule;
}

export async function deleteDistributionRule(id: number): Promise<{ success: boolean }> {
  await delay(200);
  rulesData = rulesData.filter((r) => r.id !== id);
  return { success: true };
}

export async function toggleDistributionRule(id: number): Promise<DistributionRule> {
  await delay(150);
  const rule = rulesData.find((r) => r.id === id);
  if (rule) {
    rule.isActive = !rule.isActive;
  }
  return rule!;
}

export async function reorderDistributionRules(ids: number[]): Promise<DistributionRule[]> {
  await delay(200);
  rulesData = rulesData.map((r) => ({
    ...r,
    priority: ids.indexOf(r.id) + 1,
  }));
  return [...rulesData].sort((a, b) => a.priority - b.priority);
}

export async function getPoolLeads(filters: LeadFilters): Promise<Lead[]> {
  await delay(200);
  let result = getPoolLeadsFromData().filter((l) => l.status !== "lost");

  if (filters.search) {
    const term = filters.search.toLowerCase();
    result = result.filter(
      (l) =>
        l.name.toLowerCase().includes(term) ||
        l.company.toLowerCase().includes(term)
    );
  }
  if (filters.source && filters.source !== "all") {
    result = result.filter((l) => l.source === filters.source);
  }
  if (filters.status && filters.status !== "all") {
    result = result.filter((l) => l.status === filters.status);
  }

  return result;
}

export async function getPoolConfig(): Promise<PoolConfig> {
  await delay(100);
  return { ...poolConfigData };
}

export async function updatePoolConfig(config: Partial<PoolConfig>): Promise<PoolConfig> {
  await delay(200);
  poolConfigData = { ...poolConfigData, ...config };
  return { ...poolConfigData };
}

export interface AuditFilters {
  q?: string;
  userId?: number;
  action?: string;
  entityType?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export async function getAuditLogs(filters: AuditFilters = {}): Promise<{
  data: AuditLog[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  await delay(200);
  let result = [...mockAuditLogs];

  if (filters.q) {
    const term = filters.q.toLowerCase();
    result = result.filter(
      (log) =>
        log.userName?.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term) ||
        log.entityType.toLowerCase().includes(term)
    );
  }
  if (filters.userId) {
    result = result.filter((log) => log.userId === filters.userId);
  }
  if (filters.action) {
    result = result.filter((log) => log.action === filters.action);
  }
  if (filters.entityType) {
    result = result.filter((log) => log.entityType === filters.entityType);
  }
  if (filters.from) {
    result = result.filter((log) => log.createdAt >= filters.from!);
  }
  if (filters.to) {
    result = result.filter((log) => log.createdAt <= filters.to!);
  }

  const page = filters.page || 1;
  const limit = filters.limit || 10;
  const total = result.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const data = result.slice(start, start + limit);

  return { data, total, page, limit, totalPages };
}

export async function exportAuditLogs(filters: AuditFilters = {}): Promise<string> {
  await delay(300);
  const { data } = await getAuditLogs({ ...filters, limit: 1000 });
  const headers = ["Thời gian", "Người thực hiện", "Hành động", "Đối tượng", "Chi tiết", "IP"];
  const rows = data.map((log) => [
    new Date(log.createdAt).toLocaleString("vi-VN"),
    log.userName,
    log.action,
    log.entityType,
    JSON.stringify(log.details),
    log.ipAddress || "",
  ]);

  const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n");
  return "\uFEFF" + csv;
}

export async function getAdminGeneralSettings(): Promise<AdminGeneralSettings> {
  await delay(100);
  return { ...generalSettingsData };
}

export async function updateAdminGeneralSettings(settings: Partial<AdminGeneralSettings>): Promise<AdminGeneralSettings> {
  await delay(200);
  generalSettingsData = { ...generalSettingsData, ...settings };
  return { ...generalSettingsData };
}

export async function getAdminSlaSettings(): Promise<AdminSlaSettings> {
  await delay(100);
  return { ...slaSettingsData };
}

export async function updateAdminSlaSettings(settings: Partial<AdminSlaSettings>): Promise<AdminSlaSettings> {
  await delay(200);
  slaSettingsData = { ...slaSettingsData, ...settings };
  return { ...slaSettingsData };
}

export async function getLeadSources(): Promise<LeadSource[]> {
  await delay(100);
  return [...sourcesData].sort((a, b) => a.order - b.order);
}

export async function saveLeadSource(source: Partial<LeadSource> & { id: string }): Promise<LeadSource> {
  await delay(200);
  const idx = sourcesData.findIndex((s) => s.id === source.id);
  if (idx !== -1) {
    sourcesData[idx] = { ...sourcesData[idx], ...source };
    return sourcesData[idx];
  }
  const newSource: LeadSource = {
    id: source.id,
    name: source.name,
    isActive: source.isActive ?? true,
    order: source.order || sourcesData.length + 1,
  };
  sourcesData.push(newSource);
  return newSource;
}

export async function deleteLeadSource(id: string): Promise<{ success: boolean }> {
  await delay(200);
  sourcesData = sourcesData.filter((s) => s.id !== id);
  return { success: true };
}

export async function reorderLeadSources(ids: string[]): Promise<LeadSource[]> {
  await delay(200);
  sourcesData = sourcesData.map((s) => ({
    ...s,
    order: ids.indexOf(s.id) + 1,
  }));
  return [...sourcesData].sort((a, b) => a.order - b.order);
}

export async function getTagConfigs(): Promise<TagConfig[]> {
  await delay(100);
  return [...tagsData];
}

export async function saveTagConfig(tag: Partial<TagConfig> & { id: string }): Promise<TagConfig> {
  await delay(200);
  const idx = tagsData.findIndex((t) => t.id === tag.id);
  if (idx !== -1) {
    tagsData[idx] = { ...tagsData[idx], ...tag };
    return tagsData[idx];
  }
  const newTag: TagConfig = {
    id: tag.id,
    label: tag.label || tag.id,
    color: tag.color || "#6B7280",
    bgColor: tag.bgColor || "#F3F4F6",
  };
  tagsData.push(newTag);
  return newTag;
}

export async function deleteTagConfig(id: string): Promise<{ success: boolean }> {
  await delay(200);
  tagsData = tagsData.filter((t) => t.id !== id);
  return { success: true };
}

export function getActiveUsers(): User[] {
  return mockUsers.filter((u) => u.status === "active");
}

export async function getLeadsByAssignee(assigneeName: string): Promise<Lead[]> {
  await delay(200);
  if (!assigneeName) return [];
  return leadData.filter((l) => l.assignee === assigneeName && l.status !== "lost");
}

export async function getLeadsByUserId(userId: number): Promise<Lead[]> {
  await delay(200);
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return [];
  return leadData.filter((l) => l.assignee === user.name && l.status !== "lost");
}