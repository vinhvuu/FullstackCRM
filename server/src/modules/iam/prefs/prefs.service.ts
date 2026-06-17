import { Injectable, Logger } from '@nestjs/common';

export interface UpdateUserPrefsDto {
  language?: 'vi' | 'en';
  timezone?: string;
  density?: 'compact' | 'comfortable';
  emailSignature?: string;
  notify?: Record<string, boolean>;
}

@Injectable()
export class PrefsService {
  private readonly logger = new Logger(PrefsService.name);

  /**
   * T1.22. GET /api/users/me/prefs — User preferences
   * Auth: Authenticated (chính mình)
   * SP: 1
   * Response 200: { language, timezone, density, emailSignature, notify }
   */
  async get(userId: number): Promise<any> {
    // TODO: Dev 1 implement
    // Upsert vào iam_user_prefs(user_id, language, timezone, density, email_signature, notify_json)
  }

  /**
   * T1.22. PUT /api/users/me/prefs — Cập nhật user preferences
   * Auth: Authenticated (chính mình)
   * SP: 1
   * Response 200: updated prefs
   */
  async update(userId: number, dto: UpdateUserPrefsDto): Promise<any> {
    // TODO: Dev 1 implement
  }
}