import { GoalsService, CreateGoalDto, UpdateGoalDto } from './goals.service';
export declare class GoalsController {
    private readonly goalsService;
    constructor(goalsService: GoalsService);
    list(query: any, user: any): Promise<any>;
    create(dto: CreateGoalDto): Promise<any>;
    update(id: number, dto: UpdateGoalDto): Promise<any>;
    delete(id: number): Promise<any>;
}
