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
export declare class GoalsService {
    private readonly logger;
    list(query: any, userId: number): Promise<any>;
    create(dto: CreateGoalDto): Promise<any>;
    update(id: number, dto: UpdateGoalDto): Promise<any>;
    delete(id: number): Promise<any>;
}
