export interface RegisterDto {
    email: string;
    password: string;
    name: string;
    phone?: string;
}
export interface LoginDto {
    email: string;
    password: string;
}
export interface RefreshDto {
    refreshToken: string;
}
export interface ForgotPasswordDto {
    email: string;
}
export interface ResetPasswordDto {
    token: string;
    newPassword: string;
}
export declare class AuthService {
    private readonly logger;
    register(dto: RegisterDto): Promise<any>;
    login(dto: LoginDto): Promise<any>;
    refresh(dto: RefreshDto): Promise<any>;
    logout(userId: number): Promise<any>;
    me(userId: number): Promise<any>;
    forgotPassword(dto: ForgotPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
}
