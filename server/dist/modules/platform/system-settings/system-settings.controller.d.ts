import { SystemSettingsService, UpdateGeneralSettingsDto, UpdateSlaSettingsDto } from './system-settings.service';
export declare class SystemSettingsController {
    private readonly systemSettingsService;
    constructor(systemSettingsService: SystemSettingsService);
    getGeneral(): Promise<any>;
    updateGeneral(dto: UpdateGeneralSettingsDto): Promise<any>;
    getSla(): Promise<any>;
    updateSla(dto: UpdateSlaSettingsDto): Promise<any>;
}
