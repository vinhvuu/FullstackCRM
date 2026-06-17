export const IAM_USER_SERVICE = Symbol('IAM_USER_SERVICE');
export const AUDIT_SERVICE = Symbol('AUDIT_SERVICE');

export interface AuthUserDto {
  id: number;
  email: string;
  name: string;
  role: 'admin' | 'user';
  status: 'active' | 'inactive' | 'invited' | 'deleted';
  avatarUrl?: string;
  lastLoginAt?: string;
}

export interface IIamUserService {
  findById(id: number): Promise<AuthUserDto | null>;
  findByIds(ids: number[]): Promise<AuthUserDto[]>;
  findByEmail(email: string): Promise<AuthUserDto | null>;
  isActive(id: number): Promise<boolean>;
  countByStatus(status: string): Promise<number>;
  countActiveUsers(): Promise<number>;
}

export interface IAuditService {
  log(input: {
    userId: number | null;
    userName: string | null;
    action: string;
    entityType: string;
    entityId: number | null;
    details?: { before?: any; after?: any; meta?: any };
    ipAddress?: string;
    userAgent?: string;
  }): Promise<void>;
}