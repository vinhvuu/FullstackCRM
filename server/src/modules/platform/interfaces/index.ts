export const PLATFORM_NOTIFICATION_SERVICE = Symbol('PLATFORM_NOTIFICATION_SERVICE');
export const PLATFORM_SAVED_VIEW_SERVICE = Symbol('PLATFORM_SAVED_VIEW_SERVICE');
export const PLATFORM_CUSTOM_FIELD_SERVICE = Symbol('PLATFORM_CUSTOM_FIELD_SERVICE');
export const PLATFORM_SEARCH_SERVICE = Symbol('PLATFORM_SEARCH_SERVICE');

export interface NotificationDto {
  id: number;
  userId: number;
  type: 'mention' | 'assignment' | 'reminder' | 'deal_stage' | 'quote_accepted' | 'system';
  title: string;
  body?: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
}

export interface IPlatformNotificationService {
  create(input: {
    userId: number;
    type: 'mention' | 'assignment' | 'reminder' | 'deal_stage' | 'quote_accepted' | 'system';
    title: string;
    body?: string;
    link?: string;
  }): Promise<NotificationDto>;
  createMany(userIds: number[], input: { type: string; title: string; body?: string; link?: string }): Promise<void>;
  countUnread(userId: number): Promise<number>;
}

export interface SavedViewDto {
  id: number;
  userId: number;
  entity: string;
  name: string;
  filters: any;
  columns: string[];
  sort?: string;
}

export interface IPlatformSavedViewService {
  findById(id: number, userId: number): Promise<SavedViewDto | null>;
  applyView(id: number, userId: number): Promise<{ filters: any; columns: string[]; sort?: string }>;
}

export interface CustomFieldDefDto {
  id: number;
  entity: string;
  fieldKey: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
  options?: string[];
  required: boolean;
}

export interface IPlatformCustomFieldService {
  getDefs(entity: string): Promise<CustomFieldDefDto[]>;
  getValues(entity: string, recordId: number): Promise<{ fieldKey: string; value: string }[]>;
  setValues(entity: string, recordId: number, values: { fieldKey: string; value: any }[]): Promise<void>;
  validateValues(entity: string, recordId: number, values: { fieldKey: string; value: any }[]): Promise<{ ok: boolean; errors: { fieldKey: string; message: string }[] }>;
}

export interface SearchResultDto {
  type: 'lead' | 'contact' | 'company' | 'deal' | 'quote';
  id: string;
  title: string;
  subtitle?: string;
  link: string;
}

export interface IPlatformSearchService {
  search(query: string, limit?: number): Promise<SearchResultDto[]>;
}