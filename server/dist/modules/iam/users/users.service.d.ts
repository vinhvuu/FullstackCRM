export interface CreateUserDto {
    email: string;
    name: string;
    phone?: string;
    password: string;
    role: 'admin' | 'user';
    mustChangePassword?: boolean;
}
export interface AdminUpdateUserDto {
    name?: string;
    phone?: string;
    avatarUrl?: string;
    role?: 'admin' | 'user';
    status?: 'active' | 'inactive' | 'invited';
}
export interface SelfUpdateUserDto {
    name?: string;
    phone?: string;
    avatarUrl?: string;
}
export interface ResetPasswordDto {
    newPassword: string;
}
export declare class UsersService {
    private readonly logger;
    list(query: any): Promise<any>;
    findById(id: number, currentUserId: number, currentUserRole: string): Promise<any>;
    create(dto: CreateUserDto): Promise<any>;
    update(id: number, dto: AdminUpdateUserDto | SelfUpdateUserDto, currentUserId: number, currentUserRole: string): Promise<any>;
    delete(id: number): Promise<any>;
    adminResetPassword(id: number, dto: ResetPasswordDto): Promise<any>;
    lock(id: number): Promise<any>;
    unlock(id: number): Promise<any>;
}
