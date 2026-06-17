import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(dto: RegisterDto): Promise<any>;
    login(dto: LoginDto): Promise<any>;
    refresh(dto: RefreshDto): Promise<any>;
    logout(user: any): Promise<any>;
    me(user: any): Promise<any>;
    forgotPassword(dto: ForgotPasswordDto): Promise<any>;
    resetPassword(dto: ResetPasswordDto): Promise<any>;
}
