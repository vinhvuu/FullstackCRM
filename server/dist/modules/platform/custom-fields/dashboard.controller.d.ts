import { DashboardService, UpdateDashboardLayoutDto } from '../dashboard/dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getStats(): Promise<any>;
    getRecentDeals(query: any): Promise<any>;
    getLayout(user: any): Promise<any>;
    updateLayout(user: any, dto: UpdateDashboardLayoutDto): Promise<any>;
}
