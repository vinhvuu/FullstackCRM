import { CompaniesService, CreateCompanyDto, UpdateCompanyDto } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    create(dto: CreateCompanyDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateCompanyDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
