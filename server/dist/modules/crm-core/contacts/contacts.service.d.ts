export interface CreateContactDto {
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    companyId?: number;
    tags?: string[];
}
export interface UpdateContactDto {
    name?: string;
    email?: string;
    phone?: string;
    position?: string;
    companyId?: number;
    tags?: string[];
}
export declare class ContactsService {
    private readonly logger;
    create(dto: CreateContactDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateContactDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    searchForPicker(query: string, companyId?: number, limit?: number): Promise<any[]>;
    countByCompany(companyId: number): Promise<number>;
}
