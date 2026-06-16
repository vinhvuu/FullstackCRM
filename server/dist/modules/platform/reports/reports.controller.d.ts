import { ReportsService, CreateReportDefDto, RunReportDto, DrilldownDto } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    listPresets(): Promise<any>;
    listDefs(query: any, user: any): Promise<any>;
    createDef(dto: CreateReportDefDto, user: any): Promise<any>;
    run(dto: RunReportDto, user: any): Promise<any>;
    drilldown(dto: DrilldownDto, user: any): Promise<any>;
    deleteDef(id: number, user: any): Promise<any>;
}
