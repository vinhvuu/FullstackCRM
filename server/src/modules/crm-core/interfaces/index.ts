export const CRM_LEAD_SERVICE = Symbol('CRM_LEAD_SERVICE');
export const CRM_CONTACT_SERVICE = Symbol('CRM_CONTACT_SERVICE');
export const CRM_COMPANY_SERVICE = Symbol('CRM_COMPANY_SERVICE');
export const CRM_ACTIVITY_SERVICE = Symbol('CRM_ACTIVITY_SERVICE');
export const CRM_TIMELINE_SERVICE = Symbol('CRM_TIMELINE_SERVICE');
export const CRM_ATTACHMENT_SERVICE = Symbol('CRM_ATTACHMENT_SERVICE');
export const CRM_TAG_SERVICE = Symbol('CRM_TAG_SERVICE');
export const CRM_EMAIL_TEMPLATE_SERVICE = Symbol('CRM_EMAIL_TEMPLATE_SERVICE');
export const CRM_LEAD_SOURCE_SERVICE = Symbol('CRM_LEAD_SOURCE_SERVICE');

export interface LeadDto {
  id: number;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  source?: string;
  status: 'new' | 'contacted' | 'qualified' | 'lost';
  score: number;
  inPool: boolean;
  ownerId: number;
}

export interface ContactDto {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  position?: string;
  companyId?: number;
  ownerId: number;
}

export interface CompanyDto {
  id: number;
  name: string;
  website?: string;
  industry?: string;
  size?: string;
  ownerId: number;
}

export interface ActivityDto {
  id: number;
  type: 'call' | 'email' | 'meeting' | 'task';
  title: string;
  description?: string;
  ownerId: number;
  dueDate?: string;
  status: 'pending' | 'completed' | 'overdue';
}

export interface ICrmLeadService {
  findById(id: number): Promise<LeadDto | null>;
  findByIds(ids: number[]): Promise<LeadDto[]>;
  searchForPicker(query: string, limit?: number): Promise<{ id: number; name: string }[]>;
  countByOwner(ownerId: number): Promise<number>;
  countUnassigned(): Promise<number>;
  countInPool(): Promise<number>;
  countByStatus(status: string, ownerId?: number): Promise<number>;
}

export interface ICrmContactService {
  findById(id: number): Promise<ContactDto | null>;
  findByIds(ids: number[]): Promise<ContactDto[]>;
  searchForPicker(query: string, limit?: number): Promise<{ id: number; name: string }[]>;
  countByCompany(companyId: number): Promise<number>;
}

export interface ICrmCompanyService {
  findById(id: number): Promise<CompanyDto | null>;
  findByIds(ids: number[]): Promise<CompanyDto[]>;
  searchForPicker(query: string, limit?: number): Promise<{ id: number; name: string }[]>;
  openDealValueByCompany(companyId: number): Promise<number>;
  openDealCountByCompany(companyId: number): Promise<number>;
}

export interface ICrmActivityService {
  countByDeal(dealId: number): Promise<number>;
  countPendingByOwner(ownerId: number): Promise<number>;
}

export interface ICrmTimelineService {
  add(input: { recordType: string; recordId: number; type: string; title?: string; content: string }): Promise<void>;
}

export interface ICrmAttachmentService {
  upload(input: { recordType: string; recordId: number; file: Buffer; fileName: string }): Promise<{ id: number }>;
  delete(id: number): Promise<void>;
}

export interface ICrmTagService {
  listAll(): Promise<{ id: string; label: string; color: string; bgColor: string }[]>;
}

export interface ICrmEmailTemplateService {
  findById(id: number): Promise<{ id: number; name: string; subject: string; body: string } | null>;
  listByOwner(ownerId: number): Promise<{ id: number; name: string }[]>;
}

export interface ICrmLeadSourceService {
  listAll(): Promise<{ id: number; name: string }[]>;
}