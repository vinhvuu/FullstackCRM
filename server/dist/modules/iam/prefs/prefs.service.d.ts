export interface UpdateUserPrefsDto {
    language?: 'vi' | 'en';
    timezone?: string;
    density?: 'compact' | 'comfortable';
    emailSignature?: string;
    notify?: Record<string, boolean>;
}
export declare class PrefsService {
    private readonly logger;
    get(userId: number): Promise<any>;
    update(userId: number, dto: UpdateUserPrefsDto): Promise<any>;
}
