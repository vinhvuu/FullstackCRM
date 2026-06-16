import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AttachmentsService {
  private readonly logger = new Logger(AttachmentsService.name);

  /**
   * T2.36. POST /api/attachments — Upload file
   * Auth: Authenticated
   * Request: multipart/form-data với field file (≤10MB) + recordType, recordId
   * Response 201: { id, fileName, mimeType, sizeBytes, url, uploadedBy, createdAt }
   * Response 413: quá 10MB
   * Response 415: MIME không hợp lệ
   */
  async upload(file: any, recordType: string, recordId: number, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.37. DELETE /api/attachments/:id
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number, userId: number, userRole: string): Promise<any> {
    // TODO: Dev 2 implement
  }

  /**
   * T2.38. GET /api/attachments/:id/download — Download file
   * Auth: Authenticated
   * Response 200: stream file với Content-Disposition: attachment
   */
  async download(id: number, userId: number): Promise<any> {
    // TODO: Dev 2 implement
  }

  // Export contract methods
  async listByRecord(recordType: string, recordId: number): Promise<any[]> { return []; }
}