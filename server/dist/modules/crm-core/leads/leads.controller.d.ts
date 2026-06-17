import { LeadsService, CreateLeadDto, UpdateLeadDto, UpdateLeadStatusDto, BulkLeadActionDto, CreateReminderDto, UpdateReminderDto } from './leads.service';
export declare class LeadsController {
    private readonly leadsService;
    constructor(leadsService: LeadsService);
    create(dto: CreateLeadDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateLeadDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
    updateStatus(id: number, dto: UpdateLeadStatusDto, user: any): Promise<any>;
    bulkAction(dto: BulkLeadActionDto, user: any): Promise<any>;
    listReminders(leadId: number): Promise<any>;
    createReminder(leadId: number, dto: CreateReminderDto, user: any): Promise<any>;
    updateReminder(leadId: number, reminderId: number, dto: UpdateReminderDto): Promise<any>;
    deleteReminder(leadId: number, reminderId: number): Promise<any>;
    previewImport(file: any): Promise<any>;
}
