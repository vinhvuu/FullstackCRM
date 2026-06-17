import { TimelineService, CreateTimelineItemDto } from './timeline.service';
export declare class TimelineController {
    private readonly timelineService;
    constructor(timelineService: TimelineService);
    list(query: any): Promise<any>;
    create(dto: CreateTimelineItemDto, user: any): Promise<any>;
    getFilters(): Promise<any>;
}
