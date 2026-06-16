import { Injectable, Logger } from '@nestjs/common';

export interface CreateInvitationsDto {
  emails: string[];
  role: 'admin' | 'user';
  ttlHours: number;
}

@Injectable()
export class InvitationsService {
  private readonly logger = new Logger(InvitationsService.name);

  /**
   * T1.16. POST /api/invitations — Mời user hàng loạt
   * Auth: Authenticated, Role: admin
   * SP: 2
   * Response 201: { data: [...] }
   */
  async createBatch(dto: CreateInvitationsDto): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Với mỗi email chưa tồn tại trong iam_users
    // 2. Insert iam_invitations(email, role, token, expires_at, status='pending', invited_by)
    // 3. Tạo token ngẫu nhiên (32 bytes base64url)
    // 4. Stub gửi email (log)
  }

  /**
   * T1.17. GET /api/invitations — Danh sách invitation
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Query: ?status=pending|accepted|expired|revoked&page=1&limit=20
   * Response 200: mảng invitation + meta
   */
  async list(query: any): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * T1.18. POST /api/invitations/:id/revoke — Thu hồi invitation
   * Auth: Authenticated, Role: admin
   * SP: 1
   * Response 200: invitation với status='revoked'
   */
  async revoke(id: number): Promise<any> {
    // TODO: Dev 1 implement
  }

  /**
   * T1.19. POST /api/invitations/accept — Chấp nhận lời mời
   * Auth: Public
   * SP: 3
   * Response 200: user mới + access token + refresh token
   * Response 400: INVALID_TOKEN
   */
  async accept(dto: any): Promise<any> {
    // TODO: Dev 1 implement
    // 1. Tìm iam_invitations theo token + status='pending' + expires_at > NOW
    // 2. Tạo user mới với role theo invitation
    // 3. Set invitation status='accepted', accepted_at=NOW
    // 4. Auto-login (trả về token luôn)
  }
}