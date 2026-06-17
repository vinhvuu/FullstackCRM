import { PrefsService, UpdateUserPrefsDto } from './prefs.service';
export declare class PrefsController {
    private readonly prefsService;
    constructor(prefsService: PrefsService);
    get(user: any): Promise<any>;
    update(user: any, dto: UpdateUserPrefsDto): Promise<any>;
}
