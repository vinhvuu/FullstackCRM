export interface CreateCustomFieldDto {
    entity: 'lead' | 'contact' | 'company' | 'deal' | 'quote' | 'activity';
    fieldKey: string;
    label: string;
    type: 'text' | 'number' | 'date' | 'select' | 'checkbox';
    options?: string[];
    required?: boolean;
    displayOrder?: number;
}
export interface UpdateCustomFieldDto {
    label?: string;
    type?: string;
    options?: string[];
    required?: boolean;
    displayOrder?: number;
}
export interface SetCustomFieldValueDto {
    entity: string;
    recordId: number;
    fieldKey: string;
    value: string | number | boolean | null;
}
export declare class CustomFieldsService {
    private readonly logger;
    list(query: any): Promise<any>;
    create(dto: CreateCustomFieldDto): Promise<any>;
    update(id: number, dto: UpdateCustomFieldDto): Promise<any>;
    delete(id: number): Promise<any>;
    getValues(query: any): Promise<any>;
    setValues(dto: SetCustomFieldValueDto, userId: number): Promise<any>;
    getDefs(entity: string): Promise<any[]>;
    validateValues(entity: string, recordId: number, values: any[]): Promise<any>;
}
