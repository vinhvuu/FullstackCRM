import { Injectable, Logger } from '@nestjs/common';

export interface CreateGoalDto {
  ownerId?: number;
  isTeam: boolean;
  period: 'month' | 'quarter';
  periodKey: string;
  metric: 'revenue' | 'deals_won';
  target: number;
}

export interface UpdateGoalDto {
  target?: number;
}

@Injectable()
export class GoalsService {
  private readonly logger = new Logger(GoalsService.name);

  /**
   * T4.22. GET /api/goals
   * Auth: Authenticated
   * Query: ?ownerId=me|all&isTeam=true|false&period=month|quarter&periodKey=...
   */
  async list(query: any, userId: number): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.23. POST /api/goals — Tạo goal
   * Auth: Authenticated, Role: admin
   */
  async create(dto: CreateGoalDto): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.24. PUT /api/goals/:id
   * Auth: Authenticated (owner hoặc admin)
   */
  async update(id: number, dto: UpdateGoalDto): Promise<any> {
    // TODO: Dev 4 implement
  }

  /**
   * T4.24. DELETE /api/goals/:id
   * Auth: Authenticated (owner hoặc admin)
   * Response 204
   */
  async delete(id: number): Promise<any> {
    // TODO: Dev 4 implement
  }
}