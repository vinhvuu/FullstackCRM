export declare class ForecastService {
    private readonly logger;
    get(periodKey: string, userId: number): Promise<any>;
    createSnapshot(periodKey: string, userId: number): Promise<any>;
}
