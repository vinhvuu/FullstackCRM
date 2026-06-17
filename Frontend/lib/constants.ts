export const DEAL_STAGES = [
  { id: "lead", label: "Lead", color: "#818CF8" },
  { id: "qualified", label: "Qualified", color: "#6366F1" },
  { id: "proposal", label: "Proposal", color: "#8B5CF6" },
  { id: "negotiation", label: "Negotiation", color: "#A855F7" },
  { id: "won", label: "Won", color: "#10B981" },
  { id: "lost", label: "Lost", color: "#EF4444" },
] as const;

export const PIPELINES = [
  {
    id: "new-business",
    name: "New Business",
    stages: [
      { id: "lead", label: "Lead", color: "#818CF8", probability: 10 },
      { id: "qualified", label: "Qualified", color: "#6366F1", probability: 30 },
      { id: "proposal", label: "Proposal", color: "#8B5CF6", probability: 60 },
      { id: "negotiation", label: "Negotiation", color: "#A855F7", probability: 80 },
      { id: "won", label: "Won", color: "#10B981", probability: 100 },
      { id: "lost", label: "Lost", color: "#EF4444", probability: 0 },
    ],
  },
  {
    id: "renewal",
    name: "Renewal",
    stages: [
      { id: "due", label: "Due", color: "#818CF8", probability: 20 },
      { id: "contacted", label: "Contacted", color: "#6366F1", probability: 50 },
      { id: "negotiation", label: "Negotiation", color: "#A855F7", probability: 75 },
      { id: "renewed", label: "Renewed", color: "#10B981", probability: 100 },
      { id: "churned", label: "Churned", color: "#EF4444", probability: 0 },
    ],
  },
];

export const LOSS_REASONS = [
  { id: "price", label: "Giá cao" },
  { id: "competitor", label: "Chọn đối thủ" },
  { id: "budget", label: "Không có ngân sách" },
  { id: "timing", label: "Sai thời điểm" },
  { id: "no_response", label: "Không phản hồi" },
  { id: "other", label: "Khác" },
];

export const DEAL_ROT_DAYS = 7;

export const LEAD_SOURCES = [
  "Website",
  "Referral",
  "LinkedIn",
  "Cold Call",
  "Email Campaign",
  "Trade Show",
  "Partner",
] as const;

export const INDUSTRIES = [
  "Công nghệ",
  "Tài chính",
  "Bất động sản",
  "Sản xuất",
  "Thương mại",
  "Y tế",
  "Giáo dục",
  "Logistics",
  "Du lịch",
  "Khác",
] as const;

export const COMPANY_SIZES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "500+",
] as const;

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/leads", label: "Leads", icon: "Users" },
  { href: "/contacts", label: "Contacts", icon: "Contact" },
  { href: "/companies", label: "Công ty", icon: "Building2" },
  { href: "/deals", label: "Deals", icon: "TrendingUp" },
  { href: "/products", label: "Sản phẩm", icon: "Package" },
  { href: "/quotes", label: "Báo giá", icon: "FileText" },
  { href: "/activities", label: "Activities", icon: "Calendar" },
  { href: "/reports", label: "Reports", icon: "BarChart3" },
  { href: "/settings", label: "Settings", icon: "Settings" },
] as const;

export const TIMELINE_TYPE_CONFIG = {
  call: { color: "bg-blue-100 text-blue-600", label: "Cuộc gọi" },
  email: { color: "bg-green-100 text-green-600", label: "Email" },
  meeting: { color: "bg-orange-100 text-orange-600", label: "Cuộc họp" },
  note: { color: "bg-purple-100 text-purple-600", label: "Ghi chú" },
  task: { color: "bg-yellow-100 text-yellow-600", label: "Task" },
  system: { color: "bg-gray-100 text-gray-600", label: "Hệ thống" },
} as const;

export const PRODUCT_GROUPS = [
  "Software",
  "Hardware",
  "Services",
  "Training",
  "Support",
  "Other",
] as const;

export const TAX_RATES = [
  { id: "0", label: "0%", value: 0 },
  { id: "5", label: "5%", value: 5 },
  { id: "10", label: "10%", value: 10 },
] as const;

export const QUOTE_STATUS = [
  { id: "draft", label: "Nháp", color: "#6B7280" },
  { id: "sent", label: "Đã gửi", color: "#3B82F6" },
  { id: "accepted", label: "Chấp nhận", color: "#10B981" },
  { id: "rejected", label: "Từ chối", color: "#EF4444" },
  { id: "expired", label: "Hết hạn", color: "#F59E0B" },
] as const;

// ── U7 Analytics dimensions & measures ────────────────────────────────────────

export const DIMENSIONS = {
  lead: [
    { id: "source", label: "Nguồn" },
    { id: "status", label: "Trạng thái" },
    { id: "assignee", label: "Nhân viên" },
    { id: "month", label: "Tháng tạo" },
    { id: "tag", label: "Nhãn" },
  ],
  deal: [
    { id: "stage", label: "Giai đoạn" },
    { id: "owner", label: "Nhân viên" },
    { id: "company", label: "Công ty" },
    { id: "month", label: "Tháng tạo" },
    { id: "loss_reason", label: "Lý do thua" },
    { id: "quarter", label: "Quý" },
  ],
  activity: [
    { id: "type", label: "Loại hoạt động" },
    { id: "status", label: "Trạng thái" },
    { id: "owner", label: "Nhân viên" },
    { id: "month", label: "Tháng" },
  ],
  quote: [
    { id: "status", label: "Trạng thái" },
    { id: "owner", label: "Nhân viên" },
    { id: "month", label: "Tháng" },
  ],
} as const;

export const MEASURES = {
  lead: [
    { id: "count", label: "Số lượng" },
    { id: "conversion_rate", label: "Tỷ lệ chuyển đổi (%)" },
  ],
  deal: [
    { id: "count", label: "Số lượng" },
    { id: "sum_value", label: "Tổng giá trị" },
    { id: "weighted_value", label: "Giá trị có trọng số" },
    { id: "win_rate", label: "Tỷ lệ thắng (%)" },
  ],
  activity: [
    { id: "count", label: "Số lượng" },
  ],
  quote: [
    { id: "count", label: "Số lượng" },
    { id: "sum_value", label: "Tổng giá trị" },
  ],
} as const;

export const CHART_COLORS = [
  "#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6",
  "#3B82F6", "#EC4899", "#14B8A6", "#F97316", "#84CC16",
];
