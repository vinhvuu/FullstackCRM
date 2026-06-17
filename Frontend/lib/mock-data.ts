import { Lead, Contact, Deal, Activity, AIInsight, DashboardStats, ConvertLeadData, Company, TimelineItem, RecordType, Product, Quote, QuoteLineItem, ReportDef, Goal, DashboardLayout } from "@/types";

export const companies: Company[] = [
  {
    id: "c1",
    name: "Công ty ABC",
    website: "abc.vn",
    industry: "Công nghệ",
    size: "51-200",
    phone: "02812345678",
    address: "Q1, TP.HCM",
    ownerId: "u2",
    createdAt: "2026-02-10",
    description: "Khách hàng tiềm năng mảng ERP",
  },
  {
    id: "c2",
    name: "XYZ Corporation",
    website: "xyz.vn",
    industry: "Tài chính",
    size: "201-500",
    phone: "02898765432",
    address: "Q3, TP.HCM",
    ownerId: "u1",
    createdAt: "2026-01-15",
    description: "Tập đoàn tài chính lớn",
  },
  {
    id: "c3",
    name: "Tech Solutions",
    website: "techsolutions.vn",
    industry: "Công nghệ",
    size: "11-50",
    phone: "02811112222",
    address: "Cầu Giấy, Hà Nội",
    ownerId: "u1",
    createdAt: "2026-02-20",
    description: "Công ty tư vấn & triển khai giải pháp công nghệ",
  },
  {
    id: "c4",
    name: "Global Trading",
    website: "globaltrading.vn",
    industry: "Thương mại",
    size: "51-200",
    phone: "02833334444",
    address: "Q7, TP.HCM",
    ownerId: "u2",
    createdAt: "2026-03-01",
    description: "Công ty xuất nhập khẩu",
  },
];

export function getCompanyStats(companyId: string) {
  const cs = contacts.filter((c) => c.companyId === companyId);
  const ds = deals.filter((d) => (d as any).companyId === companyId);
  const openDealValue = ds.reduce((sum, d) => sum + d.value, 0);
  return { contactCount: cs.length, openDealCount: ds.length, openDealValue };
}

export const dashboardStats: DashboardStats = {
  totalLeads: 156,
  leadsGrowth: 12.5,
  totalDeals: 42,
  dealsGrowth: 8.2,
  revenue: 2850000000,
  revenueGrowth: 23.1,
  conversionRate: 32,
  conversionGrowth: 5.4,
};

export const recentDeals: Deal[] = [
  {
    id: "1",
    title: "Công ty ABC - Enterprise License",
    value: 450000000,
    stage: "negotiation",
    probability: 75,
    contactId: "1",
    createdAt: "2026-03-15",
    expectedCloseDate: "2026-04-15",
  },
  {
    id: "2",
    title: "XYZ Corp - AI Platform Setup",
    value: 280000000,
    stage: "proposal",
    probability: 60,
    contactId: "2",
    createdAt: "2026-03-10",
    expectedCloseDate: "2026-04-20",
  },
  {
    id: "3",
    title: "Tech Solutions - Cloud Migration",
    value: 180000000,
    stage: "qualified",
    probability: 40,
    contactId: "3",
    createdAt: "2026-03-08",
    expectedCloseDate: "2026-05-01",
  },
];

export const leads: Lead[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    company: "Công ty ABC",
    email: "minh.nv@abc.vn",
    phone: "0901234567",
    source: "Website",
    status: "qualified",
    score: 85,
    createdAt: "2026-03-01",
    assignee: "Hoàng An",
    order: 0,
    tags: ["vip", "hot"],
    reminders: [
      {
        id: "r1",
        leadId: "1",
        date: "2026-06-08",
        time: "10:00",
        note: "Follow up on pricing discussion",
        status: "pending",
        createdAt: "2026-06-05",
      },
      {
        id: "r2",
        leadId: "1",
        date: "2026-06-01",
        time: "14:00",
        note: "Initial call",
        status: "completed",
        createdAt: "2026-05-30",
        completedAt: "2026-06-01",
      },
    ],
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
    createdAt: "2026-03-05",
    assignee: "Hoàng An",
    order: 0,
    tags: ["new"],
    reminders: [
      {
        id: "r3",
        leadId: "2",
        date: "2026-06-07",
        time: "09:00",
        note: "Send product demo video",
        status: "pending",
        createdAt: "2026-06-05",
      },
    ],
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    company: "Tech Solutions",
    email: "nam.lh@techsolutions.vn",
    phone: "0903456789",
    source: "Referral",
    status: "new",
    score: 45,
    createdAt: "2026-03-10",
    assignee: "Minh Tuấn",
    order: 0,
    tags: ["long-term", "follow-up"],
    reminders: [],
  },
  {
    id: "4",
    name: "Phạm Thu Hà",
    company: "Global Trading",
    email: "ha.pt@globaltrading.vn",
    phone: "0904567890",
    source: "Cold Call",
    status: "contacted",
    score: 68,
    createdAt: "2026-03-12",
    assignee: "Hoàng An",
    order: 1,
    tags: [],
    reminders: [
      {
        id: "r4",
        leadId: "4",
        date: "2026-06-05",
        time: "11:00",
        note: "Follow up call",
        status: "overdue",
        createdAt: "2026-06-04",
      },
    ],
  },
  {
    id: "5",
    name: "Đặng Minh Khoa",
    company: "Innovate Tech",
    email: "khoa.dm@innovate.vn",
    phone: "0905678901",
    source: "Email Campaign",
    status: "qualified",
    score: 90,
    createdAt: "2026-03-14",
    assignee: "Minh Tuấn",
    order: 1,
    tags: ["vip"],
    reminders: [],
  },
  {
    id: "6",
    name: "Vũ Thị Mai",
    company: "Smart Business",
    email: "mai.vt@smartbusiness.vn",
    phone: "0906789012",
    source: "Trade Show",
    status: "new",
    score: 35,
    createdAt: "2026-03-18",
    assignee: "Hoàng An",
    order: 1,
    tags: [],
    reminders: [],
  },
  {
    id: "7",
    name: "Bùi Đức Thắng",
    company: "Digital Transform",
    email: "thang.bd@digitaltransform.vn",
    phone: "0907890123",
    source: "Partner",
    status: "lost",
    score: 20,
    createdAt: "2026-02-28",
    assignee: "Minh Tuấn",
    order: 0,
    tags: ["inactive"],
    reminders: [],
  },
];

export const contacts: Contact[] = [
  {
    id: "1",
    name: "Nguyễn Văn Minh",
    company: "Công ty ABC",
    email: "minh.nv@abc.vn",
    phone: "0901234567",
    position: "CEO",
    companyId: "c1",
    ownerId: "u2",
    tags: ["vip"],
    createdAt: "2026-02-15",
  },
  {
    id: "2",
    name: "Trần Thị Lan",
    company: "XYZ Corporation",
    email: "lan.tt@xyz.vn",
    phone: "0902345678",
    position: "CTO",
    companyId: "c2",
    ownerId: "u1",
    tags: [],
    createdAt: "2026-01-20",
  },
  {
    id: "3",
    name: "Lê Hoàng Nam",
    company: "Tech Solutions",
    email: "nam.lh@techsolutions.vn",
    phone: "0903456789",
    position: "COO",
    companyId: "c3",
    ownerId: "u1",
    tags: [],
    createdAt: "2026-02-25",
  },
  {
    id: "4",
    name: "Phạm Thu Hà",
    company: "Global Trading",
    email: "ha.pt@globaltrading.vn",
    phone: "0904567890",
    position: "Sales Director",
    companyId: "c4",
    ownerId: "u2",
    tags: [],
    createdAt: "2026-03-05",
  },
];

export const deals: Deal[] = [
  {
    id: "1",
    title: "Công ty ABC - Enterprise License",
    value: 450000000,
    stage: "negotiation",
    probability: 75,
    contactId: "1",
    companyId: "c1",
    createdAt: "2026-03-15",
    expectedCloseDate: "2026-04-15",
    status: "open",
    stageEnteredAt: "2026-05-20",
  },
  {
    id: "2",
    title: "XYZ Corp - AI Platform Setup",
    value: 280000000,
    stage: "proposal",
    probability: 60,
    contactId: "2",
    companyId: "c2",
    createdAt: "2026-03-10",
    expectedCloseDate: "2026-04-20",
    status: "open",
    stageEnteredAt: "2026-06-01",
  },
  {
    id: "3",
    title: "Tech Solutions - Cloud Migration",
    value: 180000000,
    stage: "qualified",
    probability: 40,
    contactId: "3",
    companyId: "c3",
    createdAt: "2026-03-08",
    expectedCloseDate: "2026-05-01",
    status: "open",
    stageEnteredAt: "2026-05-28",
  },
  {
    id: "4",
    title: "Global Trading - Data Analytics",
    value: 320000000,
    stage: "lead",
    probability: 25,
    contactId: "4",
    companyId: "c4",
    createdAt: "2026-03-18",
    expectedCloseDate: "2026-05-15",
    status: "open",
    stageEnteredAt: "2026-06-05",
  },
  {
    id: "5",
    title: "Innovate Tech - Full Suite",
    value: 550000000,
    stage: "won",
    probability: 100,
    contactId: "5",
    createdAt: "2026-03-01",
    expectedCloseDate: "2026-03-20",
    status: "won",
    wonAt: "2026-03-20",
  },
];

export const activities: Activity[] = [
  {
    id: "1",
    type: "call",
    title: "Gọi điện follow up",
    description: "Theo dõi tiến độ đàm phán với ABC",
    dealId: "1",
    contactId: "1",
    dueDate: "2026-03-24",
    status: "pending",
  },
  {
    id: "2",
    type: "meeting",
    title: "Demo sản phẩm",
    description: "Demo AI Platform cho XYZ Corp",
    dealId: "2",
    contactId: "2",
    dueDate: "2026-03-25",
    status: "pending",
  },
  {
    id: "3",
    type: "email",
    title: "Gửi proposal",
    description: "Gửi proposal chi tiết cho Tech Solutions",
    dealId: "3",
    contactId: "3",
    dueDate: "2026-03-23",
    status: "completed",
  },
  {
    id: "4",
    type: "task",
    title: "Chuẩn bị hợp đồng",
    description: "Soạn draft hợp đồng cho deal ABC",
    dealId: "1",
    contactId: "1",
    dueDate: "2026-03-26",
    status: "overdue",
  },
];

export const aiInsights: AIInsight[] = [
  {
    id: "1",
    type: "conversion",
    title: "Tỷ lệ chuyển đổi cao",
    description: "Lead từ LinkedIn có tỷ lệ chuyển đổi 40% - cao hơn 15% so với trung bình. Cân nhắc đầu tư thêm vào kênh này.",
    priority: "high",
    createdAt: "2026-03-22",
  },
  {
    id: "2",
    type: "timing",
    title: "Thời điểm liên hệ tối ưu",
    description: "Khách hàng có xu hướng phản hồi nhanh hơn khi được liên hệ vào thứ 3-4, khoảng 10-11 giờ sáng.",
    priority: "medium",
    createdAt: "2026-03-21",
  },
  {
    id: "3",
    type: "deal",
    title: "Deal ABC có nguy cơ chậm tiến độ",
    description: "Expected close date đã qua 5 ngày nhưng deal vẫn ở stage Negotiation. Cần follow up khẩn cấp.",
    priority: "high",
    createdAt: "2026-03-23",
  },
  {
    id: "4",
    type: " upsell",
    title: "Cơ hội mở rộng deal",
    description: "Innovate Tech đang sử dụng 60% tính năng. Có tiềm năng upsell gói Enterprise với giá trị +200M.",
    priority: "medium",
    createdAt: "2026-03-20",
  },
];

export const chartData = [
  { month: "Tháng 1", leads: 28, deals: 8 },
  { month: "Tháng 2", leads: 35, deals: 12 },
  { month: "Tháng 3", leads: 42, deals: 15 },
  { month: "Tháng 4", leads: 38, deals: 11 },
  { month: "Tháng 5", leads: 45, deals: 14 },
  { month: "Tháng 6", leads: 52, deals: 18 },
];

export const products: Product[] = [
  {
    id: "p1",
    code: "SW-001",
    name: "Enterprise CRM License",
    group: "Software",
    unitPrice: 50000000,
    currency: "VND",
    unit: "license/year",
    defaultTaxPct: 10,
    description: "Bản quyền phần mềm CRM doanh nghiệp",
    isActive: true,
    createdAt: "2026-01-15",
  },
  {
    id: "p2",
    code: "SW-002",
    name: "Analytics Module",
    group: "Software",
    unitPrice: 25000000,
    currency: "VND",
    unit: "license/year",
    defaultTaxPct: 10,
    description: "Module phân tích dữ liệu nâng cao",
    isActive: true,
    createdAt: "2026-01-20",
  },
  {
    id: "p3",
    code: "HW-001",
    name: "Server Hardware Package",
    group: "Hardware",
    unitPrice: 150000000,
    currency: "VND",
    unit: "set",
    defaultTaxPct: 10,
    description: "Gói server tích hợp",
    isActive: true,
    createdAt: "2026-02-01",
  },
  {
    id: "p4",
    code: "SVC-001",
    name: "Implementation Service",
    group: "Services",
    unitPrice: 80000000,
    currency: "VND",
    unit: "project",
    defaultTaxPct: 0,
    description: "Dịch vụ triển khai và cấu hình",
    isActive: true,
    createdAt: "2026-02-10",
  },
  {
    id: "p5",
    code: "TR-001",
    name: "Training Package",
    group: "Training",
    unitPrice: 15000000,
    currency: "VND",
    unit: "session",
    defaultTaxPct: 10,
    description: "Đào tạo sử dụng phần mềm",
    isActive: false,
    createdAt: "2026-02-15",
  },
  {
    id: "p6",
    code: "SP-001",
    name: "Premium Support",
    group: "Support",
    unitPrice: 20000000,
    currency: "VND",
    unit: "year",
    defaultTaxPct: 10,
    description: "Hỗ trợ kỹ thuật 24/7",
    isActive: true,
    createdAt: "2026-03-01",
  },
];

export const quoteLineItems: QuoteLineItem[] = [
  {
    id: "qli1",
    quoteId: "q1",
    productId: "p1",
    name: "Enterprise CRM License",
    qty: 2,
    unitPrice: 50000000,
    discountPct: 10,
    taxPct: 10,
    total: 99000000,
  },
  {
    id: "qli2",
    quoteId: "q1",
    productId: "p2",
    name: "Analytics Module",
    qty: 1,
    unitPrice: 25000000,
    discountPct: 0,
    taxPct: 10,
    total: 27500000,
  },
  {
    id: "qli3",
    quoteId: "q2",
    productId: "p1",
    name: "Enterprise CRM License",
    qty: 1,
    unitPrice: 50000000,
    discountPct: 15,
    taxPct: 10,
    total: 46750000,
  },
  {
    id: "qli4",
    quoteId: "q2",
    productId: "p4",
    name: "Implementation Service",
    qty: 1,
    unitPrice: 80000000,
    discountPct: 0,
    taxPct: 0,
    total: 80000000,
  },
];

export const quotes: Quote[] = [
  {
    id: "q1",
    number: "Q-2026-001",
    title: "Báo giá CRM cho Công ty ABC",
    dealId: "1",
    companyId: "c1",
    contactId: "1",
    status: "draft",
    validUntil: "2026-07-15",
    subtotal: 125000000,
    discountTotal: 12500000,
    taxTotal: 11250000,
    total: 123750000,
    currency: "VND",
    terms: "Thanh toán 50% trước khi triển khai, 50% còn lại sau khi bàn giao.",
    createdAt: "2026-06-01",
  },
  {
    id: "q2",
    number: "Q-2026-002",
    title: "Báo giá XYZ Corp - Full Suite",
    dealId: "2",
    companyId: "c2",
    contactId: "2",
    status: "sent",
    validUntil: "2026-07-01",
    subtotal: 130000000,
    discountTotal: 19500000,
    taxTotal: 9350000,
    total: 110500000,
    currency: "VND",
    terms: "Thanh toán theo tiến độ triển khai.",
    createdAt: "2026-06-05",
    sentAt: "2026-06-06",
  },
  {
    id: "q3",
    number: "Q-2026-003",
    title: "Báo giá Tech Solutions - Cloud",
    dealId: "3",
    companyId: "c3",
    contactId: "3",
    status: "accepted",
    validUntil: "2026-06-20",
    subtotal: 85000000,
    discountTotal: 8500000,
    taxTotal: 7650000,
    total: 83650000,
    currency: "VND",
    terms: "Thanh toán 100% trước khi bàn giao.",
    createdAt: "2026-05-25",
    sentAt: "2026-05-26",
    decidedAt: "2026-06-01",
  },
];

const nextId = () => Date.now().toString();

const getDealProbability = (stage: Deal["stage"]) => {
  switch (stage) {
    case "qualified":
      return 40;
    case "proposal":
      return 60;
    case "negotiation":
      return 75;
    case "won":
      return 100;
    case "lost":
      return 0;
    default:
      return 25;
  }
};

export function convertLeadToDeal(
  data: ConvertLeadData,
  lead: Lead
): { deal: Deal; contact?: Contact } {
  const createdAt = new Date().toISOString().split("T")[0];

  let contact: Contact | undefined;
  if (data.createContact) {
    contact = {
      id: nextId(),
      name: lead.name,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      position: "",
      companyId: lead.id,
    };
    contacts.push(contact);
  }

  const deal: Deal = {
    id: nextId(),
    title: data.dealTitle,
    value: data.dealValue,
    stage: data.dealStage,
    probability: getDealProbability(data.dealStage),
    contactId: contact?.id || "",
    createdAt,
    expectedCloseDate: data.expectedCloseDate,
  };

  deals.push(deal);

  return { deal, contact };
}

// ── U7 Analytics ──────────────────────────────────────────────────────────────

export const reportDefs: ReportDef[] = [
  {
    id: "preset-1",
    name: "Pipeline theo giai đoạn",
    entity: "deal",
    chartType: "bar",
    dimension: "stage",
    measure: "sum_value",
    filters: { status: "open" },
    isShared: true,
    createdAt: "2026-06-01",
  },
  {
    id: "preset-2",
    name: "Chuyển đổi theo nguồn",
    entity: "lead",
    chartType: "pie",
    dimension: "source",
    measure: "conversion_rate",
    filters: {},
    isShared: true,
    createdAt: "2026-06-01",
  },
  {
    id: "preset-3",
    name: "Lý do thua deal",
    entity: "deal",
    chartType: "pie",
    dimension: "loss_reason",
    measure: "count",
    filters: { status: "lost" },
    isShared: true,
    createdAt: "2026-06-01",
  },
  {
    id: "preset-4",
    name: "Hoạt động theo nhân viên",
    entity: "activity",
    chartType: "bar",
    dimension: "owner",
    measure: "count",
    filters: {},
    isShared: true,
    createdAt: "2026-06-01",
  },
  {
    id: "preset-5",
    name: "Doanh thu theo tháng",
    entity: "deal",
    chartType: "line",
    dimension: "month",
    measure: "sum_value",
    filters: { status: "won" },
    isShared: true,
    createdAt: "2026-06-01",
  },
  {
    id: "preset-6",
    name: "Deal sắp đóng",
    entity: "deal",
    chartType: "table",
    dimension: "stage",
    measure: "sum_value",
    filters: { status: "open" },
    isShared: true,
    createdAt: "2026-06-01",
  },
];

export const goals: Goal[] = [
  {
    id: "g1",
    ownerId: "u1",
    isTeam: false,
    period: "quarter",
    periodKey: "2026-Q2",
    metric: "revenue",
    target: 1000000000,
  },
  {
    id: "g2",
    ownerId: "u2",
    isTeam: false,
    period: "month",
    periodKey: "2026-06",
    metric: "deals_won",
    target: 3,
  },
  {
    id: "g3",
    isTeam: true,
    period: "quarter",
    periodKey: "2026-Q2",
    metric: "revenue",
    target: 3000000000,
  },
];

export const dashboardLayout: DashboardLayout = {
  userId: "u1",
  widgets: [
    { id: "w1", type: "kpi", title: "Total Revenue", w: 3, h: 1, x: 0, y: 0 },
    { id: "w2", type: "kpi", title: "Active Deals", w: 3, h: 1, x: 3, y: 0 },
    { id: "w3", type: "kpi", title: "Conversion Rate", w: 3, h: 1, x: 6, y: 0 },
    { id: "w4", type: "kpi", title: "Total Leads", w: 3, h: 1, x: 9, y: 0 },
    { id: "w5", type: "saved-report", refId: "preset-1", title: "Pipeline theo giai đoạn", w: 6, h: 2, x: 0, y: 1 },
    { id: "w6", type: "forecast", title: "Forecast Q2", w: 6, h: 2, x: 6, y: 1 },
    { id: "w7", type: "quota", title: "Quota của tôi", w: 4, h: 2, x: 0, y: 3 },
    { id: "w8", type: "my-day", title: "Việc hôm nay", w: 8, h: 2, x: 4, y: 3 },
  ],
};

// ── U4 Communication ──────────────────────────────────────────────────────────

import { EmailTemplate, Attachment, MentionUser } from "@/types";

export const mentionUsers: MentionUser[] = [
  { id: "u1", name: "Hoàng An", email: "hoangan@company.com" },
  { id: "u2", name: "Trần Bình", email: "tranbinh@company.com" },
  { id: "u3", name: "Lê Châu", email: "lechau@company.com" },
  { id: "u4", name: "Nguyễn Dung", email: "nguyendung@company.com" },
];

export const emailTemplates: EmailTemplate[] = [
  {
    id: "tpl1",
    name: "Giới thiệu dịch vụ",
    subject: "Giới thiệu giải pháp CRM cho {{company.name}}",
    body: "Kính gửi {{contact.name}},\n\nChúng tôi xin gửi tới quý công ty {{company.name}} thông tin về giải pháp CRM của chúng tôi.\n\nTrân trọng,\n{{owner.name}}",
    isShared: true,
  },
  {
    id: "tpl2",
    name: "Gửi báo giá",
    subject: "Báo giá dành cho {{company.name}} — {{deal.title}}",
    body: "Kính gửi {{contact.name}},\n\nVui lòng xem báo giá đính kèm cho dự án {{deal.title}}.\n\nTrân trọng,\n{{owner.name}}",
    isShared: false,
    ownerId: "u1",
  },
  {
    id: "tpl3",
    name: "Follow-up sau cuộc gọi",
    subject: "Cảm ơn cuộc trò chuyện — {{contact.name}}",
    body: "Kính gửi {{contact.name}},\n\nCảm ơn bạn đã dành thời gian nói chuyện hôm nay. Như đã trao đổi, tôi sẽ gửi thêm thông tin về {{deal.title}}.\n\nTrân trọng,\n{{owner.name}}",
    isShared: true,
  },
];

// In-memory stores for U4 data
const attachmentStore: Record<string, Attachment[]> = {
  "company:c1": [
    {
      id: "att1",
      relatedType: "company",
      relatedId: "c1",
      fileName: "hop-dong-abc.pdf",
      mimeType: "application/pdf",
      sizeBytes: 2_400_000,
      url: "/uploads/hop-dong-abc.pdf",
      uploadedBy: "Trần Bình",
      createdAt: "06/06/2026",
    },
    {
      id: "att2",
      relatedType: "company",
      relatedId: "c1",
      fileName: "bao-gia.xlsx",
      mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      sizeBytes: 180_000,
      url: "/uploads/bao-gia.xlsx",
      uploadedBy: "Trần Bình",
      createdAt: "05/06/2026",
    },
  ],
};

export function getAttachments(relatedType: string, relatedId: string): Attachment[] {
  return attachmentStore[`${relatedType}:${relatedId}`] || [];
}

export function addAttachment(attachment: Attachment): void {
  const key = `${attachment.relatedType}:${attachment.relatedId}`;
  if (!attachmentStore[key]) attachmentStore[key] = [];
  attachmentStore[key].unshift(attachment);
}

export function removeAttachment(id: string): void {
  for (const key of Object.keys(attachmentStore)) {
    attachmentStore[key] = attachmentStore[key].filter((a) => a.id !== id);
  }
}
