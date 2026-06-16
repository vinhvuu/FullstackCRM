export interface CreateProductDto {
    code?: string;
    name: string;
    group?: string;
    unitPrice: number;
    unit?: string;
    currency?: 'VND' | 'USD';
    defaultTaxPct?: number;
    description?: string;
    isActive?: boolean;
}
export interface UpdateProductDto {
    code?: string;
    name?: string;
    group?: string;
    unitPrice?: number;
    unit?: string;
    currency?: 'VND' | 'USD';
    defaultTaxPct?: number;
    description?: string;
    isActive?: boolean;
}
export declare class ProductsService {
    private readonly logger;
    create(dto: CreateProductDto): Promise<any>;
    list(query: any): Promise<any>;
    findById(id: number): Promise<any>;
    update(id: number, dto: UpdateProductDto): Promise<any>;
    delete(id: number): Promise<any>;
    searchForPicker(query: string, limit?: number): Promise<any>;
    isActive(id: number): Promise<boolean>;
}
