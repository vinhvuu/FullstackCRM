import { ActivitiesService, CreateActivityDto, UpdateActivityDto } from './activities.service';
export declare class ActivitiesController {
    private readonly activitiesService;
    constructor(activitiesService: ActivitiesService);
    create(dto: CreateActivityDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateActivityDto, user: any): Promise<any>;
    complete(id: number, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
