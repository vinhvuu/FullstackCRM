import { TimelineItem, TimelineItemType, RecordType } from "@/types";
import { leads, contacts } from "@/lib/mock-data";

// In-memory store for added timeline items (giai đoạn mock)
const timelineStore: Record<string, TimelineItem[]> = {};

function storeKey(recordType: RecordType, recordId: string) {
  return `${recordType}:${recordId}`;
}

function generateLeadTimeline(leadId: string): TimelineItem[] {
  const lead = leads.find((l) => l.id === leadId);
  if (!lead) return [];

  const base: TimelineItem[] = [
    {
      id: "tl-sys-1",
      type: "system",
      title: "Tạo Lead mới",
      content: `Tạo Lead mới từ nguồn ${lead.source}`,
      createdAt: lead.createdAt,
      createdBy: lead.assignee,
    },
  ];

  if (lead.status === "contacted" || lead.status === "qualified" || lead.status === "lost") {
    base.push(
      {
        id: "tl-call-1",
        type: "call",
        title: "Cuộc gọi đầu tiên",
        content: "Liên hệ lần đầu, khách hàng quan tâm đến sản phẩm",
        createdAt: "02/06/2026",
        createdBy: lead.assignee,
      },
      {
        id: "tl-email-1",
        type: "email",
        title: "Gửi email giới thiệu",
        content: "Đã gửi tài liệu giới thiệu dịch vụ qua email",
        createdAt: "03/06/2026",
        createdBy: lead.assignee,
      }
    );
  }

  if (lead.status === "qualified") {
    base.push(
      {
        id: "tl-meeting-1",
        type: "meeting",
        title: "Demo sản phẩm",
        content: "Thực hiện demo sản phẩm cho khách hàng, khách hàng rất hài lòng",
        createdAt: "01/06/2026",
        createdBy: lead.assignee,
      },
      {
        id: "tl-email-2",
        type: "email",
        title: "Gửi báo giá",
        content: "Đã gửi báo giá gói Enterprise cho khách hàng",
        createdAt: "03/06/2026",
        createdBy: lead.assignee,
      }
    );
  }

  if (lead.status === "lost") {
    base.push({
      id: "tl-note-lost",
      type: "note",
      title: "Lead Lost",
      content: "Khách hàng đã chọn nhà cung cấp khác",
      createdAt: "04/06/2026",
      createdBy: lead.assignee,
    });
  }

  return base;
}

function generateContactTimeline(contactId: string): TimelineItem[] {
  const contact = contacts.find((c) => c.id === contactId);
  if (!contact) return [];
  return [
    {
      id: "tl-contact-sys",
      type: "system",
      title: "Tạo liên hệ",
      content: `Liên hệ được tạo với vị trí ${contact.position}`,
      createdAt: contact.createdAt || "2026-01-01",
      createdBy: "Hệ thống",
    },
  ];
}

function generateCompanyTimeline(companyId: string): TimelineItem[] {
  return [
    {
      id: "tl-company-sys",
      type: "system",
      title: "Tạo công ty",
      content: "Công ty được thêm vào hệ thống",
      createdAt: "2026-02-10",
      createdBy: "Hệ thống",
    },
  ];
}

export function getTimeline(recordType: RecordType, recordId: string): TimelineItem[] {
  const key = storeKey(recordType, recordId);
  const added = timelineStore[key] || [];

  let base: TimelineItem[] = [];
  if (recordType === "lead") base = generateLeadTimeline(recordId);
  else if (recordType === "contact") base = generateContactTimeline(recordId);
  else if (recordType === "company") base = generateCompanyTimeline(recordId);

  // added items appear first (newest first)
  return [...added, ...base];
}

export function addTimelineItem(
  recordType: RecordType,
  recordId: string,
  item: Omit<TimelineItem, "id">
): TimelineItem {
  const key = storeKey(recordType, recordId);
  const newItem: TimelineItem = { ...item, id: `tl-${Date.now()}` };
  timelineStore[key] = [newItem, ...(timelineStore[key] || [])];
  return newItem;
}
