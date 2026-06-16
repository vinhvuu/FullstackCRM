import { InvitationsService, CreateInvitationsDto } from './invitations.service';
export declare class InvitationsController {
    private readonly invitationsService;
    constructor(invitationsService: InvitationsService);
    list(query: any): Promise<any>;
    create(dto: CreateInvitationsDto): Promise<any>;
    revoke(id: number): Promise<any>;
    accept(dto: any): Promise<any>;
}
