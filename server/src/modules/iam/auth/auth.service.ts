import { Injectable, Logger } from '@nestjs/common';

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RefreshDto {
  refreshToken: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  newPassword: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  /**
   * T1.1. POST /api/auth/register — Đăng ký
   * Auth: Public
   * SP: 2
   * Response 201: { id, email, name, role, status }
   * Response 409: EMAIL_EXISTS
   * Response 422: validation fail
   */
  async register(dto: RegisterDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Hash password bằng bcrypt (cost 10)
    // 2. Insert iam_users với role='user', status='active', must_change_password=false
    // 3. Audit log action='create', entityType='user'
  }

  /**
   * T1.2. POST /api/auth/login — Đăng nhập
   * Auth: Public
   * SP: 3
   * Response 200: { accessToken, refreshToken, expiresIn, user }
   * Response 401: INVALID_CREDENTIALS
   * Response 403: ACCOUNT_LOCKED
   */
  async login(dto: LoginDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Tìm user theo email (kèm password_hash)
    // 2. So sánh password hash
    // 3. Tạo access token (TTL 1h, payload {sub, role, status}) + refresh token (TTL 7d)
    // 4. Insert iam_user_sessions(user_id, refresh_token_hash, expires_at, user_agent, ip)
    // 5. Update iam_users.last_login_at = NOW()
    // 6. Audit log action='login', entityType='user', entityId
  }

  /**
   * T1.3. POST /api/auth/refresh — Refresh token
   * Auth: Public (dùng refresh token)
   * SP: 2
   * Response 200: { accessToken, refreshToken, expiresIn, user }
   * Response 401: TOKEN_EXPIRED
   */
  async refresh(dto: RefreshDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Tìm session trong iam_user_sessions (refresh_token_hash match + expires_at > NOW + revoked=false)
    // 2. Revoke session cũ + tạo session mới
    // 3. Trả token mới
  }

  /**
   * T1.4. POST /api/auth/logout — Đăng xuất
   * Auth: Authenticated
   * SP: 1
   * Response 204
   */
  async logout(userId: number): Promise<any> {
    // TODO: Dev 1 implement
    // Set iam_user_sessions.revoked=true WHERE user_id = :id AND user_agent = :currentUA
  }

  /**
   * T1.5. GET /api/auth/me — User hiện tại
   * Auth: Authenticated
   * SP: 1
   * Response 200: { id, email, name, role, status, avatarUrl, lastLoginAt, prefs }
   */
  async me(userId: number): Promise<any> {
    // TODO: Dev 1 implement
    // Join iam_users + iam_user_prefs theo user_id
  }

  /**
   * T1.6. POST /api/auth/forgot-password — Quên mật khẩu
   * Auth: Public
   * SP: 2
   * Response 200: { message: "Nếu email tồn tại..." }
   */
  async forgotPassword(dto: ForgotPasswordDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Nếu email tồn tại: tạo token random (32 bytes, base64url)
    // 2. Lưu iam_password_resets(user_id, token_hash, expires_at = NOW() + 30 min, used=false)
    // 3. Stub gửi email (ghi log console)
    // 4. Audit log action='forgot_password', entityType='user'
  }

  /**
   * T1.7. POST /api/auth/reset-password — Đặt lại mật khẩu
   * Auth: Public
   * SP: 2
   * Response 200: { message }
   * Response 400: INVALID_TOKEN
   */
  async resetPassword(dto: ResetPasswordDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Tìm iam_password_resets theo token_hash + used=false + expires_at > NOW
    // 2. Update iam_users.password_hash + set used=true, used_at=NOW
    // 3. Revoke tất cả session của user
  }
}