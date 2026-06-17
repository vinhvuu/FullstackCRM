export interface DashboardWidget {
    id: string;
    type: string;
    w: number;
    h: number;
    x: number;
    y: number;
    refId?: string | null;
}
export interface UpdateDashboardLayoutDto {
    widgets: DashboardWidget[];
}
export declare class DashboardService {
    private readonly logger;
    getStats(): Promise<any>;
    getRecentDeals(query: any): Promise<any>;
    getLayout(userId: number): Promise<any>;
    updateLayout(userId: number, dto: UpdateDashboardLayoutDto): Promise<any>;
}
