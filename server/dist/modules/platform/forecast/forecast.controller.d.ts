import { ForecastService } from './forecast.service';
export declare class ForecastController {
    private readonly forecastService;
    constructor(forecastService: ForecastService);
    get(periodKey: string, user: any): Promise<any>;
    createSnapshot(periodKey: string, user: any): Promise<any>;
}
