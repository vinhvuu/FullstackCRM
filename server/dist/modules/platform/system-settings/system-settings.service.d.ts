export interface UpdateGeneralSettingsDto {
    systemName: string;
    timezone: string;
    defaultRole: 'admin' | 'user';
    allowSelfRegistration: boolean;
    invitationTtlHours: number;
}
export interface UpdateSlaSettingsDto {
    unassignedAlertHours: number;
    reminderLeadTimeHours: number;
    dormantLeadDays: number;
    poolEnabled: boolean;
    poolClaimLimit: number;
}
export declare class SystemSettingsService {
    private readonly logger;
    getGeneral(): Promise<any>;
    updateGeneral(dto: UpdateGeneralSettingsDto): Promise<any>;
    getSla(): Promise<any>;
    updateSla(dto: UpdateSlaSettingsDto): Promise<any>;
}
