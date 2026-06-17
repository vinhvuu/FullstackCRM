import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ForecastService {
  private readonly logger = new Logger(ForecastService.name);

  /**
   * T4.28. GET /api/forecast
   * Auth: Authenticated
   * Query: ?periodKey=2026-Q2
   */
  async get(periodKey: string, userId: number): Promise<any> {
    // TODO: Dev 4 implement
    // Inject SalesDealService.forecastBuckets(periodKey)
  }

  /**
   * T4.29. POST /api/forecast/snapshot — Lưu snapshot (Admin)
   * Auth: Authenticated, Role: admin
   */
  async createSnapshot(periodKey: string, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }
}