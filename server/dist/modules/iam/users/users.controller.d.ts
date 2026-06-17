import { UsersService, CreateUserDto, AdminUpdateUserDto, ResetPasswordDto } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    list(query: any): Promise<any>;
    findById(id: number, user: any): Promise<any>;
    create(dto: CreateUserDto): Promise<any>;
    update(id: number, dto: AdminUpdateUserDto, user: any): Promise<any>;
    delete(id: number): Promise<any>;
    adminResetPassword(id: number, dto: ResetPasswordDto): Promise<any>;
    lock(id: number): Promise<any>;
    unlock(id: number): Promise<any>;
}
