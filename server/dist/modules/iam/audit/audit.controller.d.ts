import { AuditService } from './audit.service';
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    list(query: any): Promise<any>;
    export(query: any): Promise<any>;
}
