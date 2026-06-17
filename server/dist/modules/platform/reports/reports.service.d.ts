export interface CreateReportDefDto {
    name: string;
    entity: 'lead' | 'deal' | 'activity' | 'quote';
    chartType: 'bar' | 'line' | 'pie' | 'table' | 'kpi';
    dimension: string;
    measure: 'count' | 'sum_value' | 'weighted_value' | 'win_rate' | 'conversion_rate';
    filters?: Record<string, any>;
    isShared?: boolean;
}
export interface RunReportDto {
    def?: any;
    defId?: number;
    filters?: any;
}
export interface DrilldownDto {
    def: any;
    bucketValue: string;
    page?: number;
    limit?: number;
}
export declare class ReportsService {
    private readonly logger;
    listPresets(): Promise<any>;
    listDefs(query: any, userId: number): Promise<any>;
    createDef(dto: CreateReportDefDto, userId: number): Promise<any>;
    run(dto: RunReportDto, userId: number): Promise<any>;
    drilldown(dto: DrilldownDto, userId: number): Promise<any>;
    deleteDef(id: number, userId: number): Promise<any>;
}
