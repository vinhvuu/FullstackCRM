import { CustomFieldsService, CreateCustomFieldDto, UpdateCustomFieldDto, SetCustomFieldValueDto } from './custom-fields.service';
export declare class CustomFieldsController {
    private readonly customFieldsService;
    constructor(customFieldsService: CustomFieldsService);
    list(query: any): Promise<any>;
    create(dto: CreateCustomFieldDto): Promise<any>;
    update(id: number, dto: UpdateCustomFieldDto): Promise<any>;
    delete(id: number): Promise<any>;
    getValues(query: any): Promise<any>;
    setValues(dto: SetCustomFieldValueDto, user: any): Promise<any>;
}
