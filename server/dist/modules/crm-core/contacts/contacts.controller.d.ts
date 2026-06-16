import { ContactsService, CreateContactDto, UpdateContactDto } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    create(dto: CreateContactDto, user: any): Promise<any>;
    list(query: any, user: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    update(id: number, dto: UpdateContactDto, user: any): Promise<any>;
    delete(id: number, user: any): Promise<any>;
}
