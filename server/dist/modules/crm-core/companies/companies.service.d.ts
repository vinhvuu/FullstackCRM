export interface CreateCompanyDto {
    name: string;
    website?: string;
    industry?: string;
    size?: string;
    phone?: string;
    address?: string;
    taxCode?: string;
    description?: string;
}
export interface UpdateCompanyDto {
    name?: string;
    website?: string;
    industry?: string;
    size?: string;
    phone?: string;
    address?: string;
    taxCode?: string;
    description?: string;
}
export declare class CompaniesService {
    private readonly logger;
    create(dto: CreateCompanyDto, userId: number): Promise<any>;
    list(query: any, userId: number, userRole: string): Promise<any>;
    findById(id: number, userId: number, userRole: string): Promise<any>;
    update(id: number, dto: UpdateCompanyDto, userId: number, userRole: string): Promise<any>;
    delete(id: number, userId: number, userRole: string): Promise<any>;
    searchForPicker(query: string, limit?: number): Promise<any[]>;
    openDealValueByCompany(companyId: number): Promise<number>;
    openDealCountByCompany(companyId: number): Promise<number>;
}
