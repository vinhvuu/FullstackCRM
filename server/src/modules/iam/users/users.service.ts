import { Injectable, Logger } from '@nestjs/common';

export interface CreateUserDto {
  email: string;
  name: string;
  phone?: string;
  password: string;
  role: 'admin' | 'user';
  mustChangePassword?: boolean;
}

export interface AdminUpdateUserDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
  role?: 'admin' | 'user';
  status?: 'active' | 'inactive' | 'invited';
}

export interface SelfUpdateUserDto {
  name?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface ResetPasswordDto {
  newPassword: string;
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  /**
   * T1.8. GET /api/users — Danh sách user (Admin)
   * Auth: Authenticated, Role: admin
   * SP: 3
   * Query: ?page=1&limit=20&role=admin|user&status=active|inactive|invited&search=...
   * Response 200: { data: [...], meta: { page, limit, total, totalPages } }
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Query iam_users (filter role/status/search theo name hoặc email LIKE %search%)
    // 2. Inject CrmLeadService để lấy leadCount map theo ownerId
    // 3. Inject SalesDealService để lấy openDealCount map theo ownerId
  }

  /**
   * T1.9. GET /api/users/:id — Chi tiết user
   * Auth: Authenticated, Role: admin HOẶC chính user đó
   * SP: 1
   * Response 200: user object
   * Response 404: USER_NOT_FOUND
   * Response 403: Staff cố xem user khác
   */
  async findById(id: number, currentUserId: number, currentUserRole: string): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * T1.10. POST /api/users — Tạo user (Admin)
   * Auth: Authenticated, Role: admin
   * SP: 2
   * Response 201: user vừa tạo
   * Response 409: EMAIL_EXISTS
   */
  async create(dto: CreateUserDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Hash password
    // 2. Insert iam_users
    // 3. Audit log action='create', entityType='user'
  }

  /**
   * T1.11. PUT /api/users/:id — Cập nhật user
   * Auth: Authenticated, Role: admin HOẶC chính user đó
   * SP: 2
   * Response 200: user sau khi update
   * Response 403: Staff cố update user khác
   * Response 409: EMAIL_EXISTS
   */
  async update(id: number, dto: AdminUpdateUserDto | SelfUpdateUserDto, currentUserId: number, currentUserRole: string): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Nếu admin đổi role/status → audit log
    // 2. Nếu đổi status='inactive' → revoke tất cả session
  }

  /**
   * T1.12. DELETE /api/users/:id — Xóa (soft) user
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Response 204
   * Response 404: USER_NOT_FOUND
   * Response 409: USER_HAS_DATA — khi user còn lead active, deal open, activity pending
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Set deleted_at = NOW() + status='deleted'
    // 2. Revoke toàn bộ session
  }

  /**
   * T1.13. POST /api/users/:id/reset-password (Admin)
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Response 204
   * Audit log: action='reset_password', entityType='user', entityId=<id>
   */
  async adminResetPassword(id: number, dto: ResetPasswordDto): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * T1.14. POST /api/users/:id/lock — Khóa tài khoản
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Response 200: user với status='inactive'
   * Logic: set status='inactive' + revoke tất cả session + audit log action='lock'
   */
  async lock(id: number): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * T1.15. POST /api/users/:id/unlock — Mở khóa
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Response 200: user với status='active'
   * Audit log: action='unlock'
   */
  async unlock(id: number): Promise<any> {
    // TODO: Dev 1 implement
  }
}